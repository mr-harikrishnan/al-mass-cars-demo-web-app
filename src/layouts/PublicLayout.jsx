import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DataContext } from '../contexts/DataContext';
import { FaWhatsapp } from 'react-icons/fa';

export const PublicLayout = () => {
  const { settings } = useContext(DataContext);
  
  const whatsappNumber = settings?.whatsapp || '918111004777';
  const whatsappMsg = encodeURIComponent("Hello AL-MAS Cars, I would like to enquire about vehicle availability.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div className="flex flex-col min-h-screen bg-charcoal-base text-gray-100 font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[999] bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Contact on WhatsApp"
      >
        <FaWhatsapp className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-out whitespace-nowrap text-sm font-semibold">
          WhatsApp Support
        </span>
      </a>
    </div>
  );
};
