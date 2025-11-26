const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Order = require("./models/Order");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// CREATE ORDER ENDPOINT
app.post("/api/orders", async (req, res) => {
  try {
    const { customerName, requestedItems } = req.body;

    if (!customerName) {
      return res.status(400).json({ message: "customerName is required" });
    }

    const order = new Order({
      customerName,
      requestedItems
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Start server
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
