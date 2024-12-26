import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSuccess = () => {
    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
    // Navigate based on user role
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/seller/dashboard');
    }
  };

  const handleError = (error: Error) => {
    toast({
      variant: "destructive",
      title: "Error signing in",
      description: error.message,
    });
  };

  return (
    <AuthForm 
      defaultView="login"
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}