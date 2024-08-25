const express = require('express');
const mongoose = require('mongoose');
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
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
        // Convert email to lowercase to ensure consistency
        let email = req.body.email.toLowerCase();

        // Check if the user already exists
        let check = await Users.findOne({ email });
        if (check) {
            return res.status(400).json({ success: false, errors: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log("Hashed Password during signup:", hashedPassword); // Debug log

        // Initialize an empty cart
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        // Create a new user
        const user = new Users({
            name: req.body.username,
            email: email,
            password: hashedPassword,
            cartData: cart,
        });

        // Save the user to the database
        await user.save();

        // Generate JWT token
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
    const { email, password } = req.body;

    try {
        // Convert email to lowercase to avoid case sensitivity issues
        const user = await Users.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ success: false, errors: "User does not exist. Please create an account." });
        }

        console.log("Hashed Password in DB:", user.password); // Debug log

        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", isMatch); // Debug log
        if (!isMatch) {
            return res.status(400).json({ success: false, errors: "Incorrect password." });
        }

        // Generate JWT token
        const data = {
            user: {
                id: user.id
            }
        };
        const token = jwt.sign(data, 'secret_ecom');
        res.status(200).json({ success: true, token });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
