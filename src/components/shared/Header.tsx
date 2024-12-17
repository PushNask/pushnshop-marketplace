import { Link } from 'react-router-dom';
import { MobileMenu } from './navigation/MobileMenu';
import { SearchBar } from './navigation/SearchBar';
import { UserMenu } from './navigation/UserMenu';
import { LanguageToggle } from './navigation/LanguageToggle';

export function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="container mx-auto px-4">
        {/* Mobile Menu Button and Logo */}
        <div className="lg:hidden flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/placeholder.svg"
              alt="PushNshop"
              className="h-8 w-8"
            />
          </Link>
          <MobileMenu />
        </div>

        {children}

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
                Categories
              </Link>
              <Link 
                to="/how-it-works"
                className="text-gray-600 hover:text-gray-900"
              >
                How it Works
              </Link>
              <Link 
                to="/safety"
                className="text-gray-600 hover:text-gray-900"
              >
                Safety
              </Link>
              <Link 
                to="/contact"
                className="text-gray-600 hover:text-gray-900"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <UserMenu />
            <LanguageToggle />
          </div>
        </div>

        {/* Search Bar */}
        <div className="py-3">
          <SearchBar />
        </div>
      </nav>
    </header>
  );
}