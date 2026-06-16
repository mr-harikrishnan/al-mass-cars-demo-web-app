import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { formatDate } from '../../utils/formatters';
import { FiUser, FiMail, FiPhone, FiCalendar, FiCheck } from 'react-icons/fi';

export const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Hydrate fields on mount
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // 1. Presence check
      if (!name || !email || !phone) {
        throw new Error("All profile fields are required.");
      }

      // 2. Format checks
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address.");
      }

      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        throw new Error("Phone number must be exactly 10 digits.");
      }

      // Update in context (which updates local storage)
      await updateProfile({ name, email, phone });
      addToast("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Profile update failed:", err);
      const safeMsg = err.message || "Unable to update profile. Verify your inputs and try again.";
      setError(safeMsg);
      addToast(safeMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left max-w-2xl mx-auto">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Profile Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Review your personal registration details and account activity status.</p>
      </div>

      <Card hoverEffect={false} className="p-8 border border-white/5 bg-white/5">
        {error && (
          <div className="mb-6 p-4 text-xs font-medium text-red-200 border border-red-500/20 bg-red-950/30 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* User Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-11 text-sm"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-11 text-sm"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Phone Number</label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field pl-11 text-sm"
                required
              />
            </div>
          </div>

          {/* Read Only Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-gray-500 font-bold uppercase text-[9px]">Account Role</span>
                <p className="text-sm font-semibold text-white mt-0.5 capitalize">{currentUser?.role}</p>
              </div>
              <FiUser className="w-5 h-5 text-gold opacity-60" />
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-gray-500 font-bold uppercase text-[9px]">Member Since</span>
                <p className="text-sm font-semibold text-white mt-0.5">
                  {currentUser?.created_at ? formatDate(currentUser.created_at) : 'Jan 01, 2026'}
                </p>
              </div>
              <FiCalendar className="w-5 h-5 text-gold opacity-60" />
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
              <span>Save Changes</span>
              <FiCheck />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default Profile;
