import React from 'react';
import { Card } from '../../components/Card';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-left">
      <Card hoverEffect={false} className="p-8 md:p-12 border border-white/10">
        <h1 className="font-heading text-3xl font-bold text-white mb-6 border-b border-white/5 pb-4">Privacy Policy</h1>
        
        <div className="bg-gold/10 border border-gold/20 p-4 rounded-xl mb-8 text-xs text-gold">
          <strong>DEMO POLICY NOTICE:</strong> This application is a client-side frontend prototype built for portfolio demonstration. All session databases, vehicle updates, and booking details are cached locally on your device via <code className="bg-black/40 px-1 py-0.5 rounded">localStorage</code> and never sent to external servers.
        </div>
        
        <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-heading text-lg font-semibold mb-3 font-heading">1. Information We Collect</h2>
            <p>
              When you register or perform actions in this dashboard, the details (Full Name, Phone Number, Email, and Passwords) are committed to your browser's persistent key storage. We do not run any background logging API calls or track your browsing activity.
            </p>
          </section>

          <section>
            <h2 className="text-white font-heading text-lg font-semibold mb-3 font-heading">2. Local Storage Utilisation</h2>
            <p>
              We utilize browser cookies or local web storage keys (<code className="text-white bg-white/5 px-1 py-0.5 rounded text-xs">almas_session</code>, <code className="text-white bg-white/5 px-1 py-0.5 rounded text-xs">almas_users</code>, <code className="text-white bg-white/5 px-1 py-0.5 rounded text-xs">almas_bookings</code>, and <code className="text-white bg-white/5 px-1 py-0.5 rounded text-xs">almas_vehicles</code>) strictly to preserve your dashboard actions across tab refreshes.
            </p>
          </section>

          <section>
            <h2 className="text-white font-heading text-lg font-semibold mb-3 font-heading">3. Security Recommendations</h2>
            <p>
              As a portfolio demonstration app, we recommend avoiding entering authentic personal passwords or confidential email addresses. Use dummy data structures (e.g., the default user/admin logins) to experience user flows safely.
            </p>
          </section>

          <section>
            <h2 className="text-white font-heading text-lg font-semibold mb-3 font-heading">4. Contact Information</h2>
            <p>
              For any clarification regarding this mock policy page, please contact our support staff at Chennai Mannady Metro Station or phone our official number.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
};
export default PrivacyPolicy;
