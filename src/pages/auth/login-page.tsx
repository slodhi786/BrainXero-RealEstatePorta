import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/user/use-user-store";

export default function LoginPage() {
  const { login, loading, error, traceId } = useUserStore((u) => u);

  const { state } = useLocation() as {
    state?: { email?: string; redirectTo?: string };
  };
  const [email, setEmail] = useState(state?.email ?? "");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const ok = await login({ email: email.trim(), password });
      if (ok) {
        nav("/");
      }
    } catch {
      // error banner handled by store state
    }
  }

  const disabled = loading || !email.trim() || password.length < 6;

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] flex items-center">
      <div className="max-w-md mx-auto w-full px-4">
        <div className="bg-white rounded-2xl shadow border p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/images/logo-realestate.png"
              alt="RealEstate"
              className="h-8 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              Sign in
            </h1>
          </div>

          {error && (
            <div
              className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800 mb-4"
              role="alert"
              aria-live="polite"
            >
              {error}
              {traceId && (
                <div className="mt-1 text-xs opacity-75">
                  Trace ID: {traceId}
                </div>
              )}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                className="w-full rounded-lg border px-3 py-2 bg-white text-slate-900 placeholder-slate-400"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                className="w-full rounded-lg border px-3 py-2 bg-white text-slate-900 placeholder-slate-400"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Must be at least 6 characters.
              </p>
            </div>

            <button
              className="w-full rounded-lg bg-indigo-600 text-white py-2.5 font-medium hover:bg-indigo-700 disabled:opacity-50"
              disabled={disabled}
              type="submit"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="text-sm text-slate-600 mt-6 text-center">
            New here?{" "}
            <Link to="/register" className="text-indigo-700 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
