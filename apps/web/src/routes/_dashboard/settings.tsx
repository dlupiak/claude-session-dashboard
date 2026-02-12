import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '@/features/settings/SettingsPage'

export const Route = createFileRoute('/_dashboard/settings')({
  component: SettingsPageRoute,
})

function SettingsPageRoute() {
  return <SettingsPage />
}
