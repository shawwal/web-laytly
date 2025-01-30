// terms.tsx
import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-gray-600 text-2xl mb-4">Terms of Service</h1>
      <p className="text-gray-600 text-sm mb-4">
        Effective Date: January 30th 2025
      </p>
      <h2 className="text-gray-600 text-lg mb-2">1. Introduction</h2>
      <p className="text-gray-600 text-sm mb-4">
        Welcome to Laytly! These Terms of Service (&quot;Terms&quot;) govern your use of our website, app, and services. By using Laytly, you agree to be bound by these Terms.
      </p>
      <h2 className="text-gray-600 text-lg mb-2">2. Eligibility</h2>
      <p className="text-gray-600 text-sm mb-4">
        You must be at least 13 years old to use Laytly. If you are under 18 years old, you must have parental consent to use Laytly.
      </p>
      <h2 className="text-gray-600 text-lg mb-2">3. User Conduct</h2>
      <p className="text-gray-600 text-sm mb-4">
        You agree to use Laytly for lawful purposes only. You must not:
      </p>
      <ul className="list-disc ml-4 text-slate-700">
        <li>Use Laytly to harass, abuse, or threaten others.</li>
        <li>Use Laytly to spam or scam others.</li>
        <li>Use Laytly to post or share explicit or obscene content.</li>
      </ul>
      <h2 className="text-gray-600 text-lg mb-2">4. Intellectual Property</h2>
      <p className="text-gray-600 text-sm mb-4">
        Laytly owns all intellectual property rights to our website, app, and services. You agree not to reproduce, distribute, or display any Laytly content without our prior written consent.
      </p>
      <h2 className="text-gray-600 text-lg mb-2">5. Disclaimer of Warranties</h2>
      <p className="text-gray-600 text-sm mb-4">
        Laytly disclaims all warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
      </p>
      <h2 className="text-gray-600 text-lg mb-2">6. Limitation of Liability</h2>
      <p className="text-gray-600 text-sm mb-4">
        In no event shall Laytly be liable for any damages, including but not limited to incidental, consequential, or punitive damages, arising out of your use of Laytly.
      </p>
      <h2 className="text-gray-600 text-lg mb-2">7. Governing Law</h2>
      <p className="text-gray-600 text-sm mb-4">
        These Terms shall be governed by and construed in accordance with the laws of the [Insert State/Country].
      </p>
      <h2 className="text-gray-600 text-lg mb-2">8. Changes to Terms</h2>
      <p className="text-gray-600 text-sm mb-4">
        Laytly reserves the right to modify or update these Terms at any time. Your continued use of Laytly shall constitute your acceptance of any changes to these Terms.
      </p>
      <h2 className="text-gray-600 text-lg mb-2">9. Contact Us</h2>
      <p className="text-gray-600 text-sm mb-4">
        If you have any questions or concerns about these Terms, please contact us at admin@laytly.com.
      </p>
    </div>
  );
};

export default TermsOfService;