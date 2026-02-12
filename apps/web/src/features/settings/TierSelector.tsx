import { SUBSCRIPTION_TIERS, type SubscriptionTierId } from './settings.types'

interface TierSelectorProps {
  value: SubscriptionTierId
  onChange: (tier: SubscriptionTierId) => void
}

export function TierSelector({ value, onChange }: TierSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {SUBSCRIPTION_TIERS.map((tier) => {
        const isSelected = value === tier.id
        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => onChange(tier.id)}
            className={`rounded-lg border px-3 py-2 text-left transition-colors ${
              isSelected
                ? 'border-blue-500 bg-blue-500/10 text-white'
                : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700 hover:text-gray-300'
            }`}
          >
            <div className="text-sm font-medium">{tier.displayName}</div>
            <div className="mt-0.5 font-mono text-[10px] text-gray-500">
              {tier.monthlyUSD !== null ? `$${tier.monthlyUSD}/mo` : 'Custom'}
            </div>
          </button>
        )
      })}
    </div>
  )
}
