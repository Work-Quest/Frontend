import toast from 'react-hot-toast'
import { WorkQuestToast } from '@/components/WorkQuestToast'

export { toast }

export function toastWarning(title: string, description?: string) {
  return toast.custom(
    (t) => (
      <WorkQuestToast
        toast={t}
        variantOverride="warning"
        titleOverride={title}
        descriptionOverride={description ?? 'Take a moment to confirm this is what you want.'}
      />
    ),
    { duration: 5000 }
  )
}

export function toastInfo(title: string, description?: string) {
  return toast.custom(
    (t) => (
      <WorkQuestToast
        toast={t}
        variantOverride="info"
        titleOverride={title}
        descriptionOverride={description ?? 'Here’s a quick update for your quest.'}
      />
    ),
    { duration: 5000 }
  )
}
