import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthUI } from "@/components/auth/AuthUI";
import { LogIn } from "lucide-react";

export default function Login() {
  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <LogIn className="h-8 w-8 text-[#005BBB]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-gray-500 mt-2">Sign in to your PushNshop account</p>
      </div>
      <AuthUI view="sign_in" />
    </AuthLayout>
  );
}