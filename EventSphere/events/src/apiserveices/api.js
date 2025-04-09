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
      const response = await axios.post(
        `${API_BASE_URL}/admin/login`,
        credentials
      );

      if (response.status !== 200) {
        throw new Error("Login failed");
      }

      // Store the token in localStorage
      localStorage.setItem('adminToken', response.data.token);
      
      // Set the default Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async fetchEvents() {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      console.log(response);
      const eventsData = response.data;
      return eventsData;
    } catch (error) {
      console.error("Error fetching events:", error);
      return []; 
    }
  },
  
  async fetchEventDetails(eventId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event details:', error);
      throw error;
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
  },

  // Setup axios interceptor for adding token to requests
  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
};

// Set up interceptors when the file is imported
Apis.setupAxiosInterceptors();