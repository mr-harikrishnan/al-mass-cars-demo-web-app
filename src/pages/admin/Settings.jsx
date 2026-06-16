import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { FiPhone, FiMapPin, FiCheck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export const Settings = () => {
  const { settings, updateSettings } = useContext(DataContext);
  const { addToast } = useToast();

  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Hydrate fields on settings change
  useEffect(() => {
    if (settings) {
      setPhone(settings.phone || '');
      setWhatsapp(settings.whatsapp || '');
      setLocation(settings.location || '');
    }
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      // 1. Presence check
      if (!phone || !whatsapp || !location) {
        throw new Error("All business configuration fields are required.");
      }

      // 2. Format checks
      const numericPhone = phone.replace(/\D/g, '');
      if (numericPhone.length < 8) {
        throw new Error("Please enter a valid phone contact number.");
      }

      const numericWhatsapp = whatsapp.replace(/\D/g, '');
      if (numericWhatsapp.length < 10) {
        throw new Error("Please enter a valid WhatsApp contact number (with country code, e.g. 918111004777).");
      }

      // 3. Save updates
      await updateSettings({ phone, whatsapp, location });
      addToast("Business contact settings updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update settings", err);
      const safeMsg = err.message || "Failed to save settings. Please try again.";
      setFormError(safeMsg);
      addToast(safeMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left max-w-2xl mx-auto">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Business Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Configure customer helpline phone lines, WhatsApp message links, and station address markers.</p>
      </div>

      <Card hoverEffect={false} className="p-8 border border-white/5 bg-white/5">
        {formError && (
          <div className="mb-6 p-4 text-xs font-medium text-red-200 border border-red-500/20 bg-red-950/30 rounded-xl">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Phone Helpline */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Helpline Phone *</label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 8111004777"
                className="input-field pl-11 text-sm"
                required
              />
            </div>
          </div>

          {/* WhatsApp contact */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">WhatsApp Contact (with Country Code) *</label>
            <div className="relative">
              <FaWhatsapp className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. 918111004777"
                className="input-field pl-11 text-sm"
                required
              />
            </div>
            <p className="text-[10px] text-gray-600">Ensure to prepend the country code (91 for India) without '+' or spaces.</p>
          </div>

          {/* Location details */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Office Location Address *</label>
            <div className="relative">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Chennai Mannady Metro Station (Near Parrys)"
                className="input-field pl-11 text-sm"
                required
              />
            </div>
          </div>

          {/* Action button */}
          <div className="flex items-center justify-end pt-4 border-t border-white/5">
            <Button
              type="submit"
              variant="primary"
              className="text-xs uppercase font-bold tracking-wider py-2.5 px-6"
              isLoading={isSubmitting}
            >
              <span>Save Configurations</span>
              <FiCheck />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default Settings;
