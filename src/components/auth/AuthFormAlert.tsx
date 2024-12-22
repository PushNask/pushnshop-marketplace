import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthFormAlertProps {
  view: 'login' | 'signup';
}

export function AuthFormAlert({ view }: AuthFormAlertProps) {
  if (view !== 'signup') return null;
  
  return (
    <Alert className="mb-6 bg-blue-50 border-blue-200">
      <AlertDescription className="text-sm text-blue-700">
        You are creating a seller account. This will allow you to list products and manage your store.
      </AlertDescription>
    </Alert>
  );
}