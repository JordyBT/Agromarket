import type { AuthUser } from "@/services/authService";

const TOKEN_KEY = "agromarket_token";
const USER_KEY = "agromarket_user";

export type Session = {
  token: string;
  user: AuthUser;
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function saveSession(session: Session) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function getToken() {
  if (!isBrowser()) {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (!isBrowser()) {
    return null;
  }

  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function getSession(): Session | null {
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return null;
  }

  return {
    token,
    user,
  };
}

export function hasSession() {
  return getSession() !== null;
}

export function clearSession() {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
