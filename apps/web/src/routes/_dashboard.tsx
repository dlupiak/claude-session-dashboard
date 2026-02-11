import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '@/components/AppShell'

export const Route = createFileRoute('/_dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
