import React from 'react';
import { staticContent } from '../data/content';
import { Link } from 'react-router-dom';

export const TermsContent = ({ showDepositLink = true }) => {
  return (
    <div className="flex flex-col gap-6 text-gray-300">
      <div className="border-l-4 border-gold pl-4 py-1">
        <h3 className="text-xl font-semibold text-white font-heading">AL-MAS Cars Rental Agreement</h3>
        <p className="text-xs text-gray-400 mt-1">Please read these rules carefully before taking delivery of the vehicle.</p>
      </div>

      <ul className="space-y-3 pl-5 list-decimal text-sm leading-relaxed">
        {staticContent.terms.map((term, index) => (
          <li key={index} className="marker:text-gold hover:text-white transition-colors duration-150">
            {term}
          </li>
        ))}
      </ul>

      {showDepositLink && (
        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h4 className="font-semibold text-white text-sm">Need verification documents list?</h4>
            <p className="text-xs text-gray-400 mt-0.5">Learn more about required documents and advance deposits.</p>
          </div>
          <Link
            to="/deposit-details"
            className="text-xs font-bold text-black bg-gold hover:bg-gold-light transition-all px-4 py-2 rounded-lg uppercase tracking-wider"
          >
            View Deposit Details
          </Link>
        </div>
      )}
    </div>
  );
};
