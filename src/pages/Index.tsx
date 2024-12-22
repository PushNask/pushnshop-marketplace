import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is logged in, redirect to their dashboard
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/seller/dashboard'} replace />;
  }

  // Otherwise, show the public home page
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to PushNshop</h1>
      <div className="text-center">
        <p className="text-xl mb-4">Your one-stop marketplace for local buying and selling</p>
        <div className="flex justify-center gap-4">
          <a 
            href="/auth/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </a>
          <a 
            href="/auth/signup" 
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
