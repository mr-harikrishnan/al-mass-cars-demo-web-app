import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { FiMenu } from 'react-icons/fi';

export const UserDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-charcoal-base text-gray-100 flex flex-col md:flex-row">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="user" />

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-charcoal-elevated border-b border-white/10 sticky top-0 z-30">
        <span className="font-heading text-lg font-bold tracking-wider text-white">
          <span className="gold-gradient-text">AL-MAS</span>
          <span className="text-white text-[9px] font-sans tracking-[0.15em] font-medium block -mt-0.5">CUSTOMER PORTAL</span>
        </span>
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-300 hover:text-white p-2 border border-white/10 rounded-lg"
          aria-label="Open sidebar"
        >
          <FiMenu className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <main className="flex-grow p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
