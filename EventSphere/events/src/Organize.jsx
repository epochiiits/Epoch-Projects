import { useState } from 'react';
import axios from 'axios';

export default function AddEvent() {
  const [eventDetails, setEventDetails] = useState({
    title: '',
    description: '',
    eventType: '', // Added event type
    date: '',      // Added event date
    time: '',      // Added event time
    location: '',  // Added event location
    speakers: '',  // Added speakers
    image: '',     // Image field remains
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setEventDetails((prevDetails) => ({
        ...prevDetails,
        image: reader.result, // Store base64 image data
      }));
    };

    if (file) {
      reader.readAsDataURL(file); // Convert image file to base64 string
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/create', eventDetails, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 bg-gray-800 text-white">
      <h1 className="text-3xl font-semibold mb-8">Add New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Title */}
        <div>
          <label htmlFor="title" className="block text-lg font-medium">Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={eventDetails.title}
            onChange={handleChange}
            className="w-full p-3 mt-2 bg-gray-700 rounded-lg text-white"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-lg font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            value={eventDetails.description}
            onChange={handleChange}
            className="w-full p-3 mt-2 bg-gray-700 rounded-lg text-white"
            required
          />
        </div>

        {/* Event Type */}
        <div>
          <label htmlFor="eventType" className="block text-lg font-medium">Event Type</label>
          <select
            id="eventType"
            name="eventType"
            value={eventDetails.eventType}
            onChange={handleChange}
            className="w-full p-3 mt-2 bg-gray-700 rounded-lg text-white"
            required
          >
            <option value="">Select Event Type</option>
            <option value="webinar">Webinar</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="meeting">Meeting</option>
          </select>
        </div>

        {/* Event Date */}
        <div>
          <label htmlFor="date" className="block text-lg font-medium">Event Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={eventDetails.date}
            onChange={handleChange}
            className="w-full p-3 mt-2 bg-gray-700 rounded-lg text-white"
            required
          />
        </div>

        {/* Event Time */}
        <div>
          <label htmlFor="time" className="block text-lg font-medium">Event Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={eventDetails.time}
            onChange={handleChange}
            className="w-full p-3 mt-2 bg-gray-700 rounded-lg text-white"
            required
          />
        </div>

        {/* Location (for hybrid events) */}
        <div>
          <label htmlFor="location" className="block text-lg font-medium">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={eventDetails.location}
            onChange={handleChange}
            className="w-full p-3 mt-2 bg-gray-700 rounded-lg text-white"
          />
        </div>

        {/* Speakers */}
        <div>
          <label htmlFor="speakers" className="block text-lg font-medium">Speakers</label>
          <input
            type="text"
            id="speakers"
            name="speakers"
            value={eventDetails.speakers}
            onChange={handleChange}
            className="w-full p-3 mt-2 bg-gray-700 rounded-lg text-white"
          />
        </div>

        {/* Event Image */}
        <div>
          <label htmlFor="image" className="block text-lg font-medium">Event Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 mt-2 bg-gray-700 rounded-lg text-white"
            required
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-8 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition duration-300"
          >
            Add Event
          </button>
        </div>
      </form>
    </div>
  );
}
