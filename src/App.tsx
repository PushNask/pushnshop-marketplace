import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import SellerDashboard from "./pages/seller/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import NewListing from "./pages/seller/NewListing";
import LinksManagement from "./pages/admin/LinksManagement";
import ProductManagement from "./pages/admin/ProductManagement";

const queryClient = new QueryClient();

function RequireAuth({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    // Redirect sellers trying to access admin routes to seller dashboard
    if (user.role === 'seller' && location.pathname.startsWith('/admin')) {
      return <Navigate to="/seller/dashboard" replace />;
    }
    // For any other unauthorized access, show unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/admin') || location.pathname.includes('/seller');
  const { user } = useAuth();

  // If user is authenticated and on auth pages, redirect to appropriate dashboard
  if (user && (location.pathname === '/auth/login' || location.pathname === '/auth/signup')) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/seller/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          
          {/* Seller Routes */}
          <Route
            path="/seller/*"
            element={
              <RequireAuth allowedRoles={['seller', 'admin']}>
                <SellerDashboard />
              </RequireAuth>
            }
          >
            <Route path="products/new" element={<NewListing />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <RequireAuth allowedRoles={['admin']}>
                <AdminDashboard />
              </RequireAuth>
            }
          >
            <Route path="links" element={<LinksManagement />} />
            <Route path="products" element={<ProductManagement />} />
          </Route>

          <Route path="/" element={<Index />} />
          
          {/* Unauthorized Route */}
          <Route 
            path="/unauthorized" 
            element={
              <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-2xl font-bold mb-4">Unauthorized Access</h1>
                <p className="text-gray-600 mb-4 text-center">
                  You don't have permission to access this page.
                </p>
                <Link 
                  to="/"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Return to Home
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;