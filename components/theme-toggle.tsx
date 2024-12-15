'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.add(savedTheme)
    } else {
      // Default to 'dark' if no saved theme
      setTheme('dark')
      document.documentElement.classList.add('dark') // Apply dark theme by default
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) {
    return null
  }

  const toggleTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme)
    document.documentElement.classList.remove('dark', 'light') // Remove both themes
    document.documentElement.classList.add(newTheme)
    localStorage.setItem('theme', newTheme) // Save the new theme in localStorage
  }

  return (
    <Switch
      checked={theme === 'dark'}
      onCheckedChange={(checked) => toggleTheme(checked ? 'dark' : 'light')}
    />
  )
}
