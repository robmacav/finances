import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: Location } };
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState<string>("dev@example.com");
  const [password, setPassword] = useState<string>("secret123");
  const [error, setError] = useState<string>("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Falha ao autenticar";
      setError(msg);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "72px auto" }}>
      <h1 style={{ marginBottom: 16 }}>Login</h1>
      <form onSubmit={onSubmit}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
            required
          />
        </label>
        <label style={{ display: "block", marginBottom: 8 }}>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
            required
          />
        </label>
        <button type="submit" style={{ padding: "8px 12px", marginTop: 12 }}>
          Entrar
        </button>
        {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
