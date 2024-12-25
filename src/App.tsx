import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

const Layout = lazy(() => import("./Layout"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <LoadingProvider>
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
          </LoadingProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;