const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Events = require('../models/event');
const authMiddleware = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Email configuration
const emailUser = process.env.EMAIL;
const emailPassword = process.env.EMAIL_PASSWORD;


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPassword
    }
});

// Admin login route
router.post("/admin/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find admin by email
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        console.log(process.env)
        const token = jwt.sign(
            { adminId: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            id: admin._id,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/admin/events", authMiddleware, async (req, res) => {
    try {
        const events = await Events.find({});
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/admin/requests", authMiddleware, async (req, res) => {
    try {
        const requestEvents = await Events.find({ status: 'pending' });
        res.json(requestEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/admin/accept-event/:id", authMiddleware, async (req, res) => {
    const eventId = req.params.id;
    try {
        const event = await Events.findById(eventId);
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        event.status = 'approved';
        await event.save();

        const mailOptions = {
            from: emailUser,
            to: event.clubs[0].email,
            subject: 'Event Accepted',
            text: 'Your event has been accepted and is now live on our platform.'
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.error('Email error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(200).json({ 
            message: 'Event accepted and status updated to approved successfully' 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete("/admin/delete-event/:id", authMiddleware, async (req, res) => {
    const eventId = req.params.id;
    try {
        const event = await Events.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await Events.findByIdAndDelete(eventId);

        const mailOptions = {
            from: emailUser,
            to: event.clubs[0].email,
            subject: 'Event Deleted',
            text: 'Your event has been deleted from our platform.'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete("/admin/delete-request/:id", authMiddleware, async (req, res) => {
    const requestId = req.params.id;
    try {
        const request = await Events.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        await Events.findByIdAndDelete(requestId);
        
        const mailOptions = {
            from: emailUser,
            to: request.clubs[0].email,
            subject: 'Event Request Deleted',
            text: 'Your event request has been deleted from our platform.'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        return res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/admin/add-remark/:id", authMiddleware, async (req, res) => {
    const id = req.params.id;
    const { remark } = req.body;
    try {
        const event = await Events.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        if (!event.remarks) {
            event.remarks = [];
        }
        
        event.remarks.push({
            text: remark,
            timestamp: new Date(),
            adminId: req.adminId
        });
        
        await event.save();

        res.status(200).json({ 
            message: 'Remark added successfully',
            remarks: event.remarks 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post("/admin/add-remark-to-event/:id", authMiddleware, async (req, res) => {
    const id = req.params.id;
    const { remark } = req.body;
    try {
        const event = await Events.findById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        if (!event.remarks) {
            event.remarks = [];
        }

        event.remarks.push({
            text: remark,
            timestamp: new Date(),
            adminId: req.adminId
        });

        await event.save();

        const mailOptions = {
            from: emailUser,
            to: event.clubs[0].email,
            subject: 'New Remark Added to Your Event',
            text: `A new remark has been added to your event: ${remark}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email error:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(200).json({ 
            message: 'Remark added to event successfully',
            remarks: event.remarks 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
