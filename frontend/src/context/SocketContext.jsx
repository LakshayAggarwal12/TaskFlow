import { createContext, useContext, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import socket from "../lib/socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(socket);

// Owns the connect/disconnect lifecycle for the one shared socket instance,
// and handles the one event that's truly global (not tied to a specific
// board or task): live notification delivery. Board- and task-scoped
// events are handled by useBoardSocket / useCommentsSocket instead, closer
// to the components that actually own that cached data.
export function SocketProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) {
      socket.disconnect();
      return;
    }

    socket.connect();

    const handleNewNotification = (notification) => {
      queryClient.setQueriesData({ queryKey: ["notifications"] }, (old) => {
        if (!old) return old;
        // Same shape the REST list returns — prepend so it shows up
        // immediately without waiting for the 60s poll's next tick.
        return { ...old, notifications: [notification, ...(old.notifications || [])] };
      });
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [isAuthenticated, queryClient]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}