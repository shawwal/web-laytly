import { Metadata } from 'next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/theme-toggle'
import { ChevronRight, User, Shield, Bell, Bookmark, Globe, Moon, Mail, Users, InfoIcon as PrivacyIcon, FileText } from 'lucide-react'
import LogoutButton from '@/components/logout'

export const metadata: Metadata = {
  title: 'Settings | Chat App',
  description: 'Manage your app settings',
}

const settingsGroups = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Personal Data', href: '/settings/personal' },
      { icon: Shield, label: 'Password & Security', href: '/settings/security' },
      { icon: Bell, label: 'Notifications Preferences', href: '/settings/notifications' },
      { icon: Bookmark, label: 'Favorites', href: '/settings/favorites' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Globe, label: 'Language', href: '/settings/language', value: 'English(USA)' },
      { icon: Moon, label: 'Dark Mode', component: ThemeToggle },
      { icon: Mail, label: 'Contact List', href: '/settings/contacts' },
      { icon: Users, label: 'Friend List', href: '/settings/friends' },
    ],
  },
  {
    title: 'Privacy and legal',
    items: [
      { icon: PrivacyIcon, label: 'Privacy Policy', href: '/settings/privacy' },
      { icon: FileText, label: 'Terms of Service (EULA)', href: '/settings/terms' },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="px-4 py-6 md:px-6 md:py-8 mb-16 sm:mb-0">
        <h1 className="text-2xl font-bold text-center mb-8">Settings</h1>
        
        <div className="max-w-2xl mx-auto">
          {/* Profile Section */}
          <div className="flex items-center gap-4 mb-8">
            <Avatar className="w-16 h-16">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>LT</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">Lidia Terecia</h2>
              <p className="text-gray-500 dark:text-gray-400">lidiaterecia@gmail.com</p>
            </div>
          </div>

          {/* Settings Groups */}
          <div className="space-y-8">
            {settingsGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {group.title}
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg divide-y dark:divide-gray-700">
                  {group.items.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.value && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {item.value}
                          </span>
                        )}
                        {item.component ? (
                          <item.component />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

