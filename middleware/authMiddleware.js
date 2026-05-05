const jwt = require("jsonwebtoken")
const User = require("../models/User")

// this runs before protected routes to check if user is logged in
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    if (!token) {
      return res.status(401).json({ message: "You need to log in to access this" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select("-password")
    next()
  } catch (error) {
    res.status(401).json({ message: "Your session has expired, please log in again" })
  }
}

module.exports = { protect }