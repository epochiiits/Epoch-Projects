const { google } = require("googleapis");
const axios = require("axios");
const usermodel = require("../models/User");
const express = require("express");
const router = express.Router();
// Google OAuth2 Client Configuration
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
const redirectUri = "postsecret";
const oauth2client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

// Helper function to get user info
const getUserInfo = async (accessToken) => {
  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
  );
  return userRes.data;
};

// Google Login Route Handler
const googleLogin = async (req, res) => {
  try {
    const { tokens } = req.query;

    if (!tokens || !tokens.access_token) {
      return res.status(400).send({ message: "Invalid tokens provided" });
    }

    const userInfo = await getUserInfo(tokens.access_token);
    const { email, name, picture } = userInfo;
    console.log(userInfo);
    const userExists = await usermodel.findOne({ googleId: userInfo.id });
    if (userExists) {
      return res.status(200).send({
        message: "Email Already Exists",
        userId: userExists._id,
        picture: userExists.profilePic,
        name: userExists.name,
        email: userExists.email,
      });
    }
    const newUser = new usermodel({
      googleId: userInfo.id,
      name,
      email,
      profilePic: picture,
    });
    await newUser.save();
    res.status(200).send({
      message: "Account Created Successfully",
      userId: newUser._id,
      picture:picture,
      name:name,
      email:email,
    });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).send("An error occurred during Google login.");
  }
};

router.get("/", (req, res) => googleLogin(req, res));
module.exports = router;
