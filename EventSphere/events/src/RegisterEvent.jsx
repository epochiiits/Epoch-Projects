import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Base_Url } from "./apiserveices/api";

const RegisterEvent = ({ eventId, userId, teamSize }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Only show team options if teamSize is greater than 0
  const showTeamOptions = teamSize > 0;

  const [isTeamEvent, setIsTeamEvent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    teamName: "",
    members: Array.from({ length: teamSize || 0 }, () => ({
      name: "",
      email: "",
    })),
  });

  // Check if user is already registered for this event
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!userId || !eventId) return;

      try {
        const response = await axios.get(
          `${Base_Url}/check-registration-status`,
          {
            params: {
              userid: userId,
              eventId: eventId,
            },
          }
        );

        setIsRegistered(response.data.isRegistered);
      } catch (error) {
        console.error("Error checking registration status:", error);
      }
    };

    checkRegistrationStatus();
  }, [userId, eventId]);

  // Effect to handle delayed form close on success
  useEffect(() => {
    let timer;
    if (registrationSuccess) {
      timer = setTimeout(() => {
        setShowForm(false);
        setRegistrationSuccess(false);
      }, 3000); // Close form after 3 seconds on success
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [registrationSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMemberChange = (index, field, value) => {
    if (!showTeamOptions) return;

    const updatedMembers = [...formData.members];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      members: updatedMembers,
    });
  };

  const handleUnregister = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${Base_Url}/unregister-event`,
        {
          userid: userId,
          eventId: eventId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setMessage("Unregistered successfully!");
        setIsRegistered(false);
      } else {
        setMessage("Failed to unregister. Please try again.");
      }
    } catch (error) {
      setMessage("Failed to unregister. Please try again.");
      console.error("Error unregistering:", error);
    } finally {
      setLoading(false);

      // Show the message for a few seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setRegistrationSuccess(false); // Reset success state

    try {
      // Prepare submission data
      const submissionData = {
        eventId,
        userid: userId,
        leadInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      };

      // Add team information if it's a team event and team options are available
      if (isTeamEvent && showTeamOptions) {
        submissionData.isTeam = true;
        submissionData.teamName = formData.teamName;
        // Only include members with name and email
        submissionData.members = formData.members.filter(
          (member) => member.name && member.email
        );
      }

      const response = await axios.post(
        `${Base_Url}/register-event`,
        submissionData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setMessage("Registered successfully!");
        setRegistrationSuccess(true); // Set success flag
        setIsRegistered(true); // Update registration status

        // Reset form data
        setFormData({
          name: "",
          email: "",
          phone: "",
          teamName: "",
          members: Array.from({ length: teamSize || 0 }, () => ({
            name: "",
            email: "",
          })),
        });
      } else {
        setMessage("Failed to register. Please try again.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error === "User already registered for the event"
      ) {
        setMessage("You are already registered for this event!");
        setIsRegistered(true);
      } else {
        setMessage("Failed to register. Please try again.");
      }
      console.error("Error registering:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-200">
      {!showForm ? (
        /* Register/Unregister Button */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-center mt-8"
        >
          {isRegistered ? (
            <button
              onClick={handleUnregister}
              className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300"
              disabled={loading}
            >
              {loading ? "Processing..." : "Unregister"}
            </button>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300"
            >
              Register Now
            </button>
          )}

          {/* Show message if form is closed but message exists */}
          {message && !showForm && (
            <div
              className={`fixed top-4 right-4 ${
                isRegistered
                  ? "bg-red-800 border border-red-600"
                  : "bg-green-800 border border-green-600"
              } text-green-100 px-4 py-3 rounded shadow-md`}
            >
              {message}
            </div>
          )}
        </motion.div>
      ) : (
        /* Registration Form */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-8 border border-gray-700"
        >
          <h3 className="text-xl font-bold text-center mb-6 text-purple-300">
            {showTeamOptions ? "Event Registration" : "Individual Registration"}
          </h3>

          {/* Enhanced message display */}
          {message && (
            <div
              className={`mb-4 p-3 text-center rounded font-medium ${
                registrationSuccess
                  ? "bg-green-800 text-green-100"
                  : "bg-red-900 text-red-100"
              }`}
            >
              {message}
              {registrationSuccess && (
                <p className="text-sm mt-1">
                  This form will close automatically in a few seconds.
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Participant Information */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-purple-200">
                {showTeamOptions
                  ? "Team Lead Information"
                  : "Participant Information"}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    required
                    disabled={registrationSuccess}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    required
                    disabled={registrationSuccess}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    required
                    disabled={registrationSuccess}
                  />
                </div>
              </div>
            </div>

            {/* Team Event Toggle - Only show if teamSize > 0 */}
            {showTeamOptions && (
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isTeamEvent"
                    checked={isTeamEvent}
                    onChange={() => setIsTeamEvent(!isTeamEvent)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded bg-gray-700"
                    disabled={registrationSuccess}
                  />
                  <label
                    htmlFor="isTeamEvent"
                    className="ml-2 block text-sm font-medium text-gray-300"
                  >
                    This is a team registration
                  </label>
                </div>
              </div>
            )}

            {/* Team Details (conditional) - Only show if teamSize > 0 and isTeamEvent is true */}
            {showTeamOptions && isTeamEvent && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-purple-200">
                  Team Details
                </h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-300">
                    Team Name
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    required={isTeamEvent}
                    disabled={registrationSuccess}
                  />
                </div>

                <h5 className="text-md font-medium mb-2 text-purple-200">
                  Team Members
                </h5>
                <p className="text-sm text-gray-400 mb-3">
                  Please provide details for up to {teamSize} team members
                </p>

                {formData.members.map((member, index) => (
                  <div
                    key={index}
                    className="p-3 mb-3 bg-gray-700 rounded-md border border-gray-600"
                  >
                    <h6 className="text-sm font-medium mb-2 text-gray-300">
                      Member {index + 1}
                    </h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">
                          Name
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) =>
                            handleMemberChange(index, "name", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                          required={isTeamEvent && index === 0}
                          disabled={registrationSuccess}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-300">
                          Email
                        </label>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) =>
                            handleMemberChange(index, "email", e.target.value)
                          }
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                          required={isTeamEvent && index === 0}
                          disabled={registrationSuccess}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition duration-300"
                disabled={loading}
              >
                {registrationSuccess ? "Close" : "Cancel"}
              </button>
              {!registrationSuccess && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Registration"}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default RegisterEvent;
