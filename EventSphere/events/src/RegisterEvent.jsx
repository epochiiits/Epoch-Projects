import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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
  CreditCard,
  DollarSign,
  Shield,
} from "lucide-react";
const RegisterEvent = ({ event, userId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState("register");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const teamSize = event?.isTeamEvent ? event?.teamSize : 0;
  const showTeamOptions = teamSize > 0;
  const isPaidEvent = event?.isPaid;

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

  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  });
  // Check registration status
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData({ ...formData, members: updatedMembers });
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleUnregister = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${Base_Url}/unregister-event`,
        { userid: userId, eventId: event._id },
        { headers: { "Content-Type": "application/json" } }
      );
      setMessage("Unregistered successfully!");
      setIsRegistered(false);
    } catch (error) {
      setMessage("Failed to unregister. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const processPayment = async () => {
    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 2000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isPaidEvent && activeTab === "payment") {
        const paymentResult = await processPayment();
        if (!paymentResult.success) throw new Error("Payment failed");
      }

      const submissionData = {
        eventId: event._id,
        userid: userId,
        leadInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        isPaid: isPaidEvent,
        amount: event.amount,
      };

      if (showTeamOptions && formData.isTeamEvent) {
        submissionData.isTeam = true;
        submissionData.teamName = formData.teamName;
        submissionData.members = formData.members.filter(
          (m) => m.name && m.email
        );
      }

      const response = await axios.post(
        `${Base_Url}/register-event`,
        submissionData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setMessage("Registration successful!");
        setRegistrationSuccess(true);
        setIsRegistered(true);
        setTimeout(() => onClose(), 2000);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.error ||
          "Failed to complete registration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-black w-full max-w-md rounded-xl border border-gray-800 shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
              {isPaidEvent && <DollarSign className="h-5 w-5" />}
              {event.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          {isPaidEvent && !registrationSuccess && (
            <div className="flex border-b border-gray-800">
              <button
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === "register"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("register")}
              >
                Registration
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === "payment"
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("payment")}
              >
                Payment
              </button>
            </div>
          )}

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                  registrationSuccess
                    ? "bg-green-900/50 text-green-100 border border-green-800"
                    : "bg-red-900/50 text-red-100 border border-red-800"
                }`}
              >
                {registrationSuccess ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span>{message}</span>
              </motion.div>
            )}

            {isRegistered ? (
              <div className="text-center py-8">
                <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Already Registered
                </h3>
                <p className="text-gray-400 mb-6">
                  You're all set for this event!
                </p>
                <button
                  onClick={handleUnregister}
                  className="px-6 py-2 bg-red-900/80 text-white rounded-lg hover:bg-red-800/80 transition flex items-center gap-2 mx-auto"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  Unregister
                </button>
              </div>
            ) : activeTab === "register" ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                      {showTeamOptions ? (
                        <>
                          <Users className="h-5 w-5" />
                          Team Lead
                        </>
                      ) : (
                        <>
                          <User className="h-5 w-5" />
                          Participant
                        </>
                      )}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md focus:ring-2 focus:ring-purple-900 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md focus:ring-2 focus:ring-purple-900 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md focus:ring-2 focus:ring-purple-900 text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {showTeamOptions && (
                    <div>
                      <div className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          id="teamRegistration"
                          checked={formData.isTeamEvent}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              isTeamEvent: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-purple-900 focus:ring-purple-800 border-gray-700 rounded bg-gray-900"
                        />
                        <label
                          htmlFor="teamRegistration"
                          className="ml-2 text-sm text-gray-300"
                        >
                          Register as team
                        </label>
                      </div>

                      {formData.isTeamEvent && (
                        <div className="space-y-4 pl-2 border-l-2 border-purple-900/30">
                          <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">
                              Team Name
                            </label>
                            <input
                              type="text"
                              name="teamName"
                              value={formData.teamName}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md focus:ring-2 focus:ring-purple-900 text-white"
                              required
                            />
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-2">
                              Team Members (Max: {teamSize})
                            </h4>
                            <div className="space-y-3">
                              {formData.members.map((member, index) => (
                                <div
                                  key={index}
                                  className="p-3 bg-gray-900/50 rounded border border-gray-800"
                                >
                                  <h5 className="text-xs text-gray-400 mb-2">
                                    Member {index + 1}
                                  </h5>
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      placeholder="Name"
                                      value={member.name}
                                      onChange={(e) =>
                                        handleMemberChange(
                                          index,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                                      required={index === 0}
                                    />
                                    <input
                                      type="email"
                                      placeholder="Email"
                                      value={member.email}
                                      onChange={(e) =>
                                        handleMemberChange(
                                          index,
                                          "email",
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm"
                                      required={index === 0}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {isPaidEvent && (
                    <div className="p-3 bg-gray-900/30 rounded border border-gray-800">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Total</span>
                        <span className="font-medium text-purple-400">
                          ${event.amount}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-gray-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-900 text-white rounded-md hover:bg-purple-800 transition flex items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    {isPaidEvent ? "Proceed to Payment" : "Complete Registration"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="number"
                          value={cardDetails.number}
                          onChange={handleCardChange}
                          placeholder="4242 4242 4242 4242"
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md focus:ring-2 focus:ring-purple-900 text-white"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiry"
                            value={cardDetails.expiry}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md focus:ring-2 focus:ring-purple-900 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            name="cvc"
                            value={cardDetails.cvc}
                            onChange={handleCardChange}
                            placeholder="123"
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md focus:ring-2 focus:ring-purple-900 text-white"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={cardDetails.name}
                          onChange={handleCardChange}
                          className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-md focus:ring-2 focus:ring-purple-900 text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-900/30 rounded border border-gray-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300">Event Fee</span>
                      <span className="text-purple-400">${event.amount}</span>
                    </div>
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-sm text-gray-300">Total</span>
                      <span className="text-lg text-purple-400">
                        ${event.amount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Shield className="h-4 w-4" />
                    <span>Your payment is secured with encryption</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className="px-4 py-2 text-sm text-gray-300 hover:text-white"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-900 text-white rounded-md hover:bg-purple-800 transition flex items-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <DollarSign className="h-4 w-4" />
                    )}
                    Pay ${event.amount}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RegisterEvent;