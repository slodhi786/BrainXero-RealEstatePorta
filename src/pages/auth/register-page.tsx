/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/user/use-user-store";
import {
  validatePassword,
  defaultIdentityPolicy,
} from "@/utils/passwordPolicy";

export default function RegisterPage() {
  const register = useUserStore((s: any) => s.register);
  const logout = useUserStore((s: any) => s.logout);
  const loading = useUserStore((s: any) => s.loading);
  const error = useUserStore((s: any) => s.error);
  const traceId = useUserStore((s: any) => s.traceId);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const nav = useNavigate();

  const pwCheck = useMemo(
    () => validatePassword(password, defaultIdentityPolicy),
    [password]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await register({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
    });
    if (ok) {
      logout();
      nav("/login", { replace: true, state: { email: email.trim() } });
    }
  }

  const disabled =
    loading ||
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !pwCheck.ok;

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
              Create an account
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  First name
                </label>
                <input
                  className="w-full rounded-lg border px-3 py-2 bg-white text-slate-900 placeholder-slate-400"
                  placeholder="Ayesha"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Last name
                </label>
                <input
                  className="w-full rounded-lg border px-3 py-2 bg-white text-slate-900 placeholder-slate-400"
                  placeholder="Khan"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                placeholder="Minimum 6 characters, upper, lower, digit, symbol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Live policy hints */}
              {!pwCheck.ok && password.length > 0 && (
                <ul className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 space-y-1">
                  {pwCheck.errors.map((msg: any, i: any) => (
                    <li key={i}>• {msg}</li>
                  ))}
                </ul>
              )}
            </div>

            <button
              className="w-full rounded-lg bg-indigo-600 text-white py-2.5 font-medium hover:bg-indigo-700 disabled:opacity-50"
              disabled={disabled}
              type="submit"
            >
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>

          <div className="text-sm text-slate-600 mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-700 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
