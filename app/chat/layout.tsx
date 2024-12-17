import { NavMenu } from '@/components/navigation/nav-menu'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <NavMenu />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}

