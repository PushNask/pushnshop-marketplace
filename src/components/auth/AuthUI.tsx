import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

interface AuthUIProps {
  view?: "sign_in" | "sign_up";
}

export function AuthUI({ view = "sign_in" }: AuthUIProps) {
  return (
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
  );
}