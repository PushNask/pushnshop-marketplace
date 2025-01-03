import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { AuthLayout } from "@/components/auth/AuthLayout";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import SellerDashboard from "./pages/seller/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import NewListing from "./pages/seller/NewListing";
import LinksManagement from "./pages/admin/LinksManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function Layout() {
  const location = useLocation();
  const { user, loading } = useAuth();
  
  const isAuthRoute = location.pathname.startsWith('/auth');
  const isDashboard = location.pathname.includes('/admin') || location.pathname.includes('/seller');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Only redirect authenticated users away from auth routes
  if (user && isAuthRoute) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  // Only redirect root to dashboard if user is logged in
  if (user && location.pathname === '/') {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && !isAuthRoute && <Header />}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          
          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
          
          {/* Protected Seller Routes */}
          <Route path="/seller/*" element={
            <RequireAuth allowedRoles={['seller']}>
              <Routes>
                <Route path="/" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<SellerDashboard />} />
                <Route path="products/new" element={<NewListing />} />
              </Routes>
            </RequireAuth>
          } />

          {/* Protected Admin Routes */}
          <Route path="/admin/*" element={
            <RequireAuth allowedRoles={['admin']}>
              <Routes>
                <Route path="/" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="links" element={<LinksManagement />} />
                <Route path="products" element={<ProductManagement />} />
              </Routes>
            </RequireAuth>
          } />

          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboard && !isAuthRoute && <Footer />}
    </div>
  );
}

function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

function getDashboardPath(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'seller':
      return '/seller/dashboard';
    default:
      return '/';
  }
}