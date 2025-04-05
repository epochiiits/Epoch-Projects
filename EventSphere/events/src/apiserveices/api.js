const API_BASE_URL = "http://localhost:5000";
import axios from "axios";

export const Base_Url = API_BASE_URL;

export const Apis = {
  createClub(formData) {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("banner", formData.banner);
    data.append("logo", formData.logo);

    return axios
      .post(`${API_BASE_URL}/clubs`, data, {
        headers: {
          // 'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => response.data);
  },

  async adminlogin(credentials) {
    try {
      // Making an API call using Axios
      const response = await axios.post(
        `${API_BASE_URL}/admin/login`,
        credentials
      );

      if (response.status !== 200) {
        throw new Error("Login failed");
      }

      const data = response.data;
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async fetchEvents() {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      console.log(response);
      // Convert to array
      const eventsData = response.data;
      return eventsData;
    } catch (error) {
      console.error("Error fetching events:", error);
      return []; // Return an empty array in case of error
    }
  },
  
  async acceptEvent(eventId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/events/${eventId}/accept`)
      return response.data
    } catch (error) {
      console.error('Error accepting event:', error)
      throw error
    }
  }
};
