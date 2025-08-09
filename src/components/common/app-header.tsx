/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/user/use-user-store";

export default function AppHeader() {
  const user = useUserStore((s: { user: any; }) => s.user);
  const isAuth = useUserStore((s: { isAuthenticated: any; }) => s.isAuthenticated);
  const logout = useUserStore((s: { logout: any; }) => s.logout);
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b">
      <Link to="/" className="font-bold">
        RealEstate
      </Link>
      <nav className="flex items-center gap-3 text-sm">
        <Link to="/favorites">My Favorites</Link>
        {!isAuth ? (
          <>
            <Link to="/login" className="px-3 py-1 border rounded">
              Sign in
            </Link>
            <Link to="/register" className="px-3 py-1 border rounded">
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="opacity-75">
              Hi, {user?.userName || user?.email}
            </span>
            <button
              className="px-3 py-1 border rounded"
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
    </header>
  );
}
