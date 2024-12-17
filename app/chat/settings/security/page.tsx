'use client'

import { ChevronLeft, ChevronRight, KeyRound, Smartphone, Shield, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const securitySettings = [
  {
    title: 'Password & Authentication',
    items: [
      { icon: KeyRound, label: 'Change Password', href: '/settings/security/password' },
      { icon: Smartphone, label: 'Two-Factor Authentication', toggle: true, enabled: false },
    ]
  },
  {
    title: 'Privacy',
    items: [
      { icon: Shield, label: 'App Lock', toggle: true, enabled: true },
      { icon: History, label: 'Login History', href: '/settings/security/history' },
    ]
  }
]

export default function SecurityPage() {
  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-4 p-4 border-b bg-white dark:bg-gray-800">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">Password & Security</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <div className="space-y-6">
          {securitySettings.map((group) => (
            <div key={group.title} className="space-y-4">
              <h2 className="text-sm text-gray-500 dark:text-gray-400">
                {group.title}
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg divide-y dark:divide-gray-700">
                {group.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <Label className="font-medium">{item.label}</Label>
                    </div>
                    {item.toggle ? (
                      <Switch defaultChecked={item.enabled} />
                    ) : (
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={item.href!}>
                          <ChevronRight className="h-5 w-5" />
                        </Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

