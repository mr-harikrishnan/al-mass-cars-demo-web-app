import React from 'react';
import { Card } from '../../components/Card';
import { TermsContent } from '../../components/TermsContent';

export const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-left">
      <Card hoverEffect={false} className="p-8 md:p-12 border border-white/10">
        <TermsContent showDepositLink={true} />
      </Card>
    </div>
  );
};
export default Terms;
