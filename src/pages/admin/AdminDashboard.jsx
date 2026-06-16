import React, { useContext } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { getFromStorage, KEYS } from '../../utils/storage';
import { formatCurrency } from '../../utils/formatters';
import { Card } from '../../components/Card';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { FiUsers, FiClock, FiCheckSquare, FiTruck } from 'react-icons/fi';
import { TbCurrencyRupee } from 'react-icons/tb';

export const AdminDashboard = () => {
  const { vehicles, bookings } = useContext(DataContext);
  const users = getFromStorage(KEYS.USERS, []);

  // Filter customers (role === 'user')
  const totalCustomers = users.filter(u => u.role === 'user').length;

  // Bookings stats
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const approvedCount = bookings.filter(b => b.status === 'approved').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const rejectedCount = bookings.filter(b => b.status === 'rejected').length;

  // Demo Revenue = sum of price24 for approved & completed bookings
  const revenue = bookings
    .filter(b => b.status === 'approved' || b.status === 'completed')
    .reduce((sum, b) => {
      // Find vehicle rates
      const car = vehicles.find(v => v.id === b.vehicleId);
      const dayRate = car ? car.price24 : 3000; // default backup
      return sum + dayRate;
    }, 0);

  // Chart 1: Donut booking status data
  const statusData = [
    { name: 'Pending', value: pendingCount, color: '#D4AF37' },
    { name: 'Approved', value: approvedCount, color: '#10B981' },
    { name: 'Completed', value: completedCount, color: '#3B82F6' },
    { name: 'Rejected', value: rejectedCount, color: '#EF4444' }
  ].filter(item => item.value > 0);

  // Chart 2: Top 5 Booked Vehicles
  const vehicleBookingCounts = bookings.reduce((acc, b) => {
    acc[b.vehicleName] = (acc[b.vehicleName] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.keys(vehicleBookingCounts)
    .map(name => ({ name, bookings: vehicleBookingCounts[name] }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);

  // Chart 3: Last 7 Days Booking Trend
  const trendData = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - idx));
    const dateStr = d.toISOString().split('T')[0];
    
    // Count bookings created on this day
    const dayBookingsCount = bookings.filter(b => {
      if (!b.created_at) return false;
      return b.created_at.split('T')[0] === dateStr;
    }).length;

    const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
    return { name: label, bookings: dayBookingsCount };
  });

  return (
    <div className="flex flex-col gap-8 text-left">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Admin Control Center</h1>
        <p className="text-xs text-gray-500 mt-1">Monitor rental logistics, review booking requests, and manage vehicles.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card hoverEffect={true} className="p-5 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Total Vehicles</span>
            <h3 className="text-2xl font-bold text-white mt-1">{vehicles.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <FiTruck className="w-5 h-5" />
          </div>
        </Card>

        <Card hoverEffect={true} className="p-5 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Total Customers</span>
            <h3 className="text-2xl font-bold text-white mt-1">{totalCustomers}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <FiUsers className="w-5 h-5" />
          </div>
        </Card>

        <Card hoverEffect={true} className="p-5 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Pending Requests</span>
            <h3 className="text-2xl font-bold text-white mt-1">{pendingCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <FiClock className="w-5 h-5" />
          </div>
        </Card>

        <Card hoverEffect={true} className="p-5 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase text-gray-500 font-bold tracking-wider">Approved Drives</span>
            <h3 className="text-2xl font-bold text-white mt-1">{approvedCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            <FiCheckSquare className="w-5 h-5" />
          </div>
        </Card>

        <Card hoverEffect={true} className="p-5 border border-white/5 flex items-center justify-between bg-gradient-to-br from-charcoal-elevated to-charcoal-base">
          <div>
            <span className="text-[9px] uppercase text-gold/60 font-bold tracking-wider">Revenue (Demo)</span>
            <h3 className="text-xl font-bold text-gold mt-1 truncate max-w-[130px]" title={formatCurrency(revenue)}>
              {formatCurrency(revenue)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center text-gold">
            <TbCurrencyRupee className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Recharts section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trend line chart */}
        <Card hoverEffect={false} className="lg:col-span-8 p-6 border border-white/5">
          <h3 className="font-heading text-lg font-semibold text-white mb-6">Booking Intake (Last 7 Days)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="bookings" stroke="#D4AF37" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Status Chart */}
        <Card hoverEffect={false} className="lg:col-span-4 p-6 border border-white/5 flex flex-col justify-between">
          <h3 className="font-heading text-lg font-semibold text-white mb-4">Bookings by Status</h3>
          
          {statusData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-gray-500 font-medium bg-black/10 rounded-xl border border-white/5">
              No active bookings logged
            </div>
          ) : (
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none mt-2">
                <span className="text-2xl font-bold text-white">{bookings.length}</span>
                <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Total Requests</span>
              </div>
            </div>
          )}

          {/* Pie Legends */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold">
            {statusData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-gray-400 truncate">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Vehicle performance bar chart */}
      <Card hoverEffect={false} className="p-6 border border-white/5">
        <h3 className="font-heading text-lg font-semibold text-white mb-6">Top 5 Booked Vehicles</h3>
        
        {barData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-xs text-gray-500 font-medium bg-black/10 rounded-xl border border-white/5">
            No booking allocations to analyze
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis type="number" stroke="#6b7280" fontSize={11} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={11} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="bookings" fill="#D4AF37" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
};
export default AdminDashboard;
