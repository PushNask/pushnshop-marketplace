import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type UserRole = "seller" | "admin";

interface User {
  id: string;
  email: string;
  role: UserRole;
  businessName?: string;
  whatsappNumber?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (profile) {
            // Ensure role is of type UserRole
            const role = profile.role as UserRole;
            if (role !== 'admin' && role !== 'seller') {
              throw new Error('Invalid user role');
            }

            setUser({
              id: session.user.id,
              email: session.user.email!,
              role: role,
              businessName: profile.name,
              whatsappNumber: profile.whatsapp_number
            });
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (profile) {
            // Ensure role is of type UserRole
            const role = profile.role as UserRole;
            if (role !== 'admin' && role !== 'seller') {
              throw new Error('Invalid user role');
            }

            setUser({
              id: session.user.id,
              email: session.user.email!,
              role: role,
              businessName: profile.name,
              whatsappNumber: profile.whatsapp_number
            });
          }
          
          navigate('/');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          navigate('/auth/login');
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem with your authentication. Please try logging in again."
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/auth/login');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing you out."
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}