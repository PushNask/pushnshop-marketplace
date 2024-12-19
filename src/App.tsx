import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
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

function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/admin') || location.pathname.includes('/seller');

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/seller/*" element={<SellerDashboard />}>
            <Route path="products/new" element={<NewListing />} />
          </Route>
          <Route path="/admin/*" element={<AdminDashboard />}>
            <Route path="links" element={<LinksManagement />} />
            <Route path="products" element={<ProductManagement />} />
          </Route>
          <Route path="/" element={<Index />} />
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