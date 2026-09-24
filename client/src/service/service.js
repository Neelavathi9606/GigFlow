import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const response = await apiClient.post("/auth/login", { email, password });
  if (response.data.data.accessToken) {
    localStorage.setItem("accessToken", response.data.data.accessToken);
    localStorage.setItem("userInfo", JSON.stringify(response.data.data.user));
  }
  return response.data;
};

export const register = async (name, email, username, contact_no, password) => {
  const response = await apiClient.post("/auth/register", {
    name,
    email,
    username,
    contact_no,
    password,
  });
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post("/auth/logout");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userInfo");
  return response.data;
};

export const getAllGigs = async (search = "", page = 1, limit = 10, includeAssigned = false) => {
  const response = await apiClient.get("/gigs", {
    params: { search, page, limit, includeAssigned: includeAssigned ? 'true' : undefined },
  });
  return response.data;
};

export const getGigById = async (gigId) => {
  const response = await apiClient.get(`/gigs/${gigId}`);
  return response.data;
};

export const createGig = async (title, description, budget, slug) => {
  const response = await apiClient.post("/gigs", {
    title,
    description,
    budget,
    slug,
  });
  return response.data;
};

export const updateGig = async (gigId, title, description, budget, slug) => {
  const response = await apiClient.put(`/gigs/${gigId}`, {
    title,
    description,
    budget,
    slug,
  });
  return response.data;
};

export const deleteGig = async (gigId) => {
  const response = await apiClient.delete( `/gigs/${gigId}`);
  return response.data;
};

export const hireFreelancer = async (gigId, bidId) => {
  const response = await apiClient.patch(`/gigs/${gigId}/hire`, { bidId });
  return response.data;
};

export const createBid = async (gigId, message, proposedPrice) => {
  const response = await apiClient.post("/bids", {
    gigId,
    message,
    proposedPrice,
  });
  return response.data;
};

export const updateBid = async (bidId, gigId, message, proposedPrice) => {
  const response = await apiClient.put(`/bids/${bidId}`, {
    gigId,
    message,
    proposedPrice,
  });
  return response.data;
};

export const deleteBid = async (bidId) => {
  const response = await apiClient.delete(`/bids/${bidId}`);
  return response.data;
};

export const getUserBids = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/bids/user/mybids", {
    params: { page, limit },
  });
  return response.data;
};

export const getGigBids = async (gigId, page = 1, limit = 10) => {
  const response = await apiClient.get(`/bids/${gigId}`, {
    params: { page, limit },
  });
  return response.data;
};