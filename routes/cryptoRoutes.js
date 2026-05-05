const express = require("express")
const router = express.Router()
const { getAllCrypto, getTopGainers, getNewListings, addCrypto } = require("../controllers/cryptoController")

router.get("/", getAllCrypto)
router.get("/gainers", getTopGainers)
router.get("/new", getNewListings)
router.post("/", addCrypto)

module.exports = router