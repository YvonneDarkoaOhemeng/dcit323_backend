const Crypto = require("../models/Crypto")

// GET /crypto
const getAllCrypto = async (req, res) => {
  try {
    const cryptos = await Crypto.find()
    res.status(200).json({ cryptos })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

// GET /crypto/gainers
const getTopGainers = async (req, res) => {
  try {
    const gainers = await Crypto.find({ change24h: { $gt: 0 } }).sort({ change24h: -1 })
    res.status(200).json({ cryptos: gainers })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

// GET /crypto/new
const getNewListings = async (req, res) => {
  try {
    const newListings = await Crypto.find().sort({ createdAt: -1 })
    res.status(200).json({ cryptos: newListings })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

// POST /crypto
const addCrypto = async (req, res) => {
  try {
    const { name, symbol, price, image, change24h } = req.body

    if (!name || !symbol || !price || !image || change24h === undefined) {
      return res.status(400).json({
        message: "Please provide name, symbol, price, image and change24h"
      })
    }

    const crypto = await Crypto.create({ name, symbol, price, image, change24h })
    res.status(201).json({ message: "Cryptocurrency added successfully", crypto })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message })
  }
}

module.exports = { getAllCrypto, getTopGainers, getNewListings, addCrypto }