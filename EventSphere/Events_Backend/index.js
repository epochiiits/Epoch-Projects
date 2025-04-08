const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const Event = require("./models/event"); // Import Event model
const express = require("express");
const cors = require("cors");
dotenv.config();
const app = express();
const port = 5000;
var bodyParser = require("body-parser");

app.use(express.json());
// app.use(cors());
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));

const { storage } = require("./storage/storage");
// Set up Cloudinary configuration using environment variablesconst { storage } = require('./storage/storage');
const multer = require("multer");
const upload = multer({ storage });
// Connect to MongoDB
mongoose
  .connect("mongodb+srv://koushik:koushik@cluster0.h2lzgvs.mongodb.net/events")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

app.get("/", (req, res) => {
  res.send("Hello");
});

// Create event with image upload to Cloudinary

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use("/auth/google", require("./routes/GoogleAuth"));

app.use("/", require("./routes/User"));
app.use("/", require("./routes/Events"));
app.use("/", require("./routes/Admin"));
app.use("/", require("./routes/Clubs"));
