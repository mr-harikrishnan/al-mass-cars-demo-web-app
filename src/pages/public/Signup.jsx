import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { FiUser, FiMail, FiPhone, FiLock, FiChevronRight } from 'react-icons/fi';

export const Signup = () => {
  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Presence check
      if (!name || !email || !phone || !password || !confirmPassword) {
        throw new Error("All registration fields are required.");
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

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      // 3. Business rule check is handled inside context signup (checking if email exists)
      await signup({ name, email, phone, password, confirmPassword });
      
      addToast("Account created successfully. Welcome to AL-MAS Cars!", "success");
      navigate('/user/dashboard');
    } catch (err) {
      console.error("Signup attempt failed:", err);
      const safeMessage = err.message || "Unable to create account. Please verify the entered information and try again.";
      setError(safeMessage);
      addToast(safeMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-charcoal-base">
      <div className="max-w-md w-full">
        <Card hoverEffect={false} className="p-8 border border-white/10 shadow-gold-glow-lg">
          <div className="text-center mb-8">
            <span className="font-heading text-2xl font-bold tracking-wider text-white">
              <span className="gold-gradient-text">AL-MAS</span>
            </span>
            <span className="text-white text-xs font-sans tracking-[0.2em] font-medium block -mt-1 mb-6">
              SELF DRIVE CARS
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">Create an Account</h2>
            <p className="mt-1.5 text-xs text-gray-500">Sign up now to browse our fleet and rent vehicles.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 text-xs font-medium text-red-200 border border-red-500/20 bg-red-950/30 rounded-xl text-left">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="name" className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-11 text-sm"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="email" className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11 text-sm"
                  placeholder="name@domain.com"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="phone" className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field pl-11 text-sm"
                  placeholder="9876543210"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="password" className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11 text-sm"
                  placeholder="Min 6 characters"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="confirmPassword" className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-11 text-sm"
                  placeholder="Repeat your password"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full text-xs font-bold uppercase tracking-wider py-3 mt-6"
              isLoading={isLoading}
            >
              <span>Register Now</span>
              <FiChevronRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-gold hover:text-gold-light font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Signup;
