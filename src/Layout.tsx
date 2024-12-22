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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user && isAuthRoute) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/seller/dashboard'} replace />;
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
            <RequireAuth allowedRoles={['seller', 'admin']}>
              <Routes>
                <Route path="dashboard" element={<SellerDashboard />} />
                <Route path="products/new" element={<NewListing />} />
              </Routes>
            </RequireAuth>
          } />

          {/* Protected Admin Routes */}
          <Route path="/admin/*" element={
            <RequireAuth allowedRoles={['admin']}>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="links" element={<LinksManagement />} />
                <Route path="products" element={<ProductManagement />} />
              </Routes>
            </RequireAuth>
          } />

          {/* Unauthorized Route */}
          <Route path="/unauthorized" element={
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
              <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
              <p className="text-gray-600 mb-4 text-center">
                You don't have permission to access this page.
              </p>
              <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
                Return to Home
              </Link>
            </div>
          } />

          {/* Catch-all redirect */}
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'seller' && location.pathname.startsWith('/admin')) {
      return <Navigate to="/seller/dashboard" replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}