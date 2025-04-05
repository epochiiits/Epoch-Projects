const express = require("express");
const router = express.Router();
const Events = require("../models/event");
const cloudinary = require('cloudinary').v2;
const nodemailer = require('nodemailer');
const Clubs = require('../models/Club');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

router.get("/events", async (req, res) => {
  try {
    // Ensure Events model is correctly imported
    const allEvents = await Events.find();
    res.status(200).json(allEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post("/events", async (req, res) => {
  try {
    console.log("Received event data:", JSON.stringify(req.body, null, 2));
    
    // Extract all fields from the request body
    const {
      title, description, image, date, time, venue,
      isTeamEvent, teamSize, prizeMoney, isPaid, amount, event_type, contactInfo,
    } = req.body;

    // Log what fields we received to debug
    console.log('Received fields:', {
      title: !!title,
      description: !!description, 
      image: !!image,
      date: !!date,
      time: !!time,
      venue: !!venue,
      isTeamEvent: isTeamEvent,
      teamSize: teamSize,
      prizeMoney: prizeMoney,
      isPaid: isPaid,
      amount: amount,
      event_type: event_type,
      contactInfo: !!contactInfo
    });

    // Validate required fields
    if (!title || !description || !image || !date || !time || !venue || isTeamEvent === undefined || !contactInfo) {
      console.log("Missing required fields");
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Upload image to Cloudinary
      console.log("Uploading image to Cloudinary...");
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'event_images',
      });
      
      console.log("Image uploaded successfully:", uploadResponse.secure_url);

      // Create event document with proper field mapping
      const eventDocument = {
        title: title,
        description: description,
        imageUrl: uploadResponse.secure_url, // Note: schema field is imageUrl, not image
        date: new Date(date), // Convert string date to Date object
        time: time,
        venue: venue,
        isTeamEvent: Boolean(isTeamEvent), // Ensure boolean
        teamSize: teamSize ? Number(teamSize) : 1, // Ensure number
        prizeMoney: prizeMoney ? Number(prizeMoney) : 0, // Ensure number
        isPaid: Boolean(isPaid), // Ensure boolean
        amount: amount ? Number(amount) : 0, // Ensure number
        event_type: event_type, 
        contactInfo: contactInfo,
        // Default values handled by schema
      };

      console.log("Creating new event with data:", eventDocument);
      
      const newEvent = new Events(eventDocument);
      const savedEvent = await newEvent.save();
      
      console.log("Event saved successfully with ID:", savedEvent._id);
      
      res.status(201).json({ 
        message: 'Event created successfully', 
        event: savedEvent 
      });
    } catch (uploadError) {
      console.error('Error during image upload or event creation:', uploadError);
      res.status(500).json({ 
        error: 'Error processing image or saving event: ' + uploadError.message 
      });
    }
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      error: 'Failed to create event. Please try again.' 
    });
  }
});

// Keep your other routes unchanged
router.get('/events/:id', async (req, res) => {
  try {
    const event = await Events.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/events/:id/accept', async (req, res) => {
  try {
    const event = await Events.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    event.status = 'accepted';
    await event.save();
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})  

router.put('/events/:id', async (req, res) => {
  try {
    const updatedEvent = await Events.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;