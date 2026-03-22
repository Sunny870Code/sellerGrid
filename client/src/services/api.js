import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

export const getReviews = (params) => api.get("/reviews", { params });
export const getStats = () => api.get("/reviews/stats");
export const createReview = (formData) =>
  api.post("/reviews", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const toggleResolved = (id) => api.patch(`/reviews/${id}/toggle`);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

export default api;
