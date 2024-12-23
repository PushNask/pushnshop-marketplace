import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthFormProps } from "./types";
import { AuthFormFields } from "./AuthFormFields";
import { AuthFormActions } from "./AuthFormActions";
import { AuthFormHeader } from "./AuthFormHeader";
import { AuthFormAlert } from "./AuthFormAlert";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase and numbers"
    ),
  businessName: z.string().optional(),
  whatsappNumber: z.string().optional(),
});

type AuthFormValues = z.infer<typeof authSchema>;

export function AuthForm({ defaultView = 'login', onSuccess, onError }: AuthFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState(defaultView);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      businessName: "",
      whatsappNumber: "",
    },
  });

  async function onSubmit(data: AuthFormValues) {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      if (view === 'login') {
        console.log('Attempting login with:', { email: data.email });
        
        // First, attempt to sign in
        const { error: signInError, data: authData } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (signInError) {
          console.error('Sign in error:', signInError);
          
          // Check for specific error cases
          if (signInError.message.includes('Email not confirmed')) {
            throw new Error('Please verify your email address before logging in. Check your inbox for the verification email.');
          }
          if (signInError.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please check your credentials and try again.');
          }
          throw signInError;
        }

        if (!authData?.user) {
          console.error('No user data returned after login');
          throw new Error('Login failed. Please try again.');
        }

        // Get user profile to determine role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw new Error('Could not fetch user profile. Please try again.');
        }

        if (!profile) {
          console.error('No profile found for user');
          throw new Error('User profile not found. Please contact support.');
        }

        console.log('Login successful:', { role: profile.role });

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });

        // Redirect based on role
        const redirectPath = profile.role === 'admin' ? '/admin/dashboard' : '/seller/dashboard';
        navigate(redirectPath, { replace: true });
        
        onSuccess?.();
      } else {
        // Handle signup
        console.log('Attempting signup with:', { email: data.email });
        
        const { error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              role: "seller",
              businessName: data.businessName,
              whatsappNumber: data.whatsappNumber,
            },
          },
        });

        if (signUpError) {
          console.error('Sign up error:', signUpError);
          throw signUpError;
        }

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
        
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      const errorMessage = error.message || 'An error occurred during authentication';
      setAuthError(errorMessage);
      
      toast({
        variant: "destructive",
        title: view === 'login' ? "Error signing in" : "Error creating account",
        description: errorMessage,
      });
      
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <AuthFormHeader view={view} />
      <AuthFormAlert view={view} error={authError} />
      <AuthFormFields 
        form={form} 
        view={view} 
        isLoading={isLoading} 
        onSubmit={onSubmit} 
      />
      <AuthFormActions 
        view={view} 
        setView={setView} 
      />
    </div>
  );
}