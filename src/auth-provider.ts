import type { AuthProvider } from "@refinedev/core";
import {
  clearSessionFromLocalStorage,
  fetchApi,
  getSessionFromLocalStorage,
  setSessionInLocalStorage,
} from "./lib/utils";

type Session = {
  exipresAt: string;
  fresh: boolean;
  id: string;
  userId: string;
};

export const authProvider = (apiUrl: string): AuthProvider => ({
  register: async ({ email, password, invitation }) => {
    const { session } = await fetchApi<{ session: Session }>(
      `${apiUrl}/sign-up`,
      {
        method: "POST",
        body: JSON.stringify({ email, password, invitation }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
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
    const { session } = await fetchApi<{ session: Session }>(
      `${apiUrl}/sign-in`,
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
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
    await fetchApi(`${apiUrl}/logout`, {
      method: "POST",
    });
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
});
