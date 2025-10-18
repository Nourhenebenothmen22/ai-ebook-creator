// ========================
// 1. Imports & Configuration
// ========================
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const hpp = require("hpp");
const path = require("path");



// Initialisation
const app = express();



// ========================
// 3. Middlewares globaux
// ========================

// Lecture du JSON dans le body
app.use(express.json());

// Lecture des cookies (JWT, etc.)
app.use(cookieParser());

// Sécurité des headers HTTP
app.use(helmet());

// Logging des requêtes HTTP
app.use(morgan("dev"));

// Gérer les requêtes cross-origin (Frontend ↔ Backend)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Nettoyage XSS
app.use(xss());

// Empêcher la pollution des paramètres HTTP
app.use(hpp());

// Compression des réponses HTTP
app.use(compression());

// Limiteur de requêtes (anti-DDOS / brute force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max par IP
  message: "Trop de requêtes depuis cette IP, réessayez plus tard.",
});
app.use(limiter);


// ========================
// 4. Routes de base
// ========================

// Route publique
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "🚀 API running safely!" });
});






// ========================
// 6. Serveur
// ========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
