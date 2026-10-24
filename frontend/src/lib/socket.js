import { io } from "socket.io-client";

// One socket instance for the whole app. Created lazily (autoConnect:
// false) so SocketProvider fully controls when it connects/disconnects
// based on auth state, instead of it connecting the moment this module
// is imported.
const SOCKET_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  auth: (cb) => cb({ token: localStorage.getItem("taskflow_token") }),
});

export default socket;