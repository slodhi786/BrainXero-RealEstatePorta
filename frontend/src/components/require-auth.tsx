/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "@/store/user/use-user-store";
import type { JSX } from "react";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const isAuth = useUserStore((s: { isAuthenticated: any; }) => s.isAuthenticated);
  const loc = useLocation();
  if (!isAuth) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectTo: loc.pathname + loc.search }}
      />
    );
  }
  return children;
}
