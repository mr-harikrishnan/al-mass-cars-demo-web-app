import React, { createContext, useState, useEffect } from 'react';
import { getFromStorage, setToStorage, KEYS, generateBookingId, generateVehicleId } from '../utils/storage';

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState({});
  const [settings, setSettings] = useState({ phone: '', whatsapp: '', location: '' });

  useEffect(() => {
    setVehicles(getFromStorage(KEYS.VEHICLES, []));
    setBookings(getFromStorage(KEYS.BOOKINGS, []));
    setAvailability(getFromStorage(KEYS.AVAILABILITY, {}));
    setSettings(getFromStorage(KEYS.SETTINGS, { phone: '', whatsapp: '', location: '' }));
  }, []);

  const addBooking = async (bookingData) => {
    const {
      customerName,
      customerEmail = '',
      phone,
      pickupDate,
      returnDate,
      pickupTime,
      vehicleId,
      location,
      notes,
      status = 'pending',
      bookingSource = 'online',
      paymentMethod = 'none',
      paymentStatus = 'pending',
      drivingLicense = ''
    } = bookingData;
    
    if (!customerName || !phone || !pickupDate || !returnDate || !pickupTime || !vehicleId || !location) {
      throw new Error("Missing required fields for booking request");
    }

    const targetVehicle = vehicles.find(v => v.id === vehicleId);
    if (!targetVehicle) {
      throw new Error("Invalid vehicle selected");
    }

    const id = generateBookingId();
    const newBooking = {
      id,
      customerName,
      customerEmail,
      phone,
      pickupDate,
      returnDate,
      pickupTime,
      vehicleId,
      vehicleName: targetVehicle.name,
      vehicleSlug: targetVehicle.slug,
      vehicleCategory: targetVehicle.category,
      vehicleImage: targetVehicle.slug,
      location,
      notes: notes || "",
      status,
      bookingSource,
      paymentMethod,
      paymentStatus,
      drivingLicense,
      created_at: new Date().toISOString()
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    setToStorage(KEYS.BOOKINGS, updatedBookings);
    return newBooking;
  };

  const updateBookingStatus = async (bookingId, status) => {
    if (!bookingId || !status) {
      throw new Error("Booking ID and status are required");
    }

    const updatedBookings = bookings.map(b => {
      if (b.id === bookingId) {
        return { ...b, status };
      }
      return b;
    });

    setBookings(updatedBookings);
    setToStorage(KEYS.BOOKINGS, updatedBookings);
  };

  const addVehicle = async (vehicleData) => {
    const { name, category, transmission, fuel, seats, price12, price24, extraKm, image } = vehicleData;
    
    if (!name || !category || !transmission || !fuel || !seats || !price12 || !price24 || !extraKm) {
      throw new Error("All fields are required to add a vehicle");
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newVehicle = {
      id: generateVehicleId(),
      slug,
      name,
      category,
      transmission,
      fuel,
      seats: parseInt(seats, 10),
      price12: parseFloat(price12),
      price24: parseFloat(price24),
      extraKm: parseFloat(extraKm),
      availability: "available",
      image: image || ""
    };

    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    setToStorage(KEYS.VEHICLES, updatedVehicles);
    return newVehicle;
  };

  const updateVehicle = async (updatedVehicle) => {
    if (!updatedVehicle.id) {
      throw new Error("Vehicle ID is required to update");
    }

    const slug = updatedVehicle.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const updatedVehicles = vehicles.map(v => {
      if (v.id === updatedVehicle.id) {
        return {
          ...v,
          ...updatedVehicle,
          slug,
          seats: parseInt(updatedVehicle.seats, 10),
          price12: parseFloat(updatedVehicle.price12),
          price24: parseFloat(updatedVehicle.price24),
          extraKm: parseFloat(updatedVehicle.extraKm),
        };
      }
      return v;
    });

    setVehicles(updatedVehicles);
    setToStorage(KEYS.VEHICLES, updatedVehicles);
  };

  const deleteVehicle = async (id) => {
    if (!id) {
      throw new Error("Vehicle ID is required to delete");
    }

    const updatedVehicles = vehicles.filter(v => v.id !== id);
    setVehicles(updatedVehicles);
    setToStorage(KEYS.VEHICLES, updatedVehicles);
  };

  const toggleVehicleAvailability = async (id) => {
    if (!id) {
      throw new Error("Vehicle ID is required to toggle availability");
    }

    const updatedVehicles = vehicles.map(v => {
      if (v.id === id) {
        const nextStatus = v.availability === 'available' ? 'maintenance' : 'available';
        return { ...v, availability: nextStatus };
      }
      return v;
    });

    setVehicles(updatedVehicles);
    setToStorage(KEYS.VEHICLES, updatedVehicles);
  };

  const updatePricing = async (vehicleId, price12, price24, extraKm) => {
    if (!vehicleId) {
      throw new Error("Vehicle ID is required to update pricing");
    }

    const updatedVehicles = vehicles.map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          price12: parseFloat(price12),
          price24: parseFloat(price24),
          extraKm: parseFloat(extraKm)
        };
      }
      return v;
    });

    setVehicles(updatedVehicles);
    setToStorage(KEYS.VEHICLES, updatedVehicles);
  };

  const toggleDayAvailability = async (vehicleId, dateStr) => {
    if (!vehicleId || !dateStr) return;
    
    const newOverrides = { ...availability };
    if (!newOverrides[vehicleId]) {
      newOverrides[vehicleId] = {};
    }

    const currentStatus = newOverrides[vehicleId][dateStr] || 'available';
    let nextStatus = 'available';
    
    if (currentStatus === 'available') {
      nextStatus = 'booked';
    } else if (currentStatus === 'booked') {
      nextStatus = 'maintenance';
    } else {
      nextStatus = 'available';
    }

    newOverrides[vehicleId][dateStr] = nextStatus;
    
    if (nextStatus === 'available') {
      delete newOverrides[vehicleId][dateStr];
      if (Object.keys(newOverrides[vehicleId]).length === 0) {
        delete newOverrides[vehicleId];
      }
    }

    setAvailability(newOverrides);
    setToStorage(KEYS.AVAILABILITY, newOverrides);
  };

  const updateSettings = async (newSettings) => {
    const { phone, whatsapp, location } = newSettings;
    if (!phone || !whatsapp || !location) {
      throw new Error("Phone, WhatsApp, and Location are required settings");
    }

    setSettings(newSettings);
    setToStorage(KEYS.SETTINGS, newSettings);
  };

  return (
    <DataContext.Provider value={{
      vehicles,
      bookings,
      availability,
      settings,
      addBooking,
      updateBookingStatus,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      toggleVehicleAvailability,
      updatePricing,
      toggleDayAvailability,
      updateSettings
    }}>
      {children}
    </DataContext.Provider>
  );
};
