import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  FiGrid,
  FiTruck,
  FiBookOpen,
  FiFileText,
  FiUser,
  FiLogOut,
  FiCalendar,
  FiSettings,
  FiUsers,
  FiX
} from 'react-icons/fi';
import { TbCurrencyRupee } from 'react-icons/tb';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar = ({ isOpen, onClose, role }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const userLinks = [
    { to: '/user/dashboard', label: 'Dashboard', icon: FiGrid },
    { to: '/user/cars', label: 'Available Cars', icon: FiTruck },
    { to: '/user/bookings', label: 'My Bookings', icon: FiBookOpen },
    { to: '/user/terms', label: 'Terms & Conditions', icon: FiFileText },
    { to: '/user/profile', label: 'Profile', icon: FiUser },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
    { to: '/admin/bookings', label: 'Bookings', icon: FiBookOpen },
    { to: '/admin/vehicles', label: 'Vehicles', icon: FiTruck },
    { to: '/admin/customers', label: 'Customers', icon: FiUsers },
    { to: '/admin/pricing', label: 'Pricing', icon: TbCurrencyRupee },
    { to: '/admin/calendar', label: 'Availability Calendar', icon: FiCalendar },
    { to: '/admin/terms', label: 'Terms & Conditions', icon: FiFileText },
    { to: '/admin/settings', label: 'Settings', icon: FiSettings },
  ];

  const links = role === 'admin' ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-charcoal-elevated border-r border-white/10 w-64 text-gray-300">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-heading text-lg font-bold tracking-wider text-white">
            <span className="gold-gradient-text">AL-MAS</span>
          </span>
          <span className="text-white text-[10px] font-sans tracking-[0.2em] font-medium -mt-1">
            {role === 'admin' ? 'ADMIN PANEL' : 'CUSTOMER PORTAL'}
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white p-1" aria-label="Close sidebar">
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gold/10 text-gold border-l-4 border-gold'
                    : 'hover:bg-white/5 hover:text-white border-l-4 border-transparent'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Profile & Logout Section */}
      <div className="p-4 border-t border-white/5 flex flex-col gap-3">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-gold-light to-gold-dark text-black font-bold flex items-center justify-center shrink-0">
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{currentUser?.name || 'User'}</p>
            <p className="text-[10px] text-gray-500 truncate">{currentUser?.email || 'email@domain.com'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150"
        >
          <FiLogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block fixed inset-y-0 left-0 z-40 w-64 h-screen">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 w-64 shadow-2xl h-screen"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
