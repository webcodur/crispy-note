'use client'

import { Sidebar } from '@/components/etc/Sidebar'
import { Header } from '@/components/etc/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-primary/10 to-transparent">
          {children}
        </main>
      </div>
    </div>
  )
}

