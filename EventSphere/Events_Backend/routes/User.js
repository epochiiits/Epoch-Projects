const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/event");

router.get("/profile/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const profile = await user.findById(id);
    if (!profile) {
      return res.status(404).send({ error: "Profile not found" });
    }
    res.status(200).send(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/profile/google/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const profile = await user.findOne({ googleId: id });
    if (!profile) {
      return res.status(404).send({ error: "Profile not found" });
    }
    res.status(200).send(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.put("/profile/:id", function (req, res) {
  user
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((err, user) => {
      if (err) return res.status(500).send(err);
      res.json(user);
    });
});

router.post("/register-event", async (req, res) => {
  try {
    const userid = req.body?.userid;
    const eventId = req.body?.eventId;

    if (!userid || !eventId) {
      return res.status(400).json({ error: "Missing userid or event ID" });
    }

    // Update the user's registered events
    const updatedUser = await User.findByIdAndUpdate(
      userid,
      { $push: { events: eventId } }, // Add the event ID to the user's `events` array
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the event's registered users
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $push: { participants: userid } }, // Add the user ID to the event's `participants` array
      { new: true } // Return the updated event document
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    console.log("Received userId:", userid);
    console.log("Received eventId:", eventId);

    res.status(200).json({
      message: "User registered for the event successfully",
      user: updatedUser,
      event: updatedEvent,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

router.post("/unregister-event", async (req, res) => {
  try {
    const userid = req.body?.userid;
    const eventId = req.body?.eventId;

    if (!userid || !eventId) {
      return res.status(400).json({ error: "Missing userid or event ID" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userid,
      { $pull: { events: eventId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { participants: userid } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({
      message: "User unregistered from the event successfully",
      user: updatedUser,
      event: updatedEvent,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

router.post("/add-comment/:id", async (req, res) => {
  const { user, name, rating, comment } = req.body;
  const { id } = req.params;

  if (!user || !name || !rating || !comment) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    const item = await Model.findById(id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const newComment = {
      user,
      name,
      rating,
      comment,
      createdAt: new Date(),
    };

    item.ratings.push(newComment);
    await item.save();

    res
      .status(201)
      .json({ message: "Comment added successfully", ratings: item.ratings });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.delete("/delete-comment/:id/:commentId", async (req, res) => {
  const { id, commentId } = req.params;
  const { userId } = req.body; // Assuming the user ID of the request sender is sent in the request body

  try {
    const item = await Model.findById(id);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const commentIndex = item.ratings.findIndex(
      (rating) => rating._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const comment = item.ratings[commentIndex];

    if (comment.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this comment" });
    }

    item.ratings.splice(commentIndex, 1);
    await item.save();

    res
      .status(200)
      .json({ message: "Comment deleted successfully", ratings: item.ratings });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
