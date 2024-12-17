import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export function Footer() {
  const { language, toggleLanguage } = useLanguage();
  const year = new Date().getFullYear();

  const footerLinks = {
    about: {
      title: language === 'en' ? 'About' : 'À propos',
      links: [
        { 
          href: '/about', 
          label: language === 'en' ? 'About Us' : 'À propos de nous' 
        },
        { 
          href: '/careers', 
          label: language === 'en' ? 'Careers' : 'Carrières' 
        },
        { 
          href: '/press', 
          label: language === 'en' ? 'Press' : 'Presse' 
        }
      ]
    },
    support: {
      title: language === 'en' ? 'Support' : 'Support',
      links: [
        { 
          href: '/help', 
          label: language === 'en' ? 'Help Center' : 'Centre d\'aide' 
        },
        { 
          href: '/safety', 
          label: language === 'en' ? 'Safety Center' : 'Centre de sécurité' 
        },
        { 
          href: '/community', 
          label: language === 'en' ? 'Community' : 'Communauté' 
        }
      ]
    },
    legal: {
      title: language === 'en' ? 'Legal' : 'Légal',
      links: [
        { 
          href: '/privacy', 
          label: language === 'en' ? 'Privacy Policy' : 'Politique de confidentialité' 
        },
        { 
          href: '/terms', 
          label: language === 'en' ? 'Terms of Service' : 'Conditions d\'utilisation' 
        },
        { 
          href: '/cookies', 
          label: language === 'en' ? 'Cookie Policy' : 'Politique des cookies' 
        }
      ]
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src="/placeholder.svg"
                alt="PushNshop"
                className="h-8 w-8"
              />
              <span className="font-semibold text-xl">PushNshop</span>
            </Link>
            <p className="text-gray-600 mb-4">
              {language === 'en' 
                ? 'Your trusted local marketplace for quick deals and verified sellers.'
                : 'Votre place de marché locale de confiance pour des offres rapides et des vendeurs vérifiés.'}
            </p>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#005BBB] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#005BBB] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#005BBB] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href}
                      className="text-gray-600 hover:text-[#005BBB] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {year} PushNshop. {language === 'en' ? 'All rights reserved.' : 'Tous droits réservés.'}
            </p>
            <div className="flex gap-6">
              <button 
                onClick={toggleLanguage}
                className="text-sm text-gray-600 hover:text-[#005BBB]"
              >
                {language === 'en' ? 'Français' : 'English'}
              </button>
              <Link 
                to="/sitemap" 
                className="text-sm text-gray-600 hover:text-[#005BBB]"
              >
                Sitemap
              </Link>
              <Link 
                to="/accessibility" 
                className="text-sm text-gray-600 hover:text-[#005BBB]"
              >
                {language === 'en' ? 'Accessibility' : 'Accessibilité'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}