import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSuccess = () => {
    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
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