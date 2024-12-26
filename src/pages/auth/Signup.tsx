import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSuccess = () => {
    toast({
      title: "Account created!",
      description: "Please check your email to verify your account.",
    });
    // Navigate to login page after successful signup
    navigate('/auth/login');
  };

  const handleError = (error: Error) => {
    toast({
      variant: "destructive",
      title: "Error creating account",
      description: error.message,
    });
  };

  return (
    <AuthForm 
      defaultView="signup"
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}