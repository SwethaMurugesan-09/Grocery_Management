require('dotenv').config(); 
const port = 5000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URL,{
    serverSelectionTimeoutMS: 50000 

})
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.error("Database connection error:", err));


app.use('/images', express.static('upload/images'));

// Image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

app.get("/", (req, res) => {
    res.send("Express app is running");
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, message: "No file uploaded" });
    }
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Schema for creating products
const Product = mongoose.model("Product", {
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    pricePerKg: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

// Endpoint to add a product with unique product IDs
app.post('/addproduct', async (req, res) => {
    try {
        const { name, image, category, pricePerKg } = req.body;
        if (!name || !image || !category || !pricePerKg) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Fetch all products from the database
        let products = await Product.find({});

        // Determine the new product ID by finding the highest existing ID
        let id;
        if (products.length > 0) {
            let last_product = products[products.length - 1];
            id = last_product.id + 1; // Increment the last product's ID by 1
        } else {
            id = 1; // If there are no products, start with ID 1
        }

        // Create a new product with the generated ID
        const newProduct = new Product({
            id: id,
            name,
            image,
            category,
            pricePerKg,
        });

        // Save the new product to the database
        await newProduct.save();
        
        // Respond with a success message and the product name
        res.json({
            success: true,
            name,
            id, // Returning the newly created product ID as well
        });
    } catch (err) {
        console.error("Error saving product:", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Users Schema
const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

app.post('/signup', async (req, res) => {
    try {
        // Check if the user already exists
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: 'User already exists' });
        }

        // Create default cart data
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        // Create new user
        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });

        // Save user to database
        await user.save();

        // Create JWT token
        const data = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(data, 'secret_ecom');
        res.json({ success: true, token });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    let user = await Users.findOne({email:req.body.email});
    if(user)
    {
        const passCompare=req.body.password===user.password;
        if(passCompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,error:"Wrong Email Id"})
    }
});

app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        res.json({
            success: true,
            message: "Product removed successfully"
        });
    } catch (err) {
        console.error("Error removing product:", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

app.post('/updateproduct', async (req, res) => {
    try {
        const { id, name, pricePerKg, category } = req.body;
        
        // Ensure all required fields are provided
        if (!id || !name || !pricePerKg || !category) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Update the product using the MongoDB _id
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id }, // Use _id for query
            { name, pricePerKg, category }, // Update these fields
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, updatedProduct });
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});




// Get all products with optional category filter
app.get('/allproducts', async (req, res) => {
    try {
        const { category } = req.query; // Get category from query params
        let query = {};
        
        if (category && category !== 'all') {
            query.category = category; // Filter by category if provided
        }

        let products = await Product.find(query);
        res.json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
      return res.status(401).send({ errors: "Please authenticate using valid token" });
    }
    try {
      const data = jwt.verify(token, 'secret_ecom');
      req.user = data.user;
      next();
    } catch (error) {
      return res.status(401).send({ errors: "Please authenticate using valid token" });
    }
  };
  
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log(req.body, req.user);

    // Fetch user data from the database
    let userData = await Users.findOne({ _id: req.user.id });
    
    if (!userData) {
        return res.status(404).send({ error: "User not found" });
    }

    // Initialize cartData if it does not exist
    if (!userData.cartData) {
        userData.cartData = {};
    }

    // Add item to cart or increase quantity
    userData.cartData[req.body.itemId.id] = {
        ...req.body.itemId,
        quantity: (userData.cartData[req.body.itemId.id]?.quantity || 0) + 1,
    };

    // Update the user with the new cartData and return the updated document
    let updatedUser = await Users.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: { cartData: userData.cartData } },
        { new: true } // Return the updated document
    );

    if (!updatedUser) {
        return res.status(500).send({ error: "Failed to update cart" });
    }

    res.send("Item added to cart");
});


app.post('/removfromcart',fetchUser,async(req,res)=>{
    console.log(req.body,req.user)
    let userData=await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId]-=1;
    await Users.findByIdAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
})



app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    } else {
        console.log("Server connection error: " + error);
    }
});
