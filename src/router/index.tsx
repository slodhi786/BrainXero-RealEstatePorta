import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import HomePage from "@/pages/home-page";
import PropertyDetailPage from "@/pages/property-detail-page";
import NotFoundPage from "@/pages/not-found-page";
import RequireAuth from "@/components/require-auth";
import LoginPage from "@/pages/auth/login-page";
import RegisterPage from "@/pages/auth/register-page";
import MyFavoritesPage from "@/pages/my-favorites-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "property/:id", element: <PropertyDetailPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        path: "/favorites",
        element: (
          <RequireAuth>
            <MyFavoritesPage />
          </RequireAuth>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
