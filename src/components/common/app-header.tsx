/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/user/use-user-store";

export default function AppHeader() {
  const user = useUserStore((s: { user: any }) => s.user);
  const isAuth = useUserStore((s: { isAuthenticated: boolean }) => s.isAuthenticated);
  const logout = useUserStore((s: { logout: () => void }) => s.logout);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="font-bold text-indigo-600">RealEstate</Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link to="/favorites" className="text-indigo-700 hover:underline">My Favorites</Link>

          {!isAuth ? (
            <>
              <Link to="/login" className="px-3 py-1 border rounded hover:bg-slate-50">Sign in</Link>
              <Link to="/register" className="px-3 py-1 border rounded bg-indigo-600 text-white hover:bg-indigo-700">Register</Link>
            </>
          ) : (
            <>
              <span className="hidden sm:inline text-slate-600">
                Hi, {user?.userName || user?.email}
              </span>
              <button
                className="px-3 py-1 border rounded hover:bg-slate-50"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Sign out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
