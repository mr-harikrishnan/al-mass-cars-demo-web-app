import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';

export const Footer = () => {
  const navigate = useNavigate();

  const handleScrollTo = (elementId) => {
    if (window.location.pathname !== '/') {
      navigate('/', { state: { scrollTo: elementId } });
      return;
    }
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-charcoal-elevated border-t border-white/10 pt-16 pb-8 px-4 md:px-8 text-gray-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand Col */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex flex-col">
            <span className="font-heading text-2xl font-bold tracking-wider text-white">
              <span className="gold-gradient-text">AL-MAS</span>
            </span>
            <span className="text-white text-xs font-sans tracking-[0.2em] font-medium -mt-1">
              SELF DRIVE CARS
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-500">
            Premium self-drive car rentals in Chennai. Experience luxury and convenience with our top-tier fleet.
          </p>
          <div className="flex items-center gap-4 text-gray-300">
            <a href="#" className="hover:text-gold transition-colors duration-150" aria-label="Facebook">
              <FiFacebook className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-gold transition-colors duration-150" aria-label="Instagram">
              <FiInstagram className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-gold transition-colors duration-150" aria-label="Twitter">
              <FiTwitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="font-heading text-white font-semibold tracking-wider text-base">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button onClick={() => handleScrollTo('hero')} className="hover:text-gold transition-colors duration-150">Home</button>
            </li>
            <li>
              <button onClick={() => handleScrollTo('about')} className="hover:text-gold transition-colors duration-150">About Company</button>
            </li>
            <li>
              <button onClick={() => handleScrollTo('why-us')} className="hover:text-gold transition-colors duration-150">Why Choose Us</button>
            </li>
            <li>
              <button onClick={() => handleScrollTo('preview-cars')} className="hover:text-gold transition-colors duration-150">Our Fleet Preview</button>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div className="flex flex-col gap-4">
          <h4 className="font-heading text-white font-semibold tracking-wider text-base">Policies & Details</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/terms" className="hover:text-gold transition-colors duration-150">Terms & Conditions</Link>
            </li>
            <li>
              <Link to="/deposit-details" className="hover:text-gold transition-colors duration-150">Deposit & Documents</Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-gold transition-colors duration-150">Privacy Policy</Link>
            </li>
            <li>
              <button onClick={() => handleScrollTo('contact')} className="hover:text-gold transition-colors duration-150">Contact Us</button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4 text-sm">
          <h4 className="font-heading text-white font-semibold tracking-wider text-base">Get in Touch</h4>
          <div className="flex items-start gap-2.5">
            <FiMapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <span>Chennai Mannady Metro Station (Near Parrys)</span>
          </div>
          <div className="flex items-center gap-2.5">
            <FiPhone className="w-4 h-4 text-gold shrink-0" />
            <a href="tel:8111004777" className="hover:text-gold transition-colors duration-150">8111004777</a>
          </div>
          <div className="flex items-center gap-2.5">
            <FiMail className="w-4 h-4 text-gold shrink-0" />
            <a href="mailto:info@almascars.com" className="hover:text-gold transition-colors duration-150">info@almascars.com</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
        <p>© {new Date().getFullYear()} AL-MAS Self Drive Cars. All rights reserved.</p>
        <p>Portfolio Demo Application</p>
      </div>
    </footer>
  );
};
