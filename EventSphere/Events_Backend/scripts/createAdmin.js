require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function createInitialAdmin() {
  try {
    await mongoose.connect(process.env.URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const admin = new Admin({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD
    });

    await admin.save();
    console.log('Admin account created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createInitialAdmin();
