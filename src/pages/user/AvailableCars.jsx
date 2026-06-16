import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { getVehicleImage } from '../../utils/imageHelper';
import { formatCurrency } from '../../utils/formatters';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { CardSkeleton } from '../../components/Skeleton';
import { CustomSelect } from '../../components/CustomSelect';
import { FiSearch, FiSliders, FiUsers, FiMapPin, FiCalendar, FiClock, FiCheck } from 'react-icons/fi';

export const AvailableCars = () => {
  const { vehicles, addBooking } = useContext(DataContext);
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  // Loading States
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trigger initial skeleton load delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Pre-fill form details when modal opens or user session changes
  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name || '');
      setCustomerEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser, bookingModalOpen]);

  // Open booking form
  const handleOpenBooking = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormError('');
    setNotes('');
    
    // Set default pickup date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    setPickupDate(tomorrowStr);
    
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    const dayAfterStr = dayAfter.toISOString().split('T')[0];
    setReturnDate(dayAfterStr);
    
    setPickupTime('09:00');
    setLocation('');
    setBookingModalOpen(true);
  };

  // Handle Booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      // 1. Presence check
      if (!customerName || !customerEmail || !phone || !pickupDate || !returnDate || !pickupTime || !location) {
        throw new Error("Please fill in all required fields.");
      }

      // 2. Format checks
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        throw new Error("Please enter a valid email address.");
      }

      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        throw new Error("Phone number must be exactly 10 digits.");
      }

      // 3. Business rule checks
      const today = new Date().toISOString().split('T')[0];
      if (pickupDate < today) {
        throw new Error("Pickup date cannot be in the past.");
      }
      if (returnDate < pickupDate) {
        throw new Error("Return date must be on or after the pickup date.");
      }

      // Submit booking
      await addBooking({
        customerName,
        customerEmail,
        phone,
        pickupDate,
        returnDate,
        pickupTime,
        vehicleId: selectedVehicle.id,
        location,
        notes
      });

      addToast(`Booking request for ${selectedVehicle.name} submitted successfully!`, 'success');
      setBookingModalOpen(false);
    } catch (err) {
      console.error("Booking request submission error:", err);
      const safeMsg = err.message || "Unable to submit booking. Verify the entered information and try again.";
      setFormError(safeMsg);
      addToast(safeMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get distinct categories and transmissions for dropdowns
  const categories = ['All', ...new Set(vehicles.map(v => v.category))];
  const transmissions = ['All', ...new Set(vehicles.map(v => v.transmission))];

  const categoryOptions = [
    { value: 'All', label: 'All Categories' },
    ...categories.filter(c => c !== 'All').map(cat => ({ value: cat, label: cat }))
  ];

  const transmissionOptions = [
    { value: 'All', label: 'All Transmissions' },
    ...transmissions.filter(t => t !== 'All').map(trans => ({ value: trans, label: trans }))
  ];

  // Filter vehicles list
  const filteredVehicles = vehicles.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase()) || 
                          car.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || car.category === selectedCategory;
    const matchesTransmission = selectedTransmission === 'All' || car.transmission === selectedTransmission;
    return matchesSearch && matchesCategory && matchesTransmission;
  });

  return (
    <div className="flex flex-col gap-8 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">Available Vehicles</h1>
          <p className="text-xs text-gray-500 mt-1">Browse and book from our elite fleet of self-drive vehicles.</p>
        </div>

        {/* Dynamic Counter */}
        <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-gray-400 self-start md:self-auto font-medium">
          Showing <strong className="text-gold">{filteredVehicles.length}</strong> of {vehicles.length} cars
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
            placeholder="Search by vehicle name..."
            className="input-field pl-11 text-sm bg-black/20"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <FiSliders className="text-gold w-4 h-4 shrink-0 hidden sm:block" />
          <CustomSelect
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categoryOptions}
            className="w-full md:w-48"
          />
        </div>

        {/* Transmission Filter */}
        <div className="w-full md:w-auto shrink-0">
          <CustomSelect
            value={selectedTransmission}
            onChange={(e) => setSelectedTransmission(e.target.value)}
            options={transmissionOptions}
            className="w-full md:w-44"
          />
        </div>
      </Card>

      {/* Vehicles Cards Grid */}
      {isInitialLoad ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white/5 border border-white/5 rounded-2xl gap-2 text-center">
          <FiSearch className="w-12 h-12 text-gold opacity-30 animate-pulse" />
          <h3 className="font-heading text-lg font-bold text-white mt-2">No Vehicles Found</h3>
          <p className="text-xs max-w-xs leading-relaxed">Adjust your search query or filter options to explore other categories in our fleet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((car) => {
            const imgUrl = getVehicleImage(car.slug);
            const isAvailable = car.availability === 'available';

            return (
              <Card
                key={car.id}
                hoverEffect={true}
                className="p-5 flex flex-col justify-between h-full border border-white/5 bg-white/5 group"
              >
                <div>
                  {/* Image wrapper */}
                  <div className="w-full h-44 rounded-xl overflow-hidden mb-4 bg-charcoal-base relative border border-white/10 flex items-center justify-center">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-charcoal-elevated to-charcoal-base w-full h-full text-gold">
                        <FiSliders className="w-8 h-8 opacity-40" />
                        <span className="text-xs uppercase tracking-widest opacity-60 font-semibold">{car.name}</span>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <span className={`absolute top-3 right-3 text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      isAvailable 
                        ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400' 
                        : 'bg-red-950/80 border-red-500/30 text-red-400'
                    }`}>
                      {car.availability}
                    </span>
                  </div>

                  {/* Name and Categories */}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-heading text-lg font-bold text-white">{car.name}</h3>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                      {car.category}
                    </span>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-6 flex-wrap">
                    <span>{car.transmission}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <span>{car.fuel}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <span className="flex items-center gap-1"><FiUsers /> {car.seats} Seats</span>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div>
                  <div className="border-t border-white/5 pt-4 mb-4 flex justify-between items-center text-xs">
                    <div>
                      <p className="text-[9px] uppercase text-gray-600 font-semibold">12 Hours</p>
                      <p className="text-base font-bold text-white font-heading mt-0.5">{formatCurrency(car.price12)}</p>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div>
                      <p className="text-[9px] uppercase text-gray-600 font-semibold">24 Hours</p>
                      <p className="text-base font-bold text-gold font-heading mt-0.5">{formatCurrency(car.price24)}</p>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div>
                      <p className="text-[9px] uppercase text-gray-600 font-semibold">Extra KM</p>
                      <p className="text-sm font-semibold text-gray-400 mt-1">{formatCurrency(car.extraKm)}/KM</p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => handleOpenBooking(car)}
                    className="w-full text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl"
                    disabled={!isAvailable}
                  >
                    {isAvailable ? 'Book Drive Now' : 'Under Maintenance'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Booking Form Modal */}
      {selectedVehicle && (
        <Modal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          title={`Booking Request: ${selectedVehicle.name}`}
        >
          {formError && (
            <div className="mb-4 p-3 text-xs font-medium text-red-200 border border-red-500/20 bg-red-950/30 rounded-xl">
              {formError}
            </div>
          )}

          <form onSubmit={handleBookingSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Name */}
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Customer Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="input-field text-sm"
                  required
                />
              </div>

              {/* Customer Email */}
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Customer Email *</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="input-field text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="flex flex-col gap-1 text-left">
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field text-sm"
                  placeholder="10 digit number"
                  required
                />
              </div>

              {/* Pickup Time */}
              <div className="flex flex-col gap-1 text-left">
                <div className="flex items-center gap-1.5">
                  <FiClock className="text-gold w-3.5 h-3.5" />
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pickup Time *</label>
                </div>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="input-field text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Date */}
              <div className="flex flex-col gap-1 text-left">
                <div className="flex items-center gap-1.5">
                  <FiCalendar className="text-gold w-3.5 h-3.5" />
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pickup Date *</label>
                </div>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="input-field text-sm"
                  required
                />
              </div>

              {/* Return Date */}
              <div className="flex flex-col gap-1 text-left">
                <div className="flex items-center gap-1.5">
                  <FiCalendar className="text-gold w-3.5 h-3.5" />
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Return Date *</label>
                </div>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="input-field text-sm"
                  required
                />
              </div>
            </div>

            {/* Selected Vehicle details (Read-only) */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between text-xs">
              <div className="text-left">
                <p className="text-gray-500 font-bold uppercase text-[9px]">Selected Vehicle</p>
                <p className="text-sm font-semibold text-white mt-0.5">{selectedVehicle.name}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 font-bold uppercase text-[9px]">Rate plan (24 Hrs)</p>
                <p className="text-sm font-bold text-gold mt-0.5">{formatCurrency(selectedVehicle.price24)}</p>
              </div>
            </div>

            {/* Delivery Location */}
            <div className="flex flex-col gap-1 text-left">
              <div className="flex items-center gap-1.5">
                <FiMapPin className="text-gold w-3.5 h-3.5" />
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Delivery Location *</label>
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Mannady Metro station, door address, etc."
                className="input-field text-sm"
                required
              />
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1 text-left">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Special Requests / Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special remarks or delivery distance requests..."
                rows="2"
                className="input-field text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
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
                <span>Submit Request</span>
                <FiCheck />
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
export default AvailableCars;
