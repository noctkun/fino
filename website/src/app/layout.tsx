import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fino - Personal Finance Management App',
  description: 'Track, analyze, and master your money with Fino. Beautiful expense tracking with local privacy-first storage.',
  keywords: 'personal finance, expense tracker, money management, budget app, finance app',
  authors: [{ name: 'Fino Team' }],
  openGraph: {
    title: 'Fino - Personal Finance Management App',
    description: 'Track, analyze, and master your money with Fino. Beautiful expense tracking with local privacy-first storage.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}