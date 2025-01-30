// privacy.tsx
'use client'
import React, { useState } from 'react';

interface Section {
  title: string;
  content: string;
}

const sections: Section[] = [
  {
    title: 'Introduction',
    content:
      'Laytly ("we", "our", "us") values your privacy. This Privacy Policy outlines how we collect, use, and protect your information when you use our Laytly app and related services.',
  },
  {
    title: 'Information We Collect',
    content:
      'We collect the following types of information:\na. Personal Information: Information that identifies you, such as your name, email address, profile picture, and any other details you provide.\nb. Usage Data: Information about how you use the app, including interactions, preferences, and settings.\nc. Media: Photos, videos, and other files shared through the app.\nd. Contacts: If you grant access, we may access your device\'s contacts to help you find friends and invite them to use the app. We do not upload or store your contact data on our servers, and it remains solely on your device.',
  },
  {
    title: 'How We Use Information',
    content:
      'We use the collected information to:\na. Provide, maintain, and improve our services.\nb. Personalize your experience and communicate with you.\nc. Secure your account and enhance the safety of the app.\nd. Analyze usage and trends to enhance app functionality.\ne. Contacts: We access your contacts solely to help you find friends and invite them to use the app. Contact data is not shared or uploaded to our servers.',
  },
  {
    title: 'Sharing Your Information',
    content:
      'We do not share your personal information with third parties except:\na. When required by law or to comply with legal processes.\nb. To protect the rights and safety of Laytly, our users, and others.\nc. With your consent or at your direction.',
  },
  {
    title: 'Data Security',
    content:
      'We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.',
  },
  {
    title: 'Your Rights',
    content:
      'You have the right to access, update, and delete your personal information. You can manage your data within the app settings or by contacting us directly.',
  },
  {
    title: 'Changes to This Policy',
    content:
      'We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our app and updating the effective date.',
  },
  {
    title: 'Contact Us',
    content:
      'If you have any questions or concerns about this Privacy Policy, please contact us at:\nEmail: admin@laytly.com',
  },
];

const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  const toggleSection = (section: number) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
      <h2 className="text-gray-600 text-lg mb-4">
        We want you to know exactly how Laytly services work and why we need your details. Reviewing our policy will help you continue using the app with peace of mind.
      </h2>
      {sections.map((section, index) => (
        <div key={index}>
          <button
            onClick={() => toggleSection(index)}
            className={`flex justify-between items-center py-2 border-b border-gray-200 ${
              activeSection === index ? 'text-blue-500' : ''
            }`}
          >
            <h3 className="text-lg">{section.title}</h3>
            <span className="text-gray-400">
              {activeSection === index ? '-' : '+'}
            </span>
          </button>
          {activeSection === index && (
            <p className="text-gray-600 text-sm mt-2 mb-4">{section.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default PrivacyPolicy;