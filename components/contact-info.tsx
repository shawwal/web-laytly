import { Phone, Mail } from 'lucide-react';

interface ContactInfoProps {
  phone?: string;   // Optional phone number
  email?: string;   // Optional email address
}

interface ContactInfoItem {
  icon: React.ElementType;  // React component type for the icon
  label: string;
  value: string;
  href: string;
}

export function ContactInfo({ phone, email }: ContactInfoProps) {
  const contactInfo: ContactInfoItem[] = [
    phone && {
      icon: Phone,
      label: 'Phone',
      value: phone,
      href: `tel:${phone.replace(/\s+/g, '')}` // Ensure correct phone number formatting
    },
    email && {
      icon: Mail,
      label: 'Email',
      value: email,
      href: `mailto:${email}`
    },
  ].filter(Boolean) as ContactInfoItem[];  // Ensures the array is typed properly after filtering

  return (
    <div className="mt-6 space-y-4 max-w-sm mx-auto">
      {contactInfo.map((info) => (
        <a
          key={info.label}
          href={info.href}
          className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="p-2">
            <info.icon className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500">{info.label}</p>
            <p className="font-medium truncate">{info.value}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
