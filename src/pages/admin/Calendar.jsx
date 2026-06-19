import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { Card } from '../../components/Card';
import { CustomSelect } from '../../components/CustomSelect';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiSliders, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export const Calendar = () => {
  const { vehicles, availability, bookings } = useContext(DataContext);

  const [selectedCarId, setSelectedCarId] = useState('');
  
  // Date selection states
  const [currentDate, setCurrentDate] = useState(new Date());

  // Auto select first vehicle on mount
  useEffect(() => {
    if (vehicles.length > 0 && !selectedCarId) {
      setSelectedCarId(vehicles[0].id);
    }
  }, [vehicles, selectedCarId]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const nextDate = new Date(prev);
      nextDate.setMonth(nextDate.getMonth() - 1);
      return nextDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const nextDate = new Date(prev);
      nextDate.setMonth(nextDate.getMonth() + 1);
      return nextDate;
    });
  };



  // Generate calendar dates structures
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of month
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();

  const monthLabel = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Check state of cell
  const getCellStatus = (dayNum) => {
    if (!selectedCarId) return 'available';
    const day = dayNum.toString().padStart(2, '0');
    const fullMonth = (month + 1).toString().padStart(2, '0');
    const dateStr = `${year}-${fullMonth}-${day}`;
    
    // Check if there is an active (approved or completed) booking for this vehicle on this date
    const hasBooking = bookings.some(b => 
      b.vehicleId === selectedCarId &&
      (b.status === 'approved' || b.status === 'completed') &&
      dateStr >= b.pickupDate &&
      dateStr <= b.returnDate
    );

    if (hasBooking) {
      return 'booked';
    }

    // Check overrides
    if (availability[selectedCarId] && availability[selectedCarId][dateStr]) {
      return availability[selectedCarId][dateStr];
    }

    // Default to vehicle state (maintenance check)
    const car = vehicles.find(v => v.id === selectedCarId);
    if (car && car.availability === 'maintenance') {
      if (car.maintenanceStart && car.maintenanceEnd) {
        if (dateStr >= car.maintenanceStart && dateStr <= car.maintenanceEnd) {
          return 'maintenance';
        }
      } else {
        return 'maintenance';
      }
    }
    return 'available';
  };

  const getCellClass = (status) => {
    switch (status) {
      case 'booked':
        return 'bg-yellow-950/40 border-yellow-500/20 text-yellow-400';
      case 'maintenance':
        return 'bg-red-950/40 border-red-500/20 text-red-400';
      case 'available':
      default:
        return 'bg-emerald-950/30 border-emerald-500/10 text-emerald-400';
    }
  };

  const vehicleOptions = vehicles.map(v => ({
    value: v.id,
    label: `${v.name} (${v.category})`
  }));

  return (
    <div className="flex flex-col gap-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-20">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">Availability Calendar</h1>
          <p className="text-xs text-gray-500 mt-1">Select a car to view its availability and booking status across dates.</p>
        </div>

        {/* Vehicle Picker */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto w-full sm:w-auto">
          <FiSliders className="text-gold w-4 h-4 shrink-0 hidden sm:block" />
          <CustomSelect
            value={selectedCarId}
            onChange={(e) => setSelectedCarId(e.target.value)}
            options={vehicleOptions}
            className="w-full sm:w-56"
          />
        </div>
      </div>

      {/* Calendar Grid Container */}
      <Card hoverEffect={false} className="p-6 border border-white/5 flex flex-col gap-6">
        
        {/* Month Header controls */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <FiCalendar className="text-gold w-5 h-5" />
            <h3 className="font-heading text-lg font-bold text-white tracking-wide">{monthLabel}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Previous month"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Next month"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend status indicators */}
        <div className="flex items-center gap-4 flex-wrap text-[11px] font-semibold">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-950 border border-emerald-500/30 shrink-0" />
            <span className="text-emerald-400">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-yellow-950 border border-yellow-500/30 shrink-0" />
            <span className="text-yellow-400">Booked / Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-950 border border-red-500/30 shrink-0" />
            <span className="text-red-400">Maintenance</span>
          </div>
        </div>

        {/* Calendar Weeks & Days Grid */}
        <div className="flex flex-col gap-1.5 mt-2">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-gray-500 py-1.5">
            {weekdays.map(day => (
              <div key={day} className="uppercase tracking-wider">{day}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank offsets */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`blank-${idx}`} className="bg-white/[0.01] rounded-xl border border-transparent h-16 sm:h-20" />
            ))}

            {/* Calendar active cells */}
            {Array.from({ length: totalDays }).map((_, idx) => {
              const dayNum = idx + 1;
              const status = getCellStatus(dayNum);
              const cellStyle = getCellClass(status);

              return (
                <div
                  key={dayNum}
                  className={`rounded-xl border p-2 h-16 sm:h-20 flex flex-col justify-between items-start ${cellStyle}`}
                >
                  <span className="text-xs font-bold font-sans">{dayNum}</span>
                  <span className="text-[8px] uppercase tracking-wider font-semibold opacity-75 hidden sm:inline">
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </Card>
    </div>
  );
};
export default Calendar;
