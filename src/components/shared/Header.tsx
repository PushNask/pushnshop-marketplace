import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Menu,
  X,
  ChevronDown,
  User,
  ShoppingBag,
  LogOut,
  Settings,
  Bell
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Header({ children }: { children?: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { language } = useLanguage();

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="container mx-auto px-4">
        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/placeholder.svg"
              alt="PushNshop"
              className="h-8 w-8"
            />
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {children}

        {/* Mobile Menu */}
        <div className={`
          lg:hidden fixed inset-0 bg-white z-50 transform transition-transform duration-200
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/placeholder.svg"
                alt="PushNshop"
                className="h-8 w-8"
              />
              <span className="font-semibold">PushNshop</span>
            </Link>
            <button onClick={() => setIsMenuOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4">
            <div className="space-y-4">
              <Link 
                to="/categories"
                className="block text-gray-600 hover:text-gray-900"
              >
                {language === 'en' ? 'Categories' : 'Catégories'}
              </Link>
              <Link 
                to="/how-it-works"
                className="block text-gray-600 hover:text-gray-900"
              >
                {language === 'en' ? 'How it Works' : 'Comment ça marche'}
              </Link>
              <Link 
                to="/safety"
                className="block text-gray-600 hover:text-gray-900"
              >
                {language === 'en' ? 'Safety' : 'Sécurité'}
              </Link>
              <Link 
                to="/contact"
                className="block text-gray-600 hover:text-gray-900"
              >
                {language === 'en' ? 'Contact' : 'Contact'}
              </Link>
            </div>
            {!user && (
              <div className="mt-6 space-y-4">
                <Button className="w-full" variant="outline" asChild>
                  <Link to="/auth/login">
                    {language === 'en' ? 'Sign In' : 'Connexion'}
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link to="/auth/register">
                    {language === 'en' ? 'Start Selling' : 'Commencer à vendre'}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center justify-between py-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/placeholder.svg"
                alt="PushNshop"
                className="h-8 w-8"
              />
            </Link>
            <div className="flex gap-6">
              <Link 
                to="/categories"
                className="text-gray-600 hover:text-gray-900"
              >
                {language === 'en' ? 'Categories' : 'Catégories'}
              </Link>
              <Link 
                to="/how-it-works"
                className="text-gray-600 hover:text-gray-900"
              >
                {language === 'en' ? 'How it Works' : 'Comment ça marche'}
              </Link>
              <Link 
                to="/safety"
                className="text-gray-600 hover:text-gray-900"
              >
                {language === 'en' ? 'Safety' : 'Sécurité'}
              </Link>
              <Link 
                to="/contact"
                className="text-gray-600 hover:text-gray-900"
              >
                {language === 'en' ? 'Contact' : 'Contact'}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to={user.role === 'admin' ? '/admin' : '/seller/dashboard'}>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Dashboard' : 'Tableau de bord'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Profile' : 'Profil'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      {language === 'en' ? 'Settings' : 'Paramètres'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {language === 'en' ? 'Sign Out' : 'Déconnexion'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-4">
                <Button variant="ghost" asChild>
                  <Link to="/auth/login">
                    {language === 'en' ? 'Sign In' : 'Connexion'}
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/auth/register">
                    {language === 'en' ? 'Start Selling' : 'Commencer à vendre'}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}