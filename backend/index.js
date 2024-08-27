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

// Database connection with enhanced error handling
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/grocery";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000 // Increased timeout for server selection
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





// Endpoint to add a product
app.post('/addproduct', async (req, res) => {
    try {
        const { name, image, category, pricePerKg } = req.body;
if (!name || !image || !category || !pricePerKg) {
    return res.status(400).json({ success: false, message: "All fields are required" });
}


        let products = await Product.find({});
        let id;
        if (products.length > 0) {
            let last_product = products[products.length - 1];
            id = last_product.id + 1;
        } else {
            id = 1;
        }

        const newProduct = new Product({
            id: id,
            name,
            image,
            category,
            pricePerKg,
        });

        await newProduct.save();
        res.json({
            success: true,
            name,
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
        type: Object,
        default: Date.now,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

// Signup Endpoint
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
// Get all products
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


app.post('/addtocart',async(req,res)=>{
    console.log(req.body);
})


// Start the server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    } else {
        console.log("Server connection error: " + error);
    }
});
