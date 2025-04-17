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
  Award,
  Ticket,
  Loader2,
  Trash2,
} from "lucide-react";
import { useState, useEffect, useTransition } from "react";
import { useParams } from "react-router-dom";
import { Apis } from "./apiserveices/api";
import { Base_Url } from "./apiserveices/api";
import Cookies from "js-cookie";
import axios from "axios"; // Import axios

export default function EventDetails() {
  const { id } = useParams();
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [modalopen, setmodalopen] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState("");
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userid = Cookies.get("user");

  const closemodal = () => {
    setmodalopen(false);
  };

  useEffect(() => {
    const cookies = Cookies.get("user");
    if (!cookies) {
      alert("You must Login to continue");
      window.location.href = "/";
    } else {
      // Set the name from user data if available
      try {
        const userData = JSON.parse(cookies);
        if (userData.name) {
          setName(userData.name);
        }
      } catch (e) {
        // If cookies value is not JSON parseable, just use it as is
        console.log("Could not parse user cookie data");
      }
    }
  }, []);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventData = await Apis.fetchEventDetails(id);
        setEvent(eventData);
        setRatings(eventData.ratings || []);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setError("Failed to load event details");
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Updated handleSubmit to use axios instead of fetch
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Form validation
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

    // Start submission state
    setIsSubmitting(true);

    try {
      // Call API to submit the rating using axios
      const response = await axios.post(`${Base_Url}/add-comment/${id}`, {
        user: userid,
        name,
        rating,
        comment,
      });

      // Axios automatically transforms JSON response
      const data = response.data;

      // Update the local state with the updated ratings from server
      setRatings(data.ratings);

      // Reset form
      setComment("");
      setRating(0);

      // Keep the name as it was before if the user already entered it
    } catch (err) {
      console.error("Error submitting rating:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to submit comment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to delete a comment using axios
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `${Base_Url}/delete-comment/${id}/${commentId}`,
        {
          data: { userId: userid }, // For DELETE requests, use 'data' property
        }
      );

      // Axios automatically transforms JSON response
      const data = response.data;

      // Update the local state with the updated ratings from server
      setRatings(data.ratings);
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert(
        err.response?.data?.error ||
          "Failed to delete comment. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error && !ratings.length) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Event not found</div>
      </div>
    );
  }

  // Determine if event is upcoming or past
  const eventDate = new Date(event.date);
  const now = new Date();
  const isUpcoming = eventDate >= now;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <img
          src={event.imageUrl || "/assets/EventBg.jpg"}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/assets/EventBg.jpg";
          }}
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
                {event.clubs &&
                  event.clubs.map((club) => (
                    <a key={club._id} href={`/club/${club._id}`}>
                      <img
                        src={club.imageUrl || ""}
                        alt={club.name}
                        className="h-12 w-12 object-cover rounded-full border-2 border-purple-500"
                        onError={(e) => {
                          e.target.src = "";
                        }}
                      />
                    </a>
                  ))}
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold text-white">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-white/80">
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {formatDate(event.date)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {event.time || "TBA"}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {event.venue || "Location not specified"}
                </span>
                {event.category && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-600/80 text-white">
                    {event.category}
                  </span>
                )}
                {event.event_type && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-600/80 text-white">
                    {event.event_type}
                  </span>
                )}
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
            {event.isTeamEvent && (
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm space-y-2">
                <Users className="h-6 w-6 text-purple-500" />
                <h3 className="font-semibold text-purple-500">Team Event</h3>
                <p className="text-gray-300">
                  Team Size: {event.teamSize || 1}
                </p>
              </div>
            )}
            {event.prizeMoney > 0 && (
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm space-y-2">
                <Award className="h-6 w-6 text-purple-500" />
                <h3 className="font-semibold text-purple-500">Prize Money</h3>
                <p className="text-gray-300">${event.prizeMoney}</p>
              </div>
            )}
            {event.isPaid && (
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm space-y-2">
                <Ticket className="h-6 w-6 text-purple-500" />
                <h3 className="font-semibold text-purple-500">Entry Fee</h3>
                <p className="text-gray-300">${event.amount || 0}</p>
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
              {event.about || event.description || "No description available"}
            </p>
          </motion.section>

          {/* Timeline */}
          {event.timeline && event.timeline.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-purple-500">
                Event Timeline
              </h2>
              <div className="space-y-6">
                {event.timeline.map((item, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-white/5 backdrop-blur-sm space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-purple-500" />
                      <div>
                        <h3 className="text-purple-500 font-semibold">
                          {item.speaker || "Speaker"}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {item.topic || "Topic"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1 text-gray-300">
                      <p className="text-sm">Time: {item.time || "TBA"}</p>
                      <p className="text-sm">
                        {item.description || "No description"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Prices */}
          {event.prices && event.prices.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-purple-500">
                Ticket Prices
              </h2>
              <ul className="grid gap-3">
                {event.prices.map((price, index) => (
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
          {event.remarks && event.remarks.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-semibold text-purple-500">
                Important Remarks
              </h2>
              <ul className="grid gap-3">
                {event.remarks.map((remark, index) => (
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
                <span>{event.contactInfo || "Contact not available"}</span>
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
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-300 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Comment"}
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
                        src={rating.profile || ""}
                        alt={rating.name}
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = "";
                        }}
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
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">
                        {formatDate(rating.createdAt)}
                      </span>

                      {/* Show delete button only for the user's own comments */}
                      {rating.user === userid && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(rating._id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300">{rating.comment}</p>
                </motion.div>
              ))}

              {ratings.length === 0 && (
                <p className="text-gray-400 text-center italic">
                  No comments yet. Be the first to leave a review!
                </p>
              )}
            </div>
          </motion.section>

          {/* Registration button */}
          <button
            onClick={() => setmodalopen(true)}
            className="px-8 py-3 bg-purple-900 text-white rounded-lg hover:bg-purple-800 transition duration-300 flex items-center gap-2"
          >
            <User className="h-5 w-5" />
            Register Now
          </button>

          {/* Registration Component */}
          {isUpcoming && modalopen && (
            <RegisterEvent userId={userid} event={event} onClose={closemodal} />
          )}
        </div>
      </div>
    </div>
  );
}
