import { useCallback, useState } from "react";
import { verifyAdmin } from "../api/auth";
import { ApiError } from "../api/client";

interface UseAuthResult {
  authHeader: string | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export function useAuth(): UseAuthResult {
  const [authHeader, setAuthHeader] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const header = await verifyAdmin(username, password);
      setAuthHeader(header);
      return true;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Login failed";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setAuthHeader(null);
    setError(null);
  }, []);

  return { authHeader, isAdmin: authHeader !== null, loading, error, login, logout };
}
