import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { useToast } from '../../hooks/useToast';
import { formatDate, formatDateTime, formatCurrency } from '../../utils/formatters';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { TableSkeleton } from '../../components/Skeleton';
import { CustomSelect } from '../../components/CustomSelect';
import { FiSearch, FiSliders, FiClock, FiCheckCircle, FiXCircle, FiTruck, FiInfo, FiMapPin, FiMail, FiPhone, FiCreditCard, FiFileText, FiPlus } from 'react-icons/fi';

export const Bookings = () => {
  const { bookings, vehicles, updateBookingStatus, addBooking, settings } = useContext(DataContext);
  const { addToast } = useToast();

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Search & Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal Details state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Walk-in booking form state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [walkInVehicleId, setWalkInVehicleId] = useState('');
  const [walkInCustomerName, setWalkInCustomerName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInEmail, setWalkInEmail] = useState('');
  const [walkInDrivingLicense, setWalkInDrivingLicense] = useState('');
  const [walkInPickupDate, setWalkInPickupDate] = useState('');
  const [walkInPickupTime, setWalkInPickupTime] = useState('09:00');
  const [walkInReturnDate, setWalkInReturnDate] = useState('');
  const [walkInLocation, setWalkInLocation] = useState('');
  const [walkInStatus, setWalkInStatus] = useState('approved');
  const [walkInPaymentMethod, setWalkInPaymentMethod] = useState('cash');
  const [walkInPaymentStatus, setWalkInPaymentStatus] = useState('paid');
  const [walkInNotes, setWalkInNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleOpenCreateModal = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setWalkInPickupDate(tomorrow.toISOString().split('T')[0]);

    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    setWalkInReturnDate(dayAfter.toISOString().split('T')[0]);

    setWalkInPickupTime('09:00');
    setWalkInLocation(settings?.location || 'Al-Mas Cars Head Office');
    
    const firstAvailable = vehicles.find(v => v.availability === 'available');
    setWalkInVehicleId(firstAvailable ? firstAvailable.id : (vehicles[0]?.id || ''));

    setWalkInCustomerName('');
    setWalkInPhone('');
    setWalkInEmail('');
    setWalkInDrivingLicense('');
    setWalkInStatus('approved');
    setWalkInPaymentMethod('cash');
    setWalkInPaymentStatus('paid');
    setWalkInNotes('');
    setFormError('');
    
    setCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      if (!walkInCustomerName || !walkInPhone || !walkInPickupDate || !walkInReturnDate || !walkInPickupTime || !walkInVehicleId || !walkInLocation) {
        throw new Error("Please fill in all required fields.");
      }

      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(walkInPhone)) {
        throw new Error("Phone number must be exactly 10 digits.");
      }

      if (walkInEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(walkInEmail)) {
          throw new Error("Please enter a valid email address.");
        }
      }

      if (walkInReturnDate < walkInPickupDate) {
        throw new Error("Return date must be on or after the pickup date.");
      }

      await addBooking({
        customerName: walkInCustomerName,
        customerEmail: walkInEmail,
        phone: walkInPhone,
        pickupDate: walkInPickupDate,
        returnDate: walkInReturnDate,
        pickupTime: walkInPickupTime,
        vehicleId: walkInVehicleId,
        location: walkInLocation,
        notes: walkInNotes,
        status: walkInStatus,
        bookingSource: 'walk-in',
        paymentMethod: walkInPaymentMethod,
        paymentStatus: walkInPaymentStatus,
        drivingLicense: walkInDrivingLicense
      });

      addToast("Walk-in booking created successfully!", "success");
      setCreateModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError(err.message || "An error occurred while creating booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-stretch md:self-auto">
          <Button
            variant="primary"
            onClick={handleOpenCreateModal}
            className="text-xs font-bold uppercase tracking-wider py-2 px-4 rounded-xl flex items-center gap-1.5 justify-center"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Walk-in Booking</span>
          </Button>
          <span className="text-xs bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-gray-400 font-medium text-center">
            Showing <strong className="text-gold">{filteredBookings.length}</strong> of {bookings.length} reservations
          </span>
        </div>
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
                <p className="text-[9px] uppercase text-gray-500 font-bold">Current Status / Type</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {getStatusBadge(selectedBooking.status)}
                  {selectedBooking.bookingSource === 'walk-in' ? (
                    <span className="flex items-center gap-1 w-fit text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/30 text-amber-400">
                      Walk-In (Direct)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 w-fit text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/30 text-indigo-400">
                      Online Booking
                    </span>
                  )}
                </div>
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
                  <a href={`mailto:${selectedBooking.customerEmail}`} className="text-sm font-semibold text-white hover:text-gold">{selectedBooking.customerEmail || 'N/A'}</a>
                </div>
                {selectedBooking.drivingLicense && (
                  <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5 sm:col-span-2">
                    <p className="text-gray-500 font-bold uppercase text-[8px] flex items-center gap-1"><FiFileText className="text-gold shrink-0" /> Driving License</p>
                    <p className="text-sm font-semibold text-white uppercase">{selectedBooking.drivingLicense}</p>
                  </div>
                )}
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

            {/* Billing & Source Details */}
            {(selectedBooking.bookingSource === 'walk-in' || selectedBooking.paymentMethod) && (
              <div className="flex flex-col gap-3">
                <h4 className="font-heading text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-1 flex items-center gap-2">
                  <FiCreditCard className="text-gold" />
                  <span>Billing & Source Details</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
                    <p className="text-gray-500 font-bold uppercase text-[8px]">Booking Source</p>
                    <p className="text-sm font-semibold text-white uppercase">{selectedBooking.bookingSource || 'online'}</p>
                  </div>
                  <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
                    <p className="text-gray-500 font-bold uppercase text-[8px]">Payment Method</p>
                    <p className="text-sm font-semibold text-white uppercase">{selectedBooking.paymentMethod || 'none'}</p>
                  </div>
                  <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5 sm:col-span-2">
                    <p className="text-gray-500 font-bold uppercase text-[8px]">Payment Status</p>
                    <span className={`inline-block mt-1.5 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded border ${
                      selectedBooking.paymentStatus === 'paid' 
                        ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400' 
                        : selectedBooking.paymentStatus === 'advance'
                        ? 'bg-blue-950/80 border-blue-500/30 text-blue-400'
                        : 'bg-yellow-950/80 border-yellow-500/30 text-yellow-400'
                    }`}>
                      {selectedBooking.paymentStatus || 'pending'}
                    </span>
                  </div>
                </div>
              </div>
            )}

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

      {/* Walk-in Booking Creation Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Walk-In Booking"
      >
        {formError && (
          <div className="mb-4 p-3 text-xs font-medium text-red-200 border border-red-500/20 bg-red-950/30 rounded-xl">
            {formError}
          </div>
        )}

        <form onSubmit={handleCreateSubmit} className="space-y-4" noValidate>
          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Customer Name *</label>
              <input
                type="text"
                value={walkInCustomerName}
                onChange={(e) => setWalkInCustomerName(e.target.value)}
                className="input-field text-sm bg-black/20"
                required
              />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone Number *</label>
              <input
                type="tel"
                value={walkInPhone}
                onChange={(e) => setWalkInPhone(e.target.value)}
                className="input-field text-sm bg-black/20"
                placeholder="10 digit number"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Address (Optional)</label>
              <input
                type="email"
                value={walkInEmail}
                onChange={(e) => setWalkInEmail(e.target.value)}
                className="input-field text-sm bg-black/20"
              />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Driving License (Optional)</label>
              <input
                type="text"
                value={walkInDrivingLicense}
                onChange={(e) => setWalkInDrivingLicense(e.target.value)}
                className="input-field text-sm bg-black/20 uppercase"
                placeholder="e.g. TN-01-20230001234"
              />
            </div>
          </div>

          {/* Rental Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Select Vehicle *</label>
              <CustomSelect
                value={walkInVehicleId}
                onChange={(e) => setWalkInVehicleId(e.target.value)}
                options={vehicles.map(v => ({
                  value: v.id,
                  label: `${v.name} (${v.category}) - ${v.availability === 'available' ? 'Available' : 'Unavailable'}`
                }))}
                className="w-full text-sm bg-black/20"
              />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pickup Time *</label>
              <input
                type="time"
                value={walkInPickupTime}
                onChange={(e) => setWalkInPickupTime(e.target.value)}
                className="input-field text-sm bg-black/20"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pickup Date *</label>
              <input
                type="date"
                value={walkInPickupDate}
                onChange={(e) => setWalkInPickupDate(e.target.value)}
                className="input-field text-sm bg-black/20"
                required
              />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Return Date *</label>
              <input
                type="date"
                value={walkInReturnDate}
                onChange={(e) => setWalkInReturnDate(e.target.value)}
                className="input-field text-sm bg-black/20"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Delivery/Pickup Location *</label>
            <input
              type="text"
              value={walkInLocation}
              onChange={(e) => setWalkInLocation(e.target.value)}
              className="input-field text-sm bg-black/20"
              required
            />
          </div>

          {/* Admin & Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Booking Status</label>
              <CustomSelect
                value={walkInStatus}
                onChange={(e) => setWalkInStatus(e.target.value)}
                options={[
                  { value: 'approved', label: 'Approved' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'completed', label: 'Completed' }
                ]}
                className="w-full text-sm bg-black/20"
              />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Payment Method</label>
              <CustomSelect
                value={walkInPaymentMethod}
                onChange={(e) => setWalkInPaymentMethod(e.target.value)}
                options={[
                  { value: 'cash', label: 'Cash' },
                  { value: 'card', label: 'Card' },
                  { value: 'upi', label: 'UPI / GPay' },
                  { value: 'bank_transfer', label: 'Bank Transfer' }
                ]}
                className="w-full text-sm bg-black/20"
              />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Payment Status</label>
              <CustomSelect
                value={walkInPaymentStatus}
                onChange={(e) => setWalkInPaymentStatus(e.target.value)}
                options={[
                  { value: 'paid', label: 'Paid' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'advance', label: 'Advance Paid' }
                ]}
                className="w-full text-sm bg-black/20"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1 text-left">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Staff Notes / Special Remarks</label>
            <textarea
              value={walkInNotes}
              onChange={(e) => setWalkInNotes(e.target.value)}
              placeholder="e.g. Received cash advance of ₹1000. Customer requested baby seat."
              rows="2"
              className="input-field text-sm bg-black/20"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="text-xs uppercase font-bold text-gray-400 hover:text-white px-4 py-2"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              className="text-xs uppercase font-bold tracking-wider py-2.5 px-6"
              isLoading={isSubmitting}
            >
              <span>Create Booking</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Bookings;
