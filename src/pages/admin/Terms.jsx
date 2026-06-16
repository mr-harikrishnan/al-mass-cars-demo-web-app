import React from 'react';
import { Card } from '../../components/Card';
import { TermsContent } from '../../components/TermsContent';

export const Terms = () => {
  return (
    <div className="flex flex-col gap-8 text-left">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white">Rental Terms & Conditions</h1>
        <p className="text-xs text-gray-500 mt-1">Read-only reference display of current customer rental policies.</p>
      </div>

      <Card hoverEffect={false} className="p-8 border border-white/5 bg-white/5">
        <TermsContent showDepositLink={false} />
      </Card>
    </div>
  );
};
export default Terms;
