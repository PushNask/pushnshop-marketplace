import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

interface AuthUIProps {
  view?: "sign_in" | "sign_up";
}

export function AuthUI({ view = "sign_in" }: AuthUIProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Set up auth state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      // Check user role and redirect accordingly
      if (session?.user) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (!error && profile) {
              const redirectPath = profile.role === 'admin' 
                ? '/admin/dashboard' 
                : '/seller/dashboard';
              navigate(redirectPath, { replace: true });
            } else {
              toast({
                title: "Error",
                description: "Could not fetch user profile",
                variant: "destructive",
              });
            }
          });
      }
    } else if (event === 'SIGNED_OUT') {
      navigate('/auth/login', { replace: true });
    }
  });

  return (
    <>
      {view === "sign_up" && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertDescription className="text-sm text-blue-700">
            You are creating a seller account. This will allow you to list products and manage your store.
          </AlertDescription>
        </Alert>
      )}
      <Auth
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#005BBB',
                brandAccent: '#004494',
              },
            },
          },
        }}
        theme="light"
        providers={[]}
        view={view}
        redirectTo={window.location.origin}
        localization={{
          variables: {
            sign_up: {
              email_label: "Email address",
              password_label: "Create password",
              button_label: "Create seller account",
            },
            sign_in: {
              email_label: "Email address",
              password_label: "Your password",
              button_label: "Sign in",
            },
          },
        }}
      />
    </>
  );
}