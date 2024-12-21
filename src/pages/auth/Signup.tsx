import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";

export default function Signup() {
  return (
    <AuthLayout>
      <AuthForm defaultView="signup" />
    </AuthLayout>
  );
}