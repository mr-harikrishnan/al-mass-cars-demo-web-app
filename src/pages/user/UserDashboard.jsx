import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../../contexts/DataContext';
import { useAuth } from '../../hooks/useAuth';
import { formatDateTime, formatDate } from '../../utils/formatters';
import { Card } from '../../components/Card';
import { FiClock, FiCheckSquare, FiTruck, FiUser, FiChevronRight } from 'react-icons/fi';

export const UserDashboard = () => {
  const { vehicles, bookings } = useContext(DataContext);
  const { currentUser } = useAuth();

  // Filter user's specific bookings (by email or phone number)
  const userBookings = bookings.filter(b => {
    const emailMatch = b.customerEmail && currentUser?.email && b.customerEmail.toLowerCase() === currentUser.email.toLowerCase();
    const phoneMatch = b.phone && currentUser?.phone && b.phone === currentUser.phone;
    return emailMatch || phoneMatch;
  });

  // Stat metrics
  const totalAvailableCars = vehicles.filter(v => v.availability === 'available').length;
  
  const activeRequests = userBookings.filter(b => b.status === 'pending' || b.status === 'approved').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingTrips = userBookings
    .filter(b => b.status === 'approved' && b.pickupDate >= todayStr)
    .sort((a, b) => new Date(a.pickupDate) - new Date(b.pickupDate));

  return (
    <div className="flex flex-col gap-8 text-left">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Welcome, {currentUser?.name}</h1>
        <p className="text-xs text-gray-500 mt-1">Manage your drives and monitor booking requests live.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hoverEffect={true} className="p-6 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Fleet Available</span>
            <h3 className="text-3xl font-bold text-white mt-1">{totalAvailableCars}</h3>
            <p className="text-[10px] text-gray-600 mt-1">Total cars ready to rent</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <FiTruck className="w-6 h-6" />
          </div>
        </Card>

        <Card hoverEffect={true} className="p-6 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Active Bookings</span>
            <h3 className="text-3xl font-bold text-white mt-1">{activeRequests}</h3>
            <p className="text-[10px] text-gray-600 mt-1">Pending & approved drives</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <FiCheckSquare className="w-6 h-6" />
          </div>
        </Card>

        <Card hoverEffect={true} className="p-6 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Upcoming Trips</span>
            <h3 className="text-3xl font-bold text-white mt-1">{upcomingTrips.length}</h3>
            <p className="text-[10px] text-gray-600 mt-1">Approved drives scheduled</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <FiClock className="w-6 h-6" />
          </div>
        </Card>

        {/* Profile Card */}
        <Card hoverEffect={true} className="p-6 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Profile Status</span>
            <h3 className="text-sm font-semibold text-white mt-2.5 truncate max-w-[140px]">{currentUser?.name}</h3>
            <p className="text-[10px] text-gray-600 mt-1 truncate max-w-[140px]">{currentUser?.email}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <FiUser className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Lower Dashboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upcoming Trips List */}
        <Card hoverEffect={false} className="lg:col-span-2 p-6 border border-white/5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading text-lg font-semibold text-white">Upcoming Trips</h3>
            <Link to="/user/bookings" className="text-xs font-bold text-gold hover:text-gold-light transition-all flex items-center gap-1">
              <span>View All</span>
              <FiChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {upcomingTrips.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center py-12 text-gray-500 bg-black/10 rounded-xl border border-white/5 gap-2">
              <FiClock className="w-10 h-10 opacity-30 text-gold" />
              <p className="text-sm font-medium">No upcoming trips scheduled</p>
              <Link to="/user/cars" className="text-xs font-bold text-gold hover:underline mt-2">Book a vehicle now</Link>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm text-gray-400">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-white/5">
                    <th className="pb-3 pr-4">Booking ID</th>
                    <th className="pb-3 px-4">Vehicle</th>
                    <th className="pb-3 px-4">Pickup Date</th>
                    <th className="pb-3 px-4">Return Date</th>
                    <th className="pb-3 pl-4">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {upcomingTrips.slice(0, 5).map((trip) => (
                    <tr key={trip.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 pr-4 font-semibold text-white">{trip.id}</td>
                      <td className="py-3 px-4 text-white font-medium">{trip.vehicleName}</td>
                      <td className="py-3 px-4">{formatDate(trip.pickupDate)}</td>
                      <td className="py-3 px-4">{formatDate(trip.returnDate)}</td>
                      <td className="py-3 pl-4 text-xs font-semibold text-gold">{trip.pickupTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Dynamic Booking Tips Card */}
        <Card hoverEffect={true} className="p-6 border border-white/5 bg-gradient-to-br from-charcoal-elevated to-charcoal-base flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-lg font-semibold text-white">Rental Checklist</h3>
            <ul className="space-y-3.5 text-xs text-gray-400">
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded bg-gold/15 flex items-center justify-center shrink-0 text-gold text-[10px] font-bold mt-0.5">1</div>
                <span>Ensure you carry original Driving License & Aadhaar during pick-up.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded bg-gold/15 flex items-center justify-center shrink-0 text-gold text-[10px] font-bold mt-0.5">2</div>
                <span>Keep ₹5000 refundable security deposit ready before delivery.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded bg-gold/15 flex items-center justify-center shrink-0 text-gold text-[10px] font-bold mt-0.5">3</div>
                <span>Fuel must be returned at the same level as provided initially.</span>
              </li>
            </ul>
          </div>
          <div className="pt-6">
            <Link to="/user/cars" className="gold-btn-primary w-full text-center text-xs block font-bold uppercase tracking-wider">
              Browse Fleet
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};
export default UserDashboard;
