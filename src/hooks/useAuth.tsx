import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@/components/auth/types";

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
    // Check active sessions and get user profile data
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user profile with role
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            throw profileError;
          }

          if (profile) {
            // Ensure role is either 'admin' or 'seller'
            const role = profile.role === 'admin' ? 'admin' : 'seller';
            
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
        console.error('Error checking user session:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem checking your login status."
        });
        // Clear user state on error
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            throw profileError;
          }

          if (profile) {
            // Ensure role is either 'admin' or 'seller'
            const role = profile.role === 'admin' ? 'admin' : 'seller';
            
            setUser({
              id: session.user.id,
              email: session.user.email!,
              role: role,
              businessName: profile.name,
              whatsappNumber: profile.whatsapp_number
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          navigate('/auth/login');
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem updating your login status."
        });
        setUser(null);
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
      console.error('Error signing out:', error);
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