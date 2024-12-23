import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AuthFormAlertProps {
  view: 'login' | 'signup';
  error?: string | null;
}

export function AuthFormAlert({ view, error }: AuthFormAlertProps) {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (view === 'signup') {
    return (
      <Alert className="mb-4">
        <AlertDescription>
          Create a seller account to start listing your products.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}