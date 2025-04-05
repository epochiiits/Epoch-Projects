const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, default: null },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePic: { type: String, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
