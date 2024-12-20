import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="lg:hidden"
        aria-label="Menu"
      >
        <Menu className="h-6 w-6 text-[#002C5F]" />
      </button>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 transform transition-transform duration-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <img
                src="/placeholder.svg"
                alt="PushNshop"
                className="h-8 w-8"
              />
              <span className="font-semibold">PushNshop</span>
            </Link>
            <button onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4">
            <div className="space-y-4">
              <Link 
                to="/categories"
                className="block text-gray-600 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                {language === 'en' ? 'Categories' : 'Catégories'}
              </Link>
              <Link 
                to="/how-it-works"
                className="block text-gray-600 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                {language === 'en' ? 'How it Works' : 'Comment ça marche'}
              </Link>
              <Link 
                to="/safety"
                className="block text-gray-600 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                {language === 'en' ? 'Safety' : 'Sécurité'}
              </Link>
              <Link 
                to="/contact"
                className="block text-gray-600 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                {language === 'en' ? 'Contact' : 'Contact'}
              </Link>
            </div>
            {!user && (
              <div className="mt-6 space-y-4">
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={() => handleAuthAction('/auth/login')}
                >
                  {language === 'en' ? 'Sign In' : 'Connexion'}
                </Button>
                <Button 
                  className="w-full" 
                  onClick={() => handleAuthAction('/auth/signup')}
                >
                  {language === 'en' ? 'Start Selling' : 'Commencer à vendre'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}