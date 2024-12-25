import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

// Lazy load the Layout component
const Layout = lazy(() => import("./Layout"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <LoadingSpinner size="lg" />
                </div>
              }>
                <Layout />
              </Suspense>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;