const express = require('express');
const mongoose = require('mongoose');
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require('jsonwebtoken'); // Importing jsonwebtoken

const app = express();
const port = 5000;

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

const upload = multer({ storage: storage });

// API creation
app.get("/", (req, res) => {
    res.send("Express app is running");
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
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "User already exists" });
        }

        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });

        await user.save();

        const data = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(data, 'secret_ecom');
        res.json({ success: true, token });
    } catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (user) {
            const passCompare = req.body.password === user.password;
            if (passCompare) {
                const data = {
                    user: {
                        id: user.id
                    }
                };
                const token = jwt.sign(data, 'secret');
                res.json({ success: true, token });
            } else {
                res.status(400).json({ success: false, errors: "Wrong password" });
            }
        } else {
            res.status(400).json({ success: false, errors: "Wrong email id" });
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
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
