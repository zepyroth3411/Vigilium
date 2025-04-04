import WelcomeCard from '@/components/dashboard/WelcomeCard'
import SystemStatus from '@/components/dashboard/SystemStatus'
import SummaryCards from '@/components/dashboard/SummaryCards'
import QuickActions from '@/components/dashboard/QuickActions'
import RecentEvents from '@/components/dashboard/RecentEvents'


export default function DashboardAdmin() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <WelcomeCard />
      <SystemStatus />
      <SummaryCards />
      <QuickActions />
      <RecentEvents />
    </div>
  )
}

