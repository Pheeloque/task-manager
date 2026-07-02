import { useState, type FormEvent } from "react";

interface AdminLoginProps {
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  onLogin: (username: string, password: string) => void;
  onLogout: () => void;
}

export function AdminLogin({ isAdmin, loading, error, onLogin, onLogout }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onLogin(username, password);
  }

  if (isAdmin) {
    return (
      <div className="admin-box">
        <span>Signed in as admin</span>
        <button type="button" onClick={onLogout}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <form className="admin-box" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        autoComplete="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Admin sign in"}
      </button>
      {error ? (
        <span className="form-error" role="alert">
          {error}
        </span>
      ) : null}
    </form>
  );
}
