import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatters';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { TableSkeleton } from '../../components/Skeleton';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiSliders, FiCheck, FiXCircle } from 'react-icons/fi';

export const Vehicles = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, toggleVehicleAvailability } = useContext(DataContext);
  const { addToast } = useToast();

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [search, setSearch] = useState('');

  // CRUD Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' | 'edit'
  const [currentCar, setCurrentCar] = useState(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('SUV');
  const [transmission, setTransmission] = useState('Manual');
  const [fuel, setFuel] = useState('Petrol');
  const [seats, setSeats] = useState(5);
  const [price12, setPrice12] = useState('');
  const [price24, setPrice24] = useState('');
  const [extraKm, setExtraKm] = useState('');
  const [image, setImage] = useState('');

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const openAddModal = () => {
    setModalType('add');
    setCurrentCar(null);
    setName('');
    setCategory('SUV');
    setTransmission('Manual');
    setFuel('Petrol');
    setSeats(5);
    setPrice12('');
    setPrice24('');
    setExtraKm('');
    setImage('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (car) => {
    setModalType('edit');
    setCurrentCar(car);
    setName(car.name);
    setCategory(car.category);
    setTransmission(car.transmission);
    setFuel(car.fuel);
    setSeats(car.seats);
    setPrice12(car.price12.toString());
    setPrice24(car.price24.toString());
    setExtraKm(car.extraKm.toString());
    setImage(car.image || '');
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      // 1. Presence check
      if (!name || !price12 || !price24 || !extraKm) {
        throw new Error("Name, Pricing packages and extra KM rates are required.");
      }

      // 2. Format checks
      if (isNaN(seats) || parseInt(seats, 10) <= 0) {
        throw new Error("Seats count must be a positive integer.");
      }
      if (isNaN(price12) || parseFloat(price12) <= 0) {
        throw new Error("12 Hr Price must be a valid positive number.");
      }
      if (isNaN(price24) || parseFloat(price24) <= 0) {
        throw new Error("24 Hr Price must be a valid positive number.");
      }
      if (isNaN(extraKm) || parseFloat(extraKm) <= 0) {
        throw new Error("Extra KM rate must be a valid positive number.");
      }

      // 3. Process changes
      if (modalType === 'add') {
        await addVehicle({ name, category, transmission, fuel, seats, price12, price24, extraKm, image });
        addToast(`${name} added successfully to fleet!`, 'success');
      } else {
        await updateVehicle({
          id: currentCar.id,
          name,
          category,
          transmission,
          fuel,
          seats,
          price12,
          price24,
          extraKm,
          image,
          availability: currentCar.availability
        });
        addToast(`${name} updated successfully!`, 'success');
      }

      setModalOpen(false);
    } catch (err) {
      console.error("Vehicle CRUD action error", err);
      const safeMsg = err.message || "Failed to process request. Please try again.";
      setFormError(safeMsg);
      addToast(safeMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (carId, carName) => {
    if (!window.confirm(`Are you sure you want to remove ${carName} from the fleet database?`)) {
      return;
    }
    try {
      await deleteVehicle(carId);
      addToast(`${carName} removed from fleet database.`, 'success');
    } catch (err) {
      console.error("Failed to delete vehicle", err);
      addToast("Failed to remove vehicle from database.", 'error');
    }
  };

  const handleToggle = async (carId, carName) => {
    try {
      await toggleVehicleAvailability(carId);
      addToast(`Availability status toggled for ${carName}.`, 'success');
    } catch (err) {
      console.error("Failed to toggle status", err);
      addToast("Failed to toggle vehicle availability status.", 'error');
    }
  };

  const filteredCars = vehicles.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">Vehicle Management</h1>
          <p className="text-xs text-gray-500 mt-1">Configure models, add new fleet arrivals, and toggle maintenance status.</p>
        </div>

        <Button variant="primary" onClick={openAddModal} className="text-xs font-bold uppercase tracking-wider shrink-0">
          <FiPlus className="w-4 h-4 shrink-0" />
          <span>Add New Vehicle</span>
        </Button>
      </div>

      {/* Filter and Search Panel */}
      <Card hoverEffect={false} className="p-4 md:p-6 border border-white/5 flex items-center gap-4">
        <div className="relative w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fleet by car name or category..."
            className="input-field pl-11 text-sm bg-black/20"
          />
        </div>
      </Card>

      {/* Fleet table */}
      {isInitialLoad ? (
        <TableSkeleton rows={5} cols={7} />
      ) : filteredCars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white/5 border border-white/5 rounded-2xl gap-2 text-center">
          <FiSliders className="w-12 h-12 text-gold opacity-30 animate-pulse" />
          <h3 className="font-heading text-lg font-bold text-white mt-2">No Vehicles Found</h3>
          <p className="text-xs max-w-xs leading-relaxed">Try clearing search text or adding a new car entry above.</p>
        </div>
      ) : (
        <Card hoverEffect={false} className="overflow-hidden border border-white/5">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-gray-300">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-white/10 bg-charcoal-elevated/40">
                  <th className="p-4">ID</th>
                  <th className="p-4">Car Name</th>
                  <th className="p-4">Specs</th>
                  <th className="p-4">12 Hr Rate</th>
                  <th className="p-4">24 Hr Rate</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCars.map((car) => (
                  <tr key={car.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">{car.id}</td>
                    <td className="p-4">
                      <p className="text-white font-medium">{car.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{car.category}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <span>{car.transmission}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span>{car.fuel}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span>{car.seats} Seats</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-white">{formatCurrency(car.price12)}</td>
                    <td className="p-4 font-medium text-gold">{formatCurrency(car.price24)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggle(car.id, car.name)}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border transition-all ${
                          car.availability === 'available'
                            ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900'
                            : 'bg-red-950/80 border-red-500/30 text-red-400 hover:bg-red-900'
                        }`}
                        title="Click to toggle status"
                      >
                        {car.availability}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-gray-400">
                        <button
                          onClick={() => openEditModal(car)}
                          className="hover:text-gold transition-colors p-1"
                          title="Edit vehicle details"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(car.id, car.name)}
                          className="hover:text-red-400 transition-colors p-1"
                          title="Delete vehicle entry"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* CRUD Modal dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalType === 'add' ? 'Add New Vehicle Entry' : `Edit Vehicle Details: ${currentCar?.name}`}
      >
        {formError && (
          <div className="mb-4 p-3 text-xs font-medium text-red-200 border border-red-500/20 bg-red-950/30 rounded-xl">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Vehicle name */}
          <div className="flex flex-col gap-1 text-left">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Vehicle Model Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Innova Crysta"
              className="input-field text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Category dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field text-sm bg-black/20 py-2.5"
              >
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Compact SUV">Compact SUV</option>
                <option value="MUV">MUV</option>
              </select>
            </div>

            {/* Transmission dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Transmission *</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="input-field text-sm bg-black/20 py-2.5"
              >
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            {/* Fuel dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fuel Type *</label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="input-field text-sm bg-black/20 py-2.5"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
            {/* Seats */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Seats count *</label>
              <input
                type="number"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className="input-field text-sm"
                required
              />
            </div>

            {/* 12 Hr Price */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">12 Hr Rate *</label>
              <input
                type="number"
                value={price12}
                onChange={(e) => setPrice12(e.target.value)}
                placeholder="₹"
                className="input-field text-sm"
                required
              />
            </div>

            {/* 24 Hr Price */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">24 Hr Rate *</label>
              <input
                type="number"
                value={price24}
                onChange={(e) => setPrice24(e.target.value)}
                placeholder="₹"
                className="input-field text-sm"
                required
              />
            </div>

            {/* Extra KM price */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Extra KM Rate *</label>
              <input
                type="number"
                value={extraKm}
                onChange={(e) => setExtraKm(e.target.value)}
                placeholder="₹"
                className="input-field text-sm"
                required
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="flex flex-col gap-1 text-left">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Custom Stock Image URL (Optional)</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/... (Uses default placeholder if blank)"
              className="input-field text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
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
              <span>{modalType === 'add' ? 'Add Vehicle' : 'Save Details'}</span>
              <FiCheck />
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Vehicles;
