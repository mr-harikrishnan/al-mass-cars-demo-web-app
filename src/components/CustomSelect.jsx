import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

export const CustomSelect = ({ value, onChange, options, placeholder, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || { value, label: placeholder };

  return (
    <div className={`relative ${isOpen ? 'z-30' : 'z-10'} ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-black/20 flex items-center justify-between py-2.5 px-4 cursor-pointer text-white border border-white/10 rounded-xl hover:border-gold/50 focus:border-gold/50 focus:outline-none transition-all duration-200"
      >
        <span className="truncate">{selectedOption.label}</span>
        <FiChevronDown className={`ml-2 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-gold' : 'text-gray-400'}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-50 left-0 right-0 mt-2 py-1.5 bg-charcoal-elevated border border-white/10 rounded-xl shadow-gold-glow max-h-60 overflow-y-auto"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange({ target: { value: opt.value } });
                  setIsOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-150 ${
                  opt.value === value
                    ? 'bg-gold/15 text-gold font-medium'
                    : 'text-gray-300 hover:bg-gold/10 hover:text-gold'
                }`}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
