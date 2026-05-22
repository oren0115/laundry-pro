import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { Skeleton } from "@/components/ui/skeleton";

const LoginPage = lazy(() => import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() =>
  import("@/pages/RegisterPage").then((m) => ({ default: m.RegisterPage }))
);
const ForgotPasswordPage = lazy(() =>
  import("@/pages/ForgotPasswordPage").then((m) => ({ default: m.ForgotPasswordPage }))
);
const DashboardPage = lazy(() =>
  import("@/pages/DashboardPage").then((m) => ({ default: m.DashboardPage }))
);
const OrdersPage = lazy(() => import("@/pages/OrdersPage").then((m) => ({ default: m.OrdersPage })));
const OrderDetailPage = lazy(() =>
  import("@/pages/OrderDetailPage").then((m) => ({ default: m.OrderDetailPage }))
);
const CustomersPage = lazy(() =>
  import("@/pages/CustomersPage").then((m) => ({ default: m.CustomersPage }))
);
const TrackingPage = lazy(() =>
  import("@/pages/TrackingPage").then((m) => ({ default: m.TrackingPage }))
);
const ScanPage = lazy(() => import("@/pages/ScanPage").then((m) => ({ default: m.ScanPage })));
const InventoryPage = lazy(() =>
  import("@/pages/InventoryPage").then((m) => ({ default: m.InventoryPage }))
);
const EmployeesPage = lazy(() =>
  import("@/pages/EmployeesPage").then((m) => ({ default: m.EmployeesPage }))
);
const BranchesPage = lazy(() =>
  import("@/pages/BranchesPage").then((m) => ({ default: m.BranchesPage }))
);
const PickupsPage = lazy(() =>
  import("@/pages/PickupsPage").then((m) => ({ default: m.PickupsPage }))
);
const ReportsPage = lazy(() =>
  import("@/pages/ReportsPage").then((m) => ({ default: m.ReportsPage }))
);
const HomePage = lazy(() => import("@/pages/public/HomePage").then((m) => ({ default: m.HomePage })));
const ServicesPage = lazy(() =>
  import("@/pages/public/ServicesPage").then((m) => ({ default: m.ServicesPage }))
);
const PublicTrackingPage = lazy(() =>
  import("@/pages/public/PublicTrackingPage").then((m) => ({ default: m.PublicTrackingPage }))
);
const PricingPage = lazy(() =>
  import("@/pages/public/PricingPage").then((m) => ({ default: m.PricingPage }))
);
const AboutPage = lazy(() =>
  import("@/pages/public/AboutPage").then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import("@/pages/public/ContactPage").then((m) => ({ default: m.ContactPage }))
);
const WebsiteContentPage = lazy(() =>
  import("@/pages/WebsiteContentPage").then((m) => ({ default: m.WebsiteContentPage }))
);

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 p-8">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-32 w-full max-w-md" />
    </div>
  );
}

function StaffDashboardHome() {
  return (
    <ProtectedRoute staffOnly>
      <DashboardPage />
    </ProtectedRoute>
  );
}

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  // Require both token and user — token-only state (e.g. stale persist) caused /login ↔ /dashboard loops
  if (!accessToken || !user) return <>{children}</>;

  return (
    <Navigate to={user.role === "CUSTOMER" ? "/tracking" : "/dashboard"} replace />
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="layanan" element={<ServicesPage />} />
          <Route path="harga" element={<PricingPage />} />
          <Route path="cek-status" element={<PublicTrackingPage />} />
          <Route path="tentang" element={<AboutPage />} />
          <Route path="kontak" element={<ContactPage />} />
        </Route>

        <Route
          path="login"
          element={
            <AuthRedirect>
              <LoginPage />
            </AuthRedirect>
          }
        />
        <Route
          path="register"
          element={
            <AuthRedirect>
              <RegisterPage />
            </AuthRedirect>
          }
        />
        <Route path="lupa-password" element={<ForgotPasswordPage />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StaffDashboardHome />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route
            path="customers"
            element={
              <ProtectedRoute roles={["OWNER", "ADMIN", "KASIR"]}>
                <CustomersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="scan"
            element={
              <ProtectedRoute roles={["OWNER", "ADMIN", "KASIR", "OPERATOR"]}>
                <ScanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="inventory"
            element={
              <ProtectedRoute roles={["OWNER", "ADMIN", "OPERATOR"]}>
                <InventoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="pickups"
            element={
              <ProtectedRoute roles={["OWNER", "ADMIN", "KASIR", "KURIR"]}>
                <PickupsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="employees"
            element={
              <ProtectedRoute roles={["OWNER", "ADMIN"]}>
                <EmployeesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="branches"
            element={
              <ProtectedRoute roles={["OWNER"]}>
                <BranchesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="website"
            element={
              <ProtectedRoute roles={["OWNER"]}>
                <WebsiteContentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute roles={["OWNER", "ADMIN"]}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
