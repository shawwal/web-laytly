'use client'

import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface NotificationSetting {
  id: string
  label: string
  enabled: boolean
}

interface NotificationGroup {
  title: string
  settings: NotificationSetting[]
}

export default function NotificationsPage() {
  const notificationGroups: NotificationGroup[] = [
    {
      title: "General Notification",
      settings: [
        { id: "push", label: "Push Notification", enabled: false },
        { id: "status", label: "Applied Status Notification", enabled: true },
        { id: "email", label: "Email Notifications", enabled: false },
        { id: "update", label: "Update Application", enabled: true },
      ]
    },
    {
      title: "Message Notification",
      settings: [
        { id: "message", label: "Message", enabled: true },
        { id: "reminders", label: "Reminders", enabled: true },
      ]
    },
    {
      title: "App Notification",
      settings: [
        { id: "sound", label: "Sound", enabled: true },
        { id: "vibrate", label: "Vibrate", enabled: true },
      ]
    }
  ]

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-4 p-4 border-b bg-white dark:bg-gray-800">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">Notifications Preferences</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <div className="space-y-6">
          {notificationGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <h2 className="text-sm text-gray-500 dark:text-gray-400">
                {group.title}
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg divide-y dark:divide-gray-700">
                {group.settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4">
                    <Label htmlFor={setting.id} className="font-medium">
                      {setting.label}
                    </Label>
                    <Switch
                      id={setting.id}
                      defaultChecked={setting.enabled}
                    />
                  </div>
                ))}
                {group.title === "App Notification" && (
                  <div className="flex items-center justify-between p-4">
                    <Label className="font-medium">Tone</Label>
                    <Select defaultValue="default">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

