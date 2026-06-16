import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { FiMail, FiLock, FiChevronRight } from 'react-icons/fi';

export const Login = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Presence check
      if (!email || !password) {
        throw new Error("Please enter both email and password.");
      }

      // 2. Format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address.");
      }

      // 3. Business rule verification
      const session = await login(email, password);
      addToast(`Welcome back, ${session.name}!`, 'success');
      
      if (session.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      console.error("Login attempt failed:", err);
      const safeMessage = err.message || "Unable to log in. Please verify the entered information and try again.";
      setError(safeMessage);
      addToast(safeMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-charcoal-base">
      <div className="max-w-md w-full">
        <Card hoverEffect={false} className="p-8 border border-white/10 shadow-gold-glow-lg">
          <div className="text-center mb-8">
            <span className="font-heading text-2xl font-bold tracking-wider text-white">
              <span className="gold-gradient-text">AL-MAS</span>
            </span>
            <span className="text-white text-xs font-sans tracking-[0.2em] font-medium block -mt-1 mb-6">
              SELF DRIVE CARS
            </span>
            <h2 className="text-xl font-bold text-white tracking-wide">Sign In to Your Account</h2>
            <p className="mt-1.5 text-xs text-gray-500">Enter your credentials to manage your bookings.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 text-xs font-medium text-red-200 border border-red-500/20 bg-red-950/30 rounded-xl text-left">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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
                  placeholder="••••••••"
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
              <span>Sign In</span>
              <FiChevronRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-gold hover:text-gold-light font-bold hover:underline">
              Create an Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Login;
