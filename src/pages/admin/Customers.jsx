import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { getFromStorage, KEYS } from '../../utils/storage';
import { formatDate } from '../../utils/formatters';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { TableSkeleton } from '../../components/Skeleton';
import { FiSearch, FiClock, FiCheckSquare, FiXCircle, FiTruck, FiInfo, FiUser, FiCalendar } from 'react-icons/fi';

export const Customers = () => {
  const { bookings } = useContext(DataContext);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const users = getFromStorage(KEYS.USERS, []);
  
  // Filter customers (role === 'user')
  const customersList = users
    .filter(u => u.role === 'user')
    .map(customer => {
      // Find customer bookings
      const customerBookings = bookings.filter(
        b => b.customerEmail.toLowerCase() === customer.email.toLowerCase()
      );
      
      const lastBooking = customerBookings.reduce((latest, b) => {
        if (!latest) return b;
        return new Date(b.pickupDate) > new Date(latest.pickupDate) ? b : latest;
      }, null);

      return {
        ...customer,
        bookingsCount: customerBookings.length,
        lastBookingDate: lastBooking ? lastBooking.pickupDate : null,
        bookingsList: customerBookings
      };
    });

  const filteredCustomers = customersList.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-yellow-950/80 border border-yellow-500/30 text-yellow-400">
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-red-950/80 border border-red-500/30 text-red-400">
            Rejected
          </span>
        );
      case 'completed':
        return (
          <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/30 text-blue-400">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white">Customer Directory</h1>
          <p className="text-xs text-gray-500 mt-1">View registered customer accounts, review booking frequencies, and check trip logs.</p>
        </div>

        <span className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-gray-400 self-start sm:self-auto font-medium">
          Total Customers: <strong className="text-gold">{customersList.length}</strong> accounts
        </span>
      </div>

      {/* Filter and Search Panel */}
      <Card hoverEffect={false} className="p-4 md:p-6 border border-white/5">
        <div className="relative w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or phone number..."
            className="input-field pl-11 text-sm bg-black/20"
          />
        </div>
      </Card>

      {/* Table view */}
      {isInitialLoad ? (
        <TableSkeleton rows={5} cols={5} />
      ) : filteredCustomers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white/5 border border-white/5 rounded-2xl gap-2 text-center">
          <FiUser className="w-12 h-12 text-gold opacity-30 animate-pulse" />
          <h3 className="font-heading text-lg font-bold text-white mt-2">No Customers Found</h3>
          <p className="text-xs">Adjust your search parameters or query keywords.</p>
        </div>
      ) : (
        <Card hoverEffect={false} className="overflow-hidden border border-white/5">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-gray-300">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-gray-500 border-b border-white/10 bg-charcoal-elevated/40">
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Bookings Count</th>
                  <th className="p-4">Last Trip Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => handleRowClick(customer)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gold-light to-gold-dark text-black font-bold flex items-center justify-center text-xs shrink-0">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{customer.name}</span>
                      </div>
                    </td>
                    <td className="p-4">{customer.email}</td>
                    <td className="p-4 font-semibold">{customer.phone}</td>
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white">
                        {customer.bookingsCount}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-semibold text-gold">
                      {customer.lastBookingDate ? formatDate(customer.lastBookingDate) : 'No trips yet'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Customer Booking History Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={`Customer File: ${selectedCustomer.name}`}
        >
          <div className="space-y-6 text-left">
            {/* Account Information Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs border-b border-white/5 pb-6">
              <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
                <p className="text-gray-500 font-bold uppercase text-[8px]">Email Address</p>
                <p className="text-sm font-semibold text-white truncate">{selectedCustomer.email}</p>
              </div>
              <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
                <p className="text-gray-500 font-bold uppercase text-[8px]">Phone Contact</p>
                <p className="text-sm font-semibold text-white">{selectedCustomer.phone}</p>
              </div>
              <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
                <p className="text-gray-500 font-bold uppercase text-[8px]">Registration Date</p>
                <p className="text-sm font-semibold text-white">
                  {selectedCustomer.created_at ? formatDate(selectedCustomer.created_at) : 'Jan 01, 2026'}
                </p>
              </div>
            </div>

            {/* Booking History Logs */}
            <div className="flex flex-col gap-3">
              <h4 className="font-heading text-sm font-semibold text-white tracking-wide border-b border-white/5 pb-1 flex items-center gap-2">
                <FiCalendar className="text-gold shrink-0" />
                <span>Booking logs ({selectedCustomer.bookingsCount})</span>
              </h4>
              
              {selectedCustomer.bookingsList.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-500 font-semibold bg-black/10 rounded-xl border border-white/5">
                  No bookings found for this customer file.
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
                  {selectedCustomer.bookingsList.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between gap-4 text-xs hover:border-gold/30 transition-all duration-150"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{log.id}</span>
                          <span className="text-gray-400 font-medium">({log.vehicleName})</span>
                        </div>
                        <p className="text-gray-500 text-[10px]">
                          Pickup: <strong className="text-white">{formatDate(log.pickupDate)}</strong> ({log.pickupTime}) | Return: <strong className="text-white">{formatDate(log.returnDate)}</strong>
                        </p>
                        <p className="text-[10px] text-gray-500 max-w-[300px] truncate" title={log.location}>
                          Location: <span className="text-gray-400 font-medium">{log.location}</span>
                        </p>
                      </div>
                      
                      <div className="shrink-0">
                        {getStatusBadge(log.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end pt-4 border-t border-white/5">
              <button
                onClick={() => setModalOpen(false)}
                className="text-xs uppercase font-bold text-gray-400 hover:text-white px-6 py-2 border border-white/10 rounded-lg hover:bg-white/5"
              >
                Close File
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default Customers;
