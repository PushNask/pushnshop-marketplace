export interface AuthState {
  email: string;
  password: string;
  businessName?: string;
  whatsappNumber?: string;
  role: 'seller' | 'admin';
}

export interface AuthFormProps {
  defaultView?: 'login' | 'signup';
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface User {
  id: string;
  email: string;
  role: 'seller' | 'admin';
  businessName?: string;
  whatsappNumber?: string;
}