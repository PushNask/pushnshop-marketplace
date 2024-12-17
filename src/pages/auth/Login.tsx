import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthUI } from "@/components/auth/AuthUI";

export default function Login() {
  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to PushNshop</h1>
        <p className="text-gray-500">Sign in to your account to continue</p>
      </div>
      <AuthUI />
    </AuthLayout>
  );
}