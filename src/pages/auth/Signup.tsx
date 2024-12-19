import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthUI } from "@/components/auth/AuthUI";
import { UserPlus, Store } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Signup() {
  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <Store className="h-8 w-8 text-[#005BBB]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create Seller Account</h1>
        <p className="text-gray-500 mt-2">Start selling on PushNshop today</p>
      </div>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <AlertDescription className="text-sm text-blue-700">
          You are creating a seller account. This will allow you to list products and manage your store.
        </AlertDescription>
      </Alert>

      <AuthUI view="sign_up" />
    </AuthLayout>
  );
}