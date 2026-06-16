import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../utils/formatters';
import { Card } from '../../components/Card';
import { TableSkeleton } from '../../components/Skeleton';
import { FiEdit2, FiCheck, FiX, FiSearch } from 'react-icons/fi';

export const Pricing = () => {
  const { vehicles, updatePricing } = useContext(DataContext);
  const { addToast } = useToast();

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [search, setSearch] = useState('');
  
  // Tracking which rows are in edit mode
  const [editingRows, setEditingRows] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleEditClick = (car) => {
    setEditingRows(prev => ({
      ...prev,
      [car.id]: {
        price12: car.price12,
        price24: car.price24,
        extraKm: car.extraKm
      }
    }));
  };

  const handleInputChange = (carId, field, val) => {
    setEditingRows(prev => ({
      ...prev,
      [carId]: {
        ...prev[carId],
        [field]: val
      }
    }));
  };

  const handleSaveClick = async (carId, carName) => {
    const rowState = editingRows[carId];
    
    try {
      // 1. Presence check
      if (rowState.price12 === '' || rowState.price24 === '' || rowState.extraKm === '') {
        throw new Error("All pricing values are required.");
      }

      // 2. Format checks
      const p12 = parseFloat(rowState.price12);
      const p24 = parseFloat(rowState.price24);
      const ekm = parseFloat(rowState.extraKm);

      if (isNaN(p12) || p12 <= 0 || isNaN(p24) || p24 <= 0 || isNaN(ekm) || ekm <= 0) {
        throw new Error("Rates must be valid positive numbers.");
      }

      // 3. Save updates
      await updatePricing(carId, p12, p24, ekm);
      addToast(`Pricing updated for ${carName}!`, 'success');

      // Clear row edit state
      setEditingRows(prev => {
        const copy = { ...prev };
        delete copy[carId];
        return copy;
      });
    } catch (err) {
      console.error("Failed to save pricing", err);
      addToast(err.message || "Failed to update pricing.", 'error');
    }
  };

  const handleCancelClick = (carId) => {
    setEditingRows(prev => {
      const copy = { ...prev };
      delete copy[carId];
      return copy;
    });
  };

  const filteredCars = vehicles.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">Pricing Management</h1>
          <p className="text-xs text-gray-500 mt-1">Directly adjust package rates, hourly rentals, and mileage limits.</p>
        </div>

        <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-gray-400 self-start sm:self-auto font-medium">
          Total Fleet: <strong className="text-gold">{vehicles.length}</strong> vehicles
        </span>
      </div>

      {/* Search Bar */}
      <Card hoverEffect={false} className="p-4 md:p-6 border border-white/5">
        <div className="relative w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pricing list by car name..."
            className="input-field pl-11 text-sm bg-black/20"
          />
        </div>
      </Card>

      {/* Pricing Sheet Table */}
      {isInitialLoad ? (
        <TableSkeleton rows={5} cols={5} />
      ) : filteredCars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white/5 border border-white/5 rounded-2xl gap-2 text-center">
          <FiSearch className="w-12 h-12 text-gold opacity-30" />
          <h3 className="font-heading text-lg font-bold text-white mt-2">No Vehicles Found</h3>
          <p className="text-xs">Adjust your search filter query.</p>
        </div>
      ) : (
        <Card hoverEffect={false} className="overflow-hidden border border-white/5">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-gray-300">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-white/10 bg-charcoal-elevated/40">
                  <th className="p-4">Car ID</th>
                  <th className="p-4">Car Model</th>
                  <th className="p-4">12 Hr Rate</th>
                  <th className="p-4">24 Hr Rate</th>
                  <th className="p-4">Extra KM Rate</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCars.map((car) => {
                  const isEditing = editingRows[car.id] !== undefined;
                  const editState = editingRows[car.id];

                  return (
                    <tr key={car.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-semibold text-white">{car.id}</td>
                      <td className="p-4">
                        <p className="text-white font-medium">{car.name}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wide">{car.category}</p>
                      </td>
                      
                      {/* 12 Hr Rate Cell */}
                      <td className="p-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1 max-w-[100px]">
                            <span className="text-gray-500">₹</span>
                            <input
                              type="number"
                              value={editState.price12}
                              onChange={(e) => handleInputChange(car.id, 'price12', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-gold/50"
                            />
                          </div>
                        ) : (
                          <span className="font-medium text-white">{formatCurrency(car.price12)}</span>
                        )}
                      </td>

                      {/* 24 Hr Rate Cell */}
                      <td className="p-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1 max-w-[100px]">
                            <span className="text-gray-500">₹</span>
                            <input
                              type="number"
                              value={editState.price24}
                              onChange={(e) => handleInputChange(car.id, 'price24', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-gold/50"
                            />
                          </div>
                        ) : (
                          <span className="font-medium text-gold">{formatCurrency(car.price24)}</span>
                        )}
                      </td>

                      {/* Extra KM Rate Cell */}
                      <td className="p-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1 max-w-[100px]">
                            <span className="text-gray-500">₹</span>
                            <input
                              type="number"
                              value={editState.extraKm}
                              onChange={(e) => handleInputChange(car.id, 'extraKm', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-gold/50"
                            />
                          </div>
                        ) : (
                          <span className="text-gray-400">{formatCurrency(car.extraKm)}/KM</span>
                        )}
                      </td>

                      {/* Actions cell */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveClick(car.id, car.name)}
                                className="text-emerald-400 hover:text-white hover:bg-emerald-500/10 p-1.5 rounded transition-all"
                                title="Save changes"
                              >
                                <FiCheck className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleCancelClick(car.id)}
                                className="text-red-400 hover:text-white hover:bg-red-500/10 p-1.5 rounded transition-all"
                                title="Cancel edit"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEditClick(car)}
                              className="text-gray-400 hover:text-gold hover:bg-gold/10 p-1.5 rounded transition-all"
                              title="Edit rates inline"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
export default Pricing;
