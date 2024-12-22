import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface AuthFormHeaderProps {
  view: 'login' | 'signup';
}

export function AuthFormHeader({ view }: AuthFormHeaderProps) {
  return (
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl text-center">
        {view === 'login' ? 'Welcome back' : 'Create seller account'}
      </CardTitle>
      <CardDescription className="text-center">
        {view === 'login' 
          ? 'Sign in to your PushNshop account'
          : 'Start selling on PushNshop today'}
      </CardDescription>
    </CardHeader>
  );
}