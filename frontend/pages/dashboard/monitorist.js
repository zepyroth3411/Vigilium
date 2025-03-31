// pages/dashboard/monitorist.js
import React from 'react'
import WelcomeCard from '@/components/dashboard/cards/WelcomeCard'
import SystemStatus from '@/components/dashboard/cards/SystemStatus'
import RecentEvents from '@/components/dashboard/cards/RecentEvents'

export default function DashboardMonitorista() {
  return (
    <div className="p-6 space-y-6">
      <WelcomeCard userRole="monitorista" />
      <SystemStatus />

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">📌 Eventos Recientes</h2>
        <RecentEvents />
      </section>
    </div>
  )
}
