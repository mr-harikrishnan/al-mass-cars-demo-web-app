import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FiMenu, FiX, FiUser, FiChevronRight } from 'react-icons/fi';

export const Navbar = () => {
  const { currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const dashboardPath = currentUser?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';

  return (
    <nav className="sticky top-0 z-[1000] bg-charcoal-base/80 backdrop-blur-md border-b border-white/10 px-4 py-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-heading text-xl md:text-2xl font-bold tracking-wider">
            <span className="gold-gradient-text">AL-MAS</span>
            <span className="text-white text-xs block font-sans tracking-[0.2em] font-medium -mt-1">SELF DRIVE CARS</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <button onClick={() => handleNavClick('hero')} className="hover:text-gold transition-colors duration-150">Home</button>
          <button onClick={() => handleNavClick('about')} className="hover:text-gold transition-colors duration-150">About</button>
          <button onClick={() => handleNavClick('why-us')} className="hover:text-gold transition-colors duration-150">Why Us</button>
          <button onClick={() => handleNavClick('preview-cars')} className="hover:text-gold transition-colors duration-150">Fleet</button>
          <button onClick={() => handleNavClick('contact')} className="hover:text-gold transition-colors duration-150">Contact</button>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <Link to={dashboardPath} className="gold-btn-primary flex items-center gap-2 text-xs">
              <FiUser className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white text-sm font-semibold px-4 py-2">
                Login
              </Link>
              <Link to="/signup" className="gold-btn-primary text-xs">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-white p-1"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] bg-charcoal-elevated/95 border-b border-white/10 p-6 flex flex-col gap-6 backdrop-blur-md">
          <div className="flex flex-col gap-4 text-left font-medium text-gray-200">
            <button onClick={() => handleNavClick('hero')} className="py-2 border-b border-white/5 hover:text-gold transition-all text-left">Home</button>
            <button onClick={() => handleNavClick('about')} className="py-2 border-b border-white/5 hover:text-gold transition-all text-left">About</button>
            <button onClick={() => handleNavClick('why-us')} className="py-2 border-b border-white/5 hover:text-gold transition-all text-left">Why Us</button>
            <button onClick={() => handleNavClick('preview-cars')} className="py-2 border-b border-white/5 hover:text-gold transition-all text-left">Fleet</button>
            <button onClick={() => handleNavClick('contact')} className="py-2 border-b border-white/5 hover:text-gold transition-all text-left">Contact</button>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {currentUser ? (
              <Link
                to={dashboardPath}
                onClick={() => setMobileMenuOpen(false)}
                className="gold-btn-primary w-full flex items-center justify-center gap-2 text-center"
              >
                <FiUser />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="gold-btn-secondary w-full text-center"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="gold-btn-primary w-full text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
