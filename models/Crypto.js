const mongoose = require("mongoose")

const cryptoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the coin name"]
    },
    symbol: {
      type: String,
      required: [true, "Please provide the coin symbol"],
      uppercase: true
    },
    price: {
      type: Number,
      required: [true, "Please provide the coin price"]
    },
    image: {
      type: String,
      required: [true, "Please provide an image url"]
    },
    // positive = price went up, negative = price went down
    change24h: {
      type: Number,
      required: [true, "Please provide the 24h price change"]
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model("Crypto", cryptoSchema)