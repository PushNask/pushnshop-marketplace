import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Card } from "@/components/ui/card";

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
        console.log('Starting login attempt for:', data.email);
        
        const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (signInError) throw signInError;

        if (!authData?.user) {
          throw new Error('Login failed. Please try again.');
        }

        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });

        onSuccess?.();
      } else {
        console.log('Attempting signup with:', { email: data.email });
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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

        if (signUpError) throw signUpError;

        if (!signUpData.user) {
          throw new Error('Signup failed. Please try again.');
        }

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
        
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = 'An error occurred during authentication';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email address before logging in.';
      }
      
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
    <Card className="w-full max-w-md mx-auto p-6">
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
    </Card>
  );
}