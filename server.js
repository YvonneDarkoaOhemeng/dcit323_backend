
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config()

const authRoutes = require("./routes/authRoutes")
const cryptoRoutes = require("./routes/cryptoRoutes")

const app = express()

// this allows any localhost port during development
// and your deployed netlify url in production
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true)

    // allow any localhost port for local development
    if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
      return callback(null, true)
    }

    // allow your deployed netlify frontend
    const allowedOrigins = [
      process.env.FRONTEND_URL,
    ]

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    // block everything else
    callback(new Error("Not allowed by CORS"))
  },
  credentials: true
}))

// read json from requests
app.use(express.json())

// read cookies from requests
app.use(cookieParser())

// connect routes
app.use("/", authRoutes)
app.use("/crypto", cryptoRoutes)

// test route to check if server is running
app.get("/", (req, res) => {
  res.json({ message: "CryptoTrade Clone API is running!" })
})

// connect to mongodb then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB!")
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message)
  })
