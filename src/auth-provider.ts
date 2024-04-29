import type { AuthProvider } from "@refinedev/core";
import {
  NetworkError,
  apiFetch,
  clearSessionFromLocalStorage,
  getSessionFromLocalStorage,
  setSessionInLocalStorage,
} from "./lib/utils";

type Session = {
  exipresAt: string;
  fresh: boolean;
  id: string;
  userId: string;
};

export const authProvider: AuthProvider = {
  register: async ({ email, password, invitation }) => {
    const result = await apiFetch("/sign-up", {
      method: "POST",
      body: JSON.stringify({ email, password, invitation }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!result.ok) {
      const { error }: { error: string } = await result.json();
      return {
        success: false,
        error: new NetworkError({
          statusCode: result.status,
          message: error,
        }),
      };
    }
    const { session }: { session: Session } = await result.json();
    setSessionInLocalStorage(session.id);
    return {
      success: true,
      redirectTo: "/",
      successNotification: {
        message: "You have successfully registered!",
      },
    };
  },
  login: async ({ email, password }) => {
    const result = await apiFetch("/sign-in", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!result.ok) {
      const { error }: { error: string } = await result.json();
      return {
        success: false,
        error: new NetworkError({
          statusCode: result.status,
          message: error,
        }),
      };
    }
    const { session }: { session: Session } = await result.json();
    setSessionInLocalStorage(session.id);
    return {
      success: true,
      redirectTo: "/",
      successNotification: {
        message: "You have logged in!",
      },
    };
  },
  logout: async () => {
    const result = await apiFetch("/logout", {
      method: "POST",
    });
    if (!result.ok) {
      const { error }: { error: string } = await result.json();
      return {
        success: false,
        error: new NetworkError({
          statusCode: result.status,
          message: error,
        }),
      };
    }
    clearSessionFromLocalStorage();
    return {
      success: true,
      redirectTo: "/login",
      successNotification: {
        message: "You have logged out!",
      },
    };
  },
  check: async () => {
    const token = getSessionFromLocalStorage();
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = getSessionFromLocalStorage();
    if (token) {
      return {
        id: 1,
        name: "John Doe",
        avatar: "https://i.pravatar.cc/300",
      };
    }
    return null;
  },
  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }
    return {};
  },
};
