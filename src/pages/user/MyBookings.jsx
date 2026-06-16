import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { Card } from '../../components/Card';
import { TableSkeleton } from '../../components/Skeleton';
import { FiClock, FiCheckCircle, FiXCircle, FiTruck } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const MyBookings = () => {
  const { bookings } = useContext(DataContext);
  const { currentUser } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Filter this user's bookings
  const userBookings = bookings.filter(
    b => b.customerEmail.toLowerCase() === currentUser?.email?.toLowerCase()
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1.5 w-fit text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-yellow-950/80 border border-yellow-500/30 text-yellow-400">
            <FiClock className="w-3.5 h-3.5 shrink-0" />
            <span>Pending</span>
          </span>
        );
      case 'approved':
        return (
          <span className="flex items-center gap-1.5 w-fit text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
            <FiCheckCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Approved</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1.5 w-fit text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-red-950/80 border border-red-500/30 text-red-400">
            <FiXCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Rejected</span>
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1.5 w-fit text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-blue-950/80 border border-blue-500/30 text-blue-400">
            <FiTruck className="w-3.5 h-3.5 shrink-0" />
            <span>Completed</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">My Booking Requests</h1>
        <p className="text-xs text-gray-500 mt-1">Track active drives, approvals, and trip receipts.</p>
      </div>

      {isInitialLoad ? (
        <TableSkeleton rows={5} cols={6} />
      ) : userBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white/5 border border-white/5 rounded-2xl gap-2 text-center">
          <FiTruck className="w-12 h-12 text-gold opacity-30 animate-pulse" />
          <h3 className="font-heading text-lg font-bold text-white mt-2">No Bookings Found</h3>
          <p className="text-xs max-w-xs leading-relaxed mb-4">You have not submitted any vehicle rental requests yet.</p>
          <Link to="/user/cars" className="gold-btn-primary text-xs uppercase font-bold tracking-wider py-2.5 px-6">
            Rent a Car Now
          </Link>
        </div>
      ) : (
        <Card hoverEffect={false} className="overflow-hidden border border-white/5">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-gray-300">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-white/10 bg-charcoal-elevated/40">
                  <th className="p-4">Booking ID</th>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Pickup Date</th>
                  <th className="p-4">Return Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Delivery Location</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {userBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">{booking.id}</td>
                    <td className="p-4 text-white font-medium">{booking.vehicleName}</td>
                    <td className="p-4">{formatDate(booking.pickupDate)}</td>
                    <td className="p-4">{formatDate(booking.returnDate)}</td>
                    <td className="p-4 text-gold font-semibold text-xs">{booking.pickupTime}</td>
                    <td className="p-4 text-gray-400 max-w-[200px] truncate" title={booking.location}>
                      {booking.location}
                    </td>
                    <td className="p-4">{getStatusBadge(booking.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
export default MyBookings;
