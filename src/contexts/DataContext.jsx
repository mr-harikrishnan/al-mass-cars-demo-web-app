import React, { createContext, useState, useEffect } from 'react';
import { getFromStorage, setToStorage, KEYS, generateBookingId, generateVehicleId } from '../utils/storage';
import { initialVehicles } from '../data/vehicles';
import { staticContent } from '../data/content';

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [bookings, setBookings] = useState([]);
  const [availability, setAvailability] = useState({});
  const [settings, setSettings] = useState({
    phone: staticContent.about.phone,
    whatsapp: staticContent.about.whatsapp,
    location: staticContent.about.location
  });

  useEffect(() => {
    setBookings(getFromStorage(KEYS.BOOKINGS, []));
    setAvailability(getFromStorage(KEYS.AVAILABILITY, {}));
  }, []);

  const isVehicleAvailable = (vehicleId, pickupDate, returnDate, excludeBookingId = null) => {
    const targetVehicle = vehicles.find(v => v.id === vehicleId);
    if (!targetVehicle) {
      return false;
    }

    if (targetVehicle.availability === 'maintenance') {
      if (targetVehicle.maintenanceStart && targetVehicle.maintenanceEnd) {
        const overlapsMaintenance = (pickupDate <= targetVehicle.maintenanceEnd) && (returnDate >= targetVehicle.maintenanceStart);
        if (overlapsMaintenance) {
          return false;
        }
      } else {
        return false;
      }
    }

    const hasOverlap = bookings.some(b => {
      if (excludeBookingId && b.id === excludeBookingId) return false;
      if (b.status !== 'approved' && b.status !== 'completed') return false;
      if (b.vehicleId !== vehicleId) return false;
      return (pickupDate <= b.returnDate) && (returnDate >= b.pickupDate);
    });

    if (hasOverlap) {
      return false;
    }

    const overrides = availability[vehicleId];
    if (overrides) {
      const start = new Date(pickupDate + 'T00:00:00');
      const end = new Date(returnDate + 'T00:00:00');
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        if (overrides[dateStr] === 'booked' || overrides[dateStr] === 'maintenance') {
          return false;
        }
      }
    }

    return true;
  };

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

    if ((status === 'approved' || status === 'completed') && !isVehicleAvailable(vehicleId, pickupDate, returnDate)) {
      throw new Error("This vehicle is already booked or unavailable for the selected dates.");
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

    if (status === 'approved' || status === 'completed') {
      const targetBooking = bookings.find(b => b.id === bookingId);
      if (targetBooking) {
        const isAvail = isVehicleAvailable(
          targetBooking.vehicleId,
          targetBooking.pickupDate,
          targetBooking.returnDate,
          bookingId
        );
        if (!isAvail) {
          throw new Error("This vehicle is already booked or unavailable for these dates.");
        }
      }
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
      id: generateVehicleId(vehicles),
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
  };

  const deleteVehicle = async (id) => {
    if (!id) {
      throw new Error("Vehicle ID is required to delete");
    }

    const updatedVehicles = vehicles.filter(v => v.id !== id);
    setVehicles(updatedVehicles);
  };

  const toggleVehicleAvailability = async (id, status, maintenanceStart = null, maintenanceEnd = null) => {
    if (!id) {
      throw new Error("Vehicle ID is required to update availability");
    }

    const updatedVehicles = vehicles.map(v => {
      if (v.id === id) {
        if (status === 'maintenance') {
          return { 
            ...v, 
            availability: 'maintenance',
            maintenanceStart,
            maintenanceEnd
          };
        } else {
          return { 
            ...v, 
            availability: 'available',
            maintenanceStart: null,
            maintenanceEnd: null
          };
        }
      }
      return v;
    });

    setVehicles(updatedVehicles);
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
      updateSettings,
      isVehicleAvailable
    }}>
      {children}
    </DataContext.Provider>
  );
};
