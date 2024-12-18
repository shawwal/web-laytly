import { Metadata } from 'next'
import { QRCodeView } from '@/components/connect/qr-code-view'

export const metadata: Metadata = {
  title: 'My QR Code | Laytly App',
  description: 'Share your QR code with friends',
}

export default function ConnectPage() {
  return <QRCodeView />
}

