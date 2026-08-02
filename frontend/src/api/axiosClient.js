import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true, // allow the httpOnly cookie flow the backend also supports
});

// Attach the Bearer token (from localStorage) to every request, if present.
// The backend accepts EITHER the cookie or this header — we use the header
// explicitly so the app works the same whether cookies are blocked or not.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("taskflow_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A single place to react to auth failures — any 401 means the token is
// missing/expired/invalid, so we clear it and let the app redirect to login.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("taskflow_token");
      // Full reload (not client-side navigate) so every in-memory query
      // cache and context state resets cleanly on the next login.
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
