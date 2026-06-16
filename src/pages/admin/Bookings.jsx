import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { useToast } from '../../hooks/useToast';
import { formatDate, formatDateTime, formatCurrency } from '../../utils/formatters';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { TableSkeleton } from '../../components/Skeleton';
import { CustomSelect } from '../../components/CustomSelect';
import { FiSearch, FiSliders, FiClock, FiCheckCircle, FiXCircle, FiTruck, FiInfo, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';

export const Bookings = () => {
  const { bookings, vehicles, updateBookingStatus } = useContext(DataContext);
  const { addToast } = useToast();

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Search & Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal Details state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = async (bookingId, newStatus, vehicleName) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      addToast(`Booking ${bookingId} has been successfully marked as ${newStatus}!`, 'success');
      
      // Update selected booking detail state locally if modal is open
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error("Failed to update status", error);
      addToast("Failed to update booking status. Please try again.", 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 w-fit text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-yellow-950/80 border border-yellow-500/30 text-yellow-400">
            <FiClock className="w-3 shrink-0" />
            <span>Pending</span>
          </span>
        );
      case 'approved':
        return (
          <span className="flex items-center gap-1 w-fit text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
            <FiCheckCircle className="w-3 shrink-0" />
            <span>Approved</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 w-fit text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-950/80 border border-red-500/30 text-red-400">
            <FiXCircle className="w-3 shrink-0" />
            <span>Rejected</span>
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 w-fit text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-blue-400">
            <FiTruck className="w-3 shrink-0" />
            <span>Completed</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesSearch = 
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search);
    return matchesStatus && matchesSearch;
  });

  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
    setDetailModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">Booking Management</h1>
          <p className="text-xs text-gray-500 mt-1">Approve rentals, reject requests, and check customer verification statuses.</p>
        </div>

        <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-gray-400 self-start md:self-auto font-medium">
          Showing <strong className="text-gold">{filteredBookings.length}</strong> of {bookings.length} reservations
        </span>
      </div>

      {/* Filter and Search Panel */}
      <Card hoverEffect={false} className="p-4 md:p-6 border border-white/5 flex flex-col md:flex-row items-center gap-4 relative z-20">
        {/* Search */}
        <div className="relative w-full md:flex-grow">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, customer name, vehicle, or phone..."
            className="input-field pl-11 text-sm bg-black/20"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <FiSliders className="text-gold w-4 h-4 shrink-0 hidden sm:block" />
          <CustomSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Bookings' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'completed', label: 'Completed' },
              { value: 'rejected', label: 'Rejected' }
            ]}
            className="w-full md:w-48"
          />
        </div>
      </Card>

      {/* Table view */}
      {isInitialLoad ? (
        <TableSkeleton rows={5} cols={7} />
      ) : filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white/5 border border-white/5 rounded-2xl gap-2 text-center">
          <FiClock className="w-12 h-12 text-gold opacity-30 animate-pulse" />
          <h3 className="font-heading text-lg font-bold text-white mt-2">No Requests Found</h3>
          <p className="text-xs max-w-xs leading-relaxed">Adjust your status dropdown or search query parameters.</p>
        </div>
      ) : (
        <Card hoverEffect={false} className="overflow-hidden border border-white/5">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-gray-300">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-white/10 bg-charcoal-elevated/40">
                  <th className="p-4">ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Pickup</th>
                  <th className="p-4">Return</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(booking)}
                  >
                    <td className="p-4 font-semibold text-white">{booking.id}</td>
                    <td className="p-4">
                      <p className="text-white font-medium">{booking.customerName}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{booking.phone}</p>
                    </td>
                    <td className="p-4 text-white">{booking.vehicleName}</td>
                    <td className="p-4">
                      <p className="text-xs text-white">{formatDate(booking.pickupDate)}</p>
                      <p className="text-[10px] text-gold mt-0.5">{booking.pickupTime}</p>
                    </td>
                    <td className="p-4 text-xs">{formatDate(booking.returnDate)}</td>
                    <td className="p-4">{getStatusBadge(booking.status)}</td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(booking.id, 'approved', booking.vehicleName)}
                              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-black rounded"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(booking.id, 'rejected', booking.vehicleName)}
                              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {booking.status === 'approved' && (
                          <button
                            onClick={() => handleAction(booking.id, 'completed', booking.vehicleName)}
                            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded"
                          >
                            Complete
                          </button>
                        )}
                        {booking.status === 'completed' && <span className="text-xs text-gray-600 font-medium italic">Checked out</span>}
                        {booking.status === 'rejected' && <span className="text-xs text-gray-600 font-medium italic">Closed</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <Modal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          title={`Reservation Summary: ${selectedBooking.id}`}
        >
          <div className="space-y-6 text-left">
            {/* Status section */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
              <div>
                <p className="text-[9px] uppercase text-gray-500 font-bold">Current Status</p>
                <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
              </div>
              <div>
                <p className="text-[9px] uppercase text-gray-500 font-bold text-right">Request Date</p>
                <p className="text-xs text-white font-semibold mt-1">
                  {selectedBooking.created_at ? formatDateTime(selectedBooking.created_at) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Customer information */}
            <div className="flex flex-col gap-3">
              <h4 className="font-heading text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-1 flex items-center gap-2">
                <FiInfo className="text-gold" />
                <span>Customer Information</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
                  <p className="text-gray-500 font-bold uppercase text-[8px]">Full Name</p>
                  <p className="text-sm font-semibold text-white">{selectedBooking.customerName}</p>
                </div>
                <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
                  <p className="text-gray-500 font-bold uppercase text-[8px] flex items-center gap-1"><FiPhone className="text-gold shrink-0" /> Phone</p>
                  <a href={`tel:${selectedBooking.phone}`} className="text-sm font-semibold text-white hover:text-gold">{selectedBooking.phone}</a>
                </div>
                <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5 sm:col-span-2">
                  <p className="text-gray-500 font-bold uppercase text-[8px] flex items-center gap-1"><FiMail className="text-gold shrink-0" /> Email Address</p>
                  <a href={`mailto:${selectedBooking.customerEmail}`} className="text-sm font-semibold text-white hover:text-gold">{selectedBooking.customerEmail}</a>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="flex flex-col gap-3">
              <h4 className="font-heading text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-1 flex items-center gap-2">
                <FiTruck className="text-gold" />
                <span>Trip Schedule</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
                  <p className="text-gray-500 font-bold uppercase text-[8px]">Selected Car</p>
                  <p className="text-sm font-semibold text-white">{selectedBooking.vehicleName}</p>
                </div>
                <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
                  <p className="text-gray-500 font-bold uppercase text-[8px] flex items-center gap-1"><FiClock className="text-gold shrink-0" /> Pickup Time</p>
                  <p className="text-sm font-semibold text-gold">{selectedBooking.pickupTime}</p>
                </div>
                <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
                  <p className="text-gray-500 font-bold uppercase text-[8px]">Pickup Date</p>
                  <p className="text-sm font-semibold text-white">{formatDate(selectedBooking.pickupDate)}</p>
                </div>
                <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
                  <p className="text-gray-500 font-bold uppercase text-[8px]">Return Date</p>
                  <p className="text-sm font-semibold text-white">{formatDate(selectedBooking.returnDate)}</p>
                </div>
                <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5 sm:col-span-2">
                  <p className="text-gray-500 font-bold uppercase text-[8px] flex items-center gap-1"><FiMapPin className="text-gold shrink-0" /> Delivery Address</p>
                  <p className="text-sm font-semibold text-white">{selectedBooking.location}</p>
                </div>
                {selectedBooking.notes && (
                  <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5 sm:col-span-2">
                    <p className="text-gray-500 font-bold uppercase text-[8px]">Customer Notes</p>
                    <p className="text-xs text-gray-300 italic">"{selectedBooking.notes}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="text-xs uppercase font-bold text-gray-400 hover:text-white px-4 py-2"
              >
                Close Summary
              </button>
              
              {selectedBooking.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleAction(selectedBooking.id, 'rejected', selectedBooking.vehicleName);
                    }}
                    className="text-xs uppercase font-bold tracking-wider py-2 px-4 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
                  >
                    Reject Drive
                  </button>
                  <button
                    onClick={() => {
                      handleAction(selectedBooking.id, 'approved', selectedBooking.vehicleName);
                    }}
                    className="text-xs uppercase font-bold tracking-wider py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-black rounded-lg transition-all"
                  >
                    Approve Request
                  </button>
                </>
              )}
              {selectedBooking.status === 'approved' && (
                <button
                  onClick={() => {
                    handleAction(selectedBooking.id, 'completed', selectedBooking.vehicleName);
                  }}
                  className="text-xs uppercase font-bold tracking-wider py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all"
                >
                  Complete Trip Check
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default Bookings;
