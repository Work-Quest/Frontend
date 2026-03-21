import { Toaster, type DefaultToastOptions } from 'react-hot-toast'
import { WorkQuestToasterChild } from '@/components/WorkQuestToast'

const TOAST_DEFAULTS: DefaultToastOptions = {
  duration: 5000,
  success: { duration: 5000 },
  error: { duration: 5000 },
  blank: { duration: 5000 },
  loading: { duration: Number.POSITIVE_INFINITY },
  custom: { duration: 5000 },
}

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      containerStyle={{ top: 16, right: 16 }}
      toastOptions={TOAST_DEFAULTS}
    >
      {(t) => <WorkQuestToasterChild toast={t} />}
    </Toaster>
  )
}
