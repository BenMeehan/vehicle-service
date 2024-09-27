import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Replace with your actual API endpoint

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/users/register/`, userData);
};

export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/users/login/`, userData);
};

export const newComponent = async (componentData) => {
  return await axios.post(`${API_URL}/vehicles/components/`, componentData);
};

export const getAllComponents = async () => {
  return await axios.get(`${API_URL}/vehicles/components/`);
};

export const addIssues = async (issueData) => {
  return await axios.post(`${API_URL}/vehicles/issues/`, issueData);
};

export const makePayment = async (paymentData) => {
  return await axios.post(`${API_URL}/payments/pay/`, paymentData);
};

export const getGraphData = async (startDate, endDate) => {
  return await axios.get(`${API_URL}/payments/list/`, {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });
};
