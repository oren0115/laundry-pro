import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { Role } from "@/types";

export function ProtectedRoute({
  children,
  roles,
  staffOnly,
}: {
  children: React.ReactNode;
  roles?: Role[];
  staffOnly?: boolean;
}) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (accessToken && !user) logout();
  }, [accessToken, user, logout]);

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  if (staffOnly && user.role === "CUSTOMER") {
    return <Navigate to="/tracking" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === "CUSTOMER" ? "/tracking" : "/dashboard"} replace />;
  }

  return <>{children}</>;
}
