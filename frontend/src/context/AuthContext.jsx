import { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const hasToken = !!localStorage.getItem("taskflow_token");

  // Session check — only runs if a token exists, so logged-out users never
  // fire a doomed /auth/me request on every page load.
  const {
    data: meData,
    isLoading: isSessionLoading,
    isError: isSessionError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getMe,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const user = meData?.user ?? null;
  // Loading is only "true" while we have a token and are still verifying it —
  // a user with no token at all should never see a loading state on first paint.
  const isLoading = hasToken && isSessionLoading;

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem("taskflow_token", data.token);
      queryClient.setQueryData(["auth", "me"], { user: data.user });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem("taskflow_token", data.token);
      queryClient.setQueryData(["auth", "me"], { user: data.user });
    },
  });

  const logout = () => {
    localStorage.removeItem("taskflow_token");
    queryClient.clear(); // wipe every cached query — nothing from the old session should leak
    authApi.logout().catch(() => {}); // best-effort; local state is already cleared either way
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isSessionError,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
