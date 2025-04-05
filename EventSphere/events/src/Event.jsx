"use client";

import RegisterEvent from "./RegisterEvent";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  User,
  Star,
  StarIcon,
  Calendar,
  Clock,
  Users,
  Trophy,
  DollarSign,
  Building,
} from "lucide-react";
import { useState, useTransition } from "react";

// Sample event data matching MongoDB schema
const eventDetails = {
  title: "Tech Conference 2024",
  event_type: "Conference",
  description:
    "Join us for the biggest tech conference of the year, featuring industry leaders, innovative workshops, and networking opportunities.",
  clubs: [
    {
      _id: "1",
      name: "Tech Club",
      imageUrl: "/assets/epoch.jpg",
    },
  ],
  imageUrl: "",
  date: new Date("2024-03-15"),
  time: "10:00 AM",
  venue: "Main Auditorium",
  isTeamEvent: true,
  teamSize: 4,
  prizeMoney: 5000,
  isPaid: true,
  amount: 100,
  category: "Technology",
  contactInfo: "+1 (555) 123-4567",
  status: "upcoming",
  about:
    "A comprehensive tech conference covering the latest trends in technology.",
  timeline: [
    {
      time: "10:00 AM",
      speaker: "Sarah Johnson",
      topic: "Future of AI",
      description:
        "Exploring the latest developments in artificial intelligence",
    },
    {
      time: "2:00 PM",
      speaker: "Michael Chen",
      topic: "Web3 Technologies",
      description: "Understanding blockchain and decentralized applications",
    },
  ],
  ratings: [
    {
      name: "John Doe",
      profile: "/placeholder.svg?height=40&width=40",
      rating: 5,
      comment:
        "Amazing conference! The speakers were incredibly knowledgeable.",
      createdAt: new Date("2024-01-15"),
    },
    {
      name: "Jane Smith",
      profile: "/placeholder.svg?height=40&width=40",
      rating: 4,
      comment: "Great networking opportunities. Would definitely attend again.",
      createdAt: new Date("2024-01-14"),
    },
  ],
  prices: ["Early Bird: $80", "Regular: $100", "VIP: $150"],
  remarks: ["Bring your laptop", "Certificate provided", "Lunch included"],
};

export default function EventDetails() {
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [ratings, setRatings] = useState(eventDetails.ratings);
  const [error, setError] = useState("");

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!rating) {
      setError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setError("Please enter a comment");
      return;
    }

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    startTransition(() => {
      const newRating = {
        name,
        profile: "/placeholder.svg?height=40&width=40",
        rating,
        comment,
        createdAt: new Date(),
      };

      setRatings([newRating, ...ratings]);
      setComment("");
      setName("");
      setRating(0);
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <img
          src={eventDetails.imageUrl || "/assets/EventBg.jpg"}
          alt={eventDetails.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute bottom-0 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex gap-2">
                {eventDetails.clubs.map((club) => (
                  <a key={club._id} href={`/club/${club.name}`}>
                    <img
                      key={club._id}
                      src={club.imageUrl || "/placeholder.svg"}
                      alt={club.name}
                      className="h-12 w-12 object-cover rounded-full border-2 border-purple-500"
                    />
                  </a>
                ))}
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold text-white">
                {eventDetails.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-white/80">
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {formatDate(eventDetails.date)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {eventDetails.time}
                </span>
                <span className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {eventDetails.venue}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <div className="space-y-12">
          {/* Quick Info */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
          >
            {eventDetails.isTeamEvent && (
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm space-y-2">
                <Users className="h-6 w-6 text-purple-500" />
                <h3 className="font-semibold text-purple-500">Team Event</h3>
                <p className="text-gray-300">
                  Team Size: {eventDetails.teamSize}
                </p>
              </div>
            )}
            {eventDetails.prizeMoney > 0 && (
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm space-y-2">
                <Trophy className="h-6 w-6 text-purple-500" />
                <h3 className="font-semibold text-purple-500">Prize Money</h3>
                <p className="text-gray-300">${eventDetails.prizeMoney}</p>
              </div>
            )}
            {eventDetails.isPaid && (
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm space-y-2">
                <DollarSign className="h-6 w-6 text-purple-500" />
                <h3 className="font-semibold text-purple-500">Entry Fee</h3>
                <p className="text-gray-300">${eventDetails.amount}</p>
              </div>
            )}
          </motion.section>

          {/* About */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold text-purple-500">
              About the Event
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {eventDetails.about || eventDetails.description}
            </p>
          </motion.section>

          {/* Timeline */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-purple-500">
              Event Timeline
            </h2>
            <div className="space-y-6">
              {eventDetails.timeline.map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-white/5 backdrop-blur-sm space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-purple-500" />
                    <div>
                      <h3 className="text-purple-500 font-semibold">
                        {item.speaker}
                      </h3>
                      <p className="text-sm text-gray-400">{item.topic}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-gray-300">
                    <p className="text-sm">Time: {item.time}</p>
                    <p className="text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Prices */}
          {eventDetails.prices.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-purple-500">
                Ticket Prices
              </h2>
              <ul className="grid gap-3">
                {eventDetails.prices.map((price, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <div className="h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" />
                    {price}
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* Important Remarks */}
          {eventDetails.remarks.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-purple-500">
                Important Remarks
              </h2>
              <ul className="grid gap-3">
                {eventDetails.remarks.map((remark, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <div className="h-2 w-2 rounded-full bg-purple-500 flex-shrink-0" />
                    {remark}
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* Contact Info */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-white/5 backdrop-blur-sm p-6 space-y-4"
          >
            <h2 className="text-2xl font-semibold text-purple-500">
              Contact Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="h-5 w-5 text-purple-500" />
                <span>{eventDetails.contactInfo}</span>
              </div>
            </div>
          </motion.section>

          {/* Comments and Ratings Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-semibold text-purple-500">
              Comments & Ratings
            </h2>

            {/* Comment Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-xl bg-white/5 backdrop-blur-sm p-6"
            >
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <StarIcon
                        className={`h-6 w-6 ${
                          star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isPending}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-300 disabled:opacity-50"
              >
                {isPending ? "Submitting..." : "Submit Comment"}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {ratings.map((rating, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl bg-white/5 backdrop-blur-sm p-6 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <img
                        src={rating.profile || "/placeholder.svg"}
                        alt={rating.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="space-y-1">
                        <h3 className="font-semibold text-purple-500">
                          {rating.name}
                        </h3>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < rating.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-400"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {formatDate(rating.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-300">{rating.comment}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <RegisterEvent eventId={1234} userId={1234} />
        </div>
      </div>
    </div>
  );
}
