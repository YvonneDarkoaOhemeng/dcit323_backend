const User = require("../models/User")
const jwt = require("jsonwebtoken")

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

const sendTokenCookie = (res, token) => {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
}

// POST /register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" })
    }

    const user = await User.create({ name, email, password })
    const token = createToken(user._id)
    sendTokenCookie(res, token)

    res.status(201).json({
      message: "Account created successfully",
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

// POST /login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide your email and password" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const token = createToken(user._id)
    sendTokenCookie(res, token)

    res.status(200).json({
      message: "Logged in successfully",
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

// GET /profile
const getProfile = async (req, res) => {
  try {
    const user = req.user
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

// POST /logout
const logout = async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) })
  res.status(200).json({ message: "Logged out successfully" })
}

module.exports = { register, login, getProfile, logout }