import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

type User = { id: string; email: string; name?: string; role: string } | null;
const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null); // access token in memory

  const login = async (email: string, password: string) => {
    const res = await axios.post(
      `${API}/api/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    setToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const register = async (email: string, password: string, name?: string) => {
    const res = await axios.post(
      `${API}/api/auth/register`,
      { email, password, name },
      { withCredentials: true }
    );
    setToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const refresh = async () => {
    const res = await axios.post(`${API}/api/auth/refresh`, {}, { withCredentials: true });
    setToken(res.data.accessToken);
    return res.data.accessToken;
  };

  const apiRequest = async (input: RequestInfo, init?: RequestInit) => {
    let access = token;
    if (!access) access = await refresh();
    return fetch(input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${access}`
      },
      credentials: "include"
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, refresh, apiRequest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
