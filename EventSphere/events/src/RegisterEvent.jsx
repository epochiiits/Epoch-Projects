import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Base_Url } from "./apiserveices/api";
import {
  User,
  Users,
  Mail,
  Phone,
  X,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

const RegisterEvent = ({ event, userId }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const teamSize = event?.isTeamEvent ? event?.teamSize : 0;
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
      if (!userId || !event?._id) return;

      try {
        const response = await axios.get(
          `${Base_Url}/check-registration-status`,
          {
            params: {
              userid: userId,
              eventId: event._id,
            },
          }
        );

        setIsRegistered(response.data.isRegistered);
      } catch (error) {
        console.error("Error checking registration status:", error);
      }
    };

    checkRegistrationStatus();
  }, [userId, event?._id]);

  // Effect to handle delayed form close on success
  useEffect(() => {
    let timer;
    if (registrationSuccess) {
      timer = setTimeout(() => {
        setShowForm(false);
        setRegistrationSuccess(false);
      }, 3000);
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
          eventId: event._id,
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

      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setRegistrationSuccess(false);

    try {
      const submissionData = {
        eventId: event._id,
        userid: userId,
        leadInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      };

      if (isTeamEvent && showTeamOptions) {
        submissionData.isTeam = true;
        submissionData.teamName = formData.teamName;
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
        setRegistrationSuccess(true);
        setIsRegistered(true);

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-center mt-8"
        >
          {isRegistered ? (
            <button
              onClick={handleUnregister}
              className="px-8 py-3 bg-red-900 text-white rounded-lg hover:bg-red-800 transition duration-300 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <X className="h-5 w-5" />
              )}
              Unregister
            </button>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-3 bg-purple-900 text-white rounded-lg hover:bg-purple-800 transition duration-300 flex items-center gap-2"
            >
              <User className="h-5 w-5" />
              Register Now
            </button>
          )}

          {message && !showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
                isRegistered
                  ? "bg-red-900 border border-red-800"
                  : "bg-green-900 border border-green-800"
              } flex items-center gap-2`}
            >
              {isRegistered ? (
                <X className="h-5 w-5" />
              ) : (
                <Check className="h-5 w-5" />
              )}
              <span>{message}</span>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-8 border border-gray-900"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-purple-400">
              {showTeamOptions ? "Team Registration" : "Individual Registration"}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                registrationSuccess
                  ? "bg-green-900 text-green-100 border border-green-800"
                  : "bg-red-900 text-red-100 border border-red-800"
              }`}
            >
              {registrationSuccess ? (
                <Check className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <div>
                <p>{message}</p>
                {registrationSuccess && (
                  <p className="text-xs mt-1 opacity-80">
                    Form will close automatically...
                  </p>
                )}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-purple-300 flex items-center gap-2">
                {showTeamOptions ? (
                  <>
                    <Users className="h-5 w-5" />
                    Team Lead Information
                  </>
                ) : (
                  <>
                    <User className="h-5 w-5" />
                    Participant Information
                  </>
                )}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-900 text-white"
                    required
                    disabled={registrationSuccess}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-900 text-white"
                    required
                    disabled={registrationSuccess}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-900 text-white"
                    required
                    disabled={registrationSuccess}
                  />
                </div>
              </div>
            </div>

            {showTeamOptions && (
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isTeamEvent"
                    checked={isTeamEvent}
                    onChange={() => setIsTeamEvent(!isTeamEvent)}
                    className="h-4 w-4 text-purple-900 focus:ring-purple-800 border-gray-700 rounded bg-gray-900"
                    disabled={registrationSuccess}
                  />
                  <label
                    htmlFor="isTeamEvent"
                    className="ml-2 block text-sm font-medium text-gray-400"
                  >
                    Register as a team
                  </label>
                </div>
              </div>
            )}

            {showTeamOptions && isTeamEvent && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 text-purple-300 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Details
                </h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-gray-400">
                    Team Name
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-900 text-white"
                    required={isTeamEvent}
                    disabled={registrationSuccess}
                  />
                </div>

                <div className="space-y-3">
                  <h5 className="text-md font-medium text-purple-300">
                    Team Members (Max: {teamSize})
                  </h5>
                  <p className="text-sm text-gray-500">
                    Fill details for your team members
                  </p>

                  {formData.members.map((member, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-900 rounded-md border border-gray-800"
                    >
                      <h6 className="text-sm font-medium mb-2 text-gray-300">
                        Member {index + 1}
                      </h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-400">
                            Name
                          </label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) =>
                              handleMemberChange(index, "name", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-900 text-white"
                            required={isTeamEvent && index === 0}
                            disabled={registrationSuccess}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1 text-gray-400">
                            Email
                          </label>
                          <input
                            type="email"
                            value={member.email}
                            onChange={(e) =>
                              handleMemberChange(index, "email", e.target.value)
                            }
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-900 text-white"
                            required={isTeamEvent && index === 0}
                            disabled={registrationSuccess}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-900">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-800 text-gray-300 rounded-md hover:bg-gray-900 transition duration-300 flex items-center gap-2"
                disabled={loading}
              >
                <X className="h-4 w-4" />
                {registrationSuccess ? "Close" : "Cancel"}
              </button>
              {!registrationSuccess && (
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-900 text-white rounded-md hover:bg-purple-800 transition duration-300 flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Submit Registration
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