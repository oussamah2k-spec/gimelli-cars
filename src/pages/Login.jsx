import React, { useState } from "react";
import { useAuth, checkIsAdmin } from "../contexts/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import AppScreenLoader from "../components/AppScreenLoader";

const Login = () => {
  const { currentUser, isAdmin, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const adminStatus = await checkIsAdmin(credential.user.uid, credential.user.email);
      navigate(adminStatus ? '/admin' : '/');
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <AppScreenLoader />;
  }

  if (currentUser) {
    return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
  }

  return (
    <section className="login-container relative isolate mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <div className="absolute inset-0 pointer-events-none rounded-[24px] bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.1),transparent_65%)]" aria-hidden="true" />

      <div className="relative z-50 pointer-events-auto rounded-2xl border border-white/10 bg-[#111111]/85 p-6 shadow-[0_20px_54px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-8">
        <h2 className="mb-6 text-3xl font-bold tracking-tight text-white">Login</h2>

        {error && (
          <p className="mb-4 rounded-lg border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <form className="relative z-50 grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium text-white/85">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-lg border border-white/10 bg-gray-800 p-3 text-white outline-none transition focus:ring-2 focus:ring-yellow-500"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-white/85">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-lg border border-white/10 bg-gray-800 p-3 text-white outline-none transition focus:ring-2 focus:ring-yellow-500"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[linear-gradient(135deg,#d4af37,#f5d97a)] px-4 text-sm font-semibold text-[#0b0b0b] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-65"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;