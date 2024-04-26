import type { AuthProvider } from "@refinedev/core";

export const TOKEN_KEY = import.meta.env.VITE_SESSION_TOKEN_KEY;

type Session = {
  exipresAt: string;
  fresh: boolean;
  id: string;
  userId: string;
};

async function apiFetch(endpoint: `/${string}`, init?: RequestInit) {
  // The env variable is injected by Vite is expected to not end with a slash,
  // so we remove it if it's there.
  let api = import.meta.env.VITE_API_HOST;
  api = api.endsWith("/") ? api.slice(0, -1) : api;

  // Set the Authorization header if a session token is present in local
  // storage
  const { headers: headersInit, ...rest } = init ?? {};
  const headers = new Headers(headersInit);
  const session = localStorage.getItem(TOKEN_KEY);
  if (session) {
    headers.set("Authorization", `Bearer ${session}`);
  }
  return await fetch(`${api}${endpoint}`, {
    headers,
    ...rest,
  });
}

export const authProvider: AuthProvider = {
  register: async ({ email, password, invitation }) => {
    const result = await apiFetch("/sign-up", {
      method: "POST",
      body: JSON.stringify({ email, password, invitation }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    type JSONResponse = {
      error?: string;
      session?: Session;
    };
    const { error, session }: JSONResponse = await result.json();
    if (error || !session) {
      return {
        success: false,
        error: new Error(error),
      };
    }
    localStorage.setItem(TOKEN_KEY, session.id);
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
    type JSONResponse = {
      session?: Session;
      error?: string;
    };
    const { session, error }: JSONResponse = await result.json();
    if (error || !session) {
      return {
        success: false,
        error: new Error(error),
      };
    }
    localStorage.setItem(TOKEN_KEY, session.id);
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

    type JSONResponse = {
      error?: string;
    };
    const { error }: JSONResponse = await result.json();
    if (error) {
      return {
        success: false,
        error: new Error(error),
      };
    }
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: "/login",
      successNotification: {
        message: "You have logged out!",
      },
    };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
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
    const token = localStorage.getItem(TOKEN_KEY);
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
    return {
      logout: true,
      redirectTo: "/login",
      error: new Error(error),
    };
  },
};
