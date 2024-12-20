import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, UserPlus } from "lucide-react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      const redirectPath = user.role === 'admin' 
        ? '/admin/dashboard' 
        : '/seller/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/placeholder.svg"
                alt="PushNshop"
                className="h-8 w-8"
              />
              <span className="font-semibold text-xl">PushNshop</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500">
        <div className="flex justify-center gap-4">
          <Link 
            to="/auth/login" 
            className="flex items-center gap-1 hover:text-gray-900"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
          <Link 
            to="/auth/signup" 
            className="flex items-center gap-1 hover:text-gray-900"
          >
            <UserPlus className="h-4 w-4" />
            Create Account
          </Link>
        </div>
      </footer>
    </div>
  );
}