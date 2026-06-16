import React from 'react';
import { Card } from '../../components/Card';
import { staticContent } from '../../data/content';
import { FiFileText, FiCheck, FiInfo } from 'react-icons/fi';

export const DepositDetails = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-left">
      <Card hoverEffect={false} className="p-8 md:p-12 border border-white/10">
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
          <div className="w-10 h-10 bg-gold/10 rounded-lg border border-gold/20 flex items-center justify-center text-gold">
            <FiFileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-white">Deposit & Verification Guidelines</h1>
            <p className="text-xs text-gray-500 mt-0.5">Please check our verification list before scheduling vehicle collection.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Document Section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-lg font-semibold text-white tracking-wide border-b border-white/5 pb-2">
              Mandatory Documents
            </h3>
            <p className="text-xs text-gray-400">You must present original documents for physical verification at handover:</p>
            <ul className="space-y-3">
              {staticContent.depositDetails.requiredDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                  <FiCheck className="text-gold shrink-0 w-4 h-4 mt-0.5" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deposit policy section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-lg font-semibold text-white tracking-wide border-b border-white/5 pb-2">
              Payment & Fee Details
            </h3>
            <p className="text-xs text-gray-400">Here is the structure of rental advances and deposit rates:</p>
            <ul className="space-y-3">
              {staticContent.depositDetails.terms.map((term, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                  <FiCheck className="text-gold shrink-0 w-4 h-4 mt-0.5" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
              <FiInfo className="text-gold shrink-0 w-5 h-5 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Refund Process</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  The ₹5000 security deposit is returned immediately in full after the vehicle is inspected at dropoff. Toll charges or any damage/cleaning fees can be deducted directly from this deposit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default DepositDetails;
