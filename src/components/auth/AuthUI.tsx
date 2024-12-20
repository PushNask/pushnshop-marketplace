import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface AuthUIProps {
  view?: "sign_in" | "sign_up";
}

export function AuthUI({ view = "sign_in" }: AuthUIProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Set up auth state change listener
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN') {
      setIsLoading(true);
      try {
        // Check user role and redirect accordingly
        if (session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (error) {
            throw error;
          }

          if (profile) {
            const redirectPath = profile.role === 'admin' 
              ? '/admin/dashboard' 
              : '/seller/dashboard';
            navigate(redirectPath, { replace: true });
          }
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Could not fetch user profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else if (event === 'SIGNED_OUT') {
      navigate('/auth/login', { replace: true });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Authenticating...</span>
      </div>
    );
  }

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
          className: {
            button: 'bg-primary hover:bg-primary/90',
            input: 'rounded-md border border-input',
            label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          },
        }}
        theme="light"
        providers={[]}
        view={view}
        redirectTo={window.location.origin}
        onError={(error) => {
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
        }}
        localization={{
          variables: {
            sign_up: {
              email_label: "Email address",
              password_label: "Create password",
              button_label: "Create seller account",
              loading_button_label: "Creating account...",
              social_provider_text: "Sign up with {{provider}}",
              link_text: "Don't have an account? Sign up",
            },
            sign_in: {
              email_label: "Email address",
              password_label: "Your password",
              button_label: "Sign in",
              loading_button_label: "Signing in...",
              social_provider_text: "Sign in with {{provider}}",
              link_text: "Already have an account? Sign in",
            },
          },
        }}
      />
    </>
  );
}