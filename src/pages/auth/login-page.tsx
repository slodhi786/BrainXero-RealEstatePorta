import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "@/store/user/use-user-store";

export default function LoginPage() {
  const login = useUserStore((s) => s.login);
  const loading = useUserStore((s) => s.loading);
  const error = useUserStore((s) => s.error);
  const traceId = useUserStore((s) => s.traceId);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const { state } = useLocation() as { state?: { redirectTo?: string } };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login({ email, password });
    setTimeout(() => nav(state?.redirectTo || "/"), 0);
  }

  return (
    <div className="mx-auto max-w-md p-6 space-y-4">
      <h1 className="text-2xl font-bold">Sign in</h1>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
          {traceId && (
            <div className="mt-1 text-xs opacity-75">Trace ID: {traceId}</div>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full rounded border px-3 py-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            className="w-full rounded border px-3 py-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          className="w-full rounded bg-black text-white py-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="text-sm">
        New here?{" "}
        <Link to="/register" className="underline">
          Create an account
        </Link>
      </div>
    </div>
  );
}
