import WelcomeCard from '@/components/dashboard/WelcomeCard'
import RoleOverview from '@/components/dashboard/RoleOverview'
import QuickActions from '@/components/dashboard/QuickActions'


export default function DashboardAdmin() {
  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <WelcomeCard />
      <RoleOverview />
      <QuickActions />
    </div>
  )
}

