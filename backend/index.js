require('dotenv').config(); // Import and configure dotenv
const port = 5000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URL,{
    serverSelectionTimeoutMS: 50000 // Default is 30,000 (30 seconds)

})
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.error("Database connection error:", err));


// Static folder
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
    id: {
        type: Number,
        required: true
    },
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
    cartData: {
        type: Object, // Cart data stored with product IDs as keys
        default: {}
    },
    date: {
        type: Date,
        default: Date.now,
    }
});
const authenticateToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ success: false, message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, 'secret_ecom'); // Use your secret key
        req.user = verified.user;
        next();
    } catch (err) {
        res.status(400).json({ success: false, message: 'Invalid Token' });
    }
};

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
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await Users.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, errors: 'User does not exist. Please create an account.' });
        }

        // Check if the password matches
        if (user.password !== password) {
            return res.status(400).json({ success: false, errors: 'Incorrect password.' });
        }

        // Create JWT token
        const data = {
            user: {
                id: user.id,
            },
        };

        const token = jwt.sign(data, 'secret_ecom');
        res.status(200).json({ success: true, token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
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





const fetchUser = (req, res, next) => {
    // Retrieve the token from the request header
    const token = req.header('auth-token');
    
    // If token is not present, deny access
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access Denied: No token provided' });
    }

    try {
        // Verify the token using the secret key
        const verified = jwt.verify(token, 'secret_ecom');
        
        // Attach the verified user to the request object
        req.user = verified.user;
        
        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // If token verification fails, return an error
        res.status(400).json({ success: false, message: 'Invalid Token' });
    }
};






// Add to cart endpoint - updates cart data for authenticated users
app.post('/addtocart', fetchUser, async (req, res) => {
    try {
      const userId = req.user.id; // Get the authenticated user's ID from the token
      const { itemId } = req.body; // Item being added to the cart
  
      // Find the user by their ID
      let userData = await Users.findOne({ _id: userId });
      if (!userData) return res.status(404).json({ success: false, message: 'User not found' });
  
      // Increment the quantity of the item in the cart
      if (!userData.cartData[itemId]) {
        userData.cartData[itemId] = 1; // Initialize with quantity 1 if not already in the cart
      } else {
        userData.cartData[itemId] += 1; // Increment the quantity
      }
  
      // Save the updated cart back to the database
      const updatedUser = await Users.findOneAndUpdate(
        { _id: userId }, // Find user by ID
        { cartData: userData.cartData }, // Update cartData field
        { new: true } // Return the updated document
      );
  
      console.log('Updated cart:', updatedUser.cartData); // Log the updated cart for debugging
      res.json({ success: true, message: 'Product added to cart', cart: updatedUser.cartData });
  
    } catch (err) {
      console.error('Error updating cart:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
    }
  });
  

// Start the server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    } else {
        console.log("Server connection error: " + error);
    }
});
