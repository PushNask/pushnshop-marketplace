import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@/components/auth/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refreshUser = async () => {
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
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh user session. Please try logging in again."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN') {
        await refreshUser();
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigate('/auth/login');
      } else if (event === 'TOKEN_REFRESHED') {
        await refreshUser();
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
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
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