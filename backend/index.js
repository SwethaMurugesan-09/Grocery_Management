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

// Database connection with enhanced error handling
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/grocery";

mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 30000 // Increased timeout for server selection
})
.then(() => console.log("Database connected successfully"))
.catch(err => console.error("Database connection error:", err));

// API creation
app.get("/", (req, res) => {
    res.send("Express app is running");
});

// Image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

app.use('/images', express.static('upload/images'));
app.post("/upload", upload.single('product'), (req, res) => {
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
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    pricePerKg: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
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
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
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
        console.log(newProduct);
        await newProduct.save();
        console.log("Saved");
        res.json({
            success: true,
            name,
        });
    } catch (err) {
        console.error("Error saving product:", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

app.post('/removeproduct',async(req,res)=>
{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("removed");
    res.json({
        success:true,
        name:req.body.name
    }
    )
})

app.get('/allproducts',async(req,res)=>
{
    let products=await Product.find({});
    console.log("all products fetched");
    res.send(products);
})
// Start the server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    } else {
        console.log("Server connection error: " + error);
    }
});
