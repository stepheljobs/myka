import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MYKA - My Kaizen App',
  description: 'Continuous improvement for your fitness journey - track water, weight, calories, protein, workouts, and daily reflections',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MYKA',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'MYKA',
    title: 'MYKA - My Kaizen App',
    description: 'Continuous improvement for your fitness journey - track water, weight, calories, protein, workouts, and daily reflections',
  },
  twitter: {
    card: 'summary',
    title: 'MYKA - My Kaizen App',
    description: 'Continuous improvement for your fitness journey - track water, weight, calories, protein, workouts, and daily reflections',
  },
}

export const viewport: Viewport = {
  themeColor: '#FF6B35',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}