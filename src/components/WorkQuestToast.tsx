import { useMemo, type CSSProperties, type ReactNode } from 'react'
import type { Toast } from 'react-hot-toast'
import { resolveValue, toast as hotToast } from 'react-hot-toast'
import { AlertTriangle, Check, Info, Loader2, X, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type WorkQuestToastVariant = 'success' | 'error' | 'warning' | 'info' | 'loading'

const VARIANT_STYLES: Record<
  WorkQuestToastVariant,
  { circle: string; bar: string; Icon: LucideIcon }
> = {
  success: {
    circle: 'bg-[var(--color-green)]',
    bar: 'bg-[var(--color-green)]',
    Icon: Check,
  },
  error: {
    circle: 'bg-[var(--color-red)]',
    bar: 'bg-[var(--color-red)]',
    Icon: X,
  },
  warning: {
    circle: 'bg-[var(--color-orange)]',
    bar: 'bg-[var(--color-orange)]',
    Icon: AlertTriangle,
  },
  info: {
    circle: 'bg-[var(--color-blue)]',
    bar: 'bg-[var(--color-blue)]',
    Icon: Info,
  },
  loading: {
    circle: 'bg-[var(--color-veryLightBrown)]',
    bar: 'bg-[var(--color-veryLightBrown)]',
    Icon: Loader2,
  },
}

function mapToastTypeToVariant(type: Toast['type']): WorkQuestToastVariant {
  if (type === 'success') return 'success'
  if (type === 'error') return 'error'
  if (type === 'loading') return 'loading'
  return 'info'
}

function parseToastMessage(message: ReactNode): {
  title: ReactNode
  description?: ReactNode
} {
  if (typeof message === 'string') {
    const lines = message.split('\n')
    if (lines.length <= 1) return { title: message }
    return {
      title: lines[0],
      description: lines.slice(1).join('\n').trim() || undefined,
    }
  }
  if (message == null) return { title: '' }
  return { title: message }
}

export type WorkQuestToastProps = {
  toast: Toast
  variantOverride?: WorkQuestToastVariant
  titleOverride?: ReactNode
  descriptionOverride?: ReactNode
}


export function WorkQuestToast({
  toast: t,
  variantOverride,
  titleOverride,
  descriptionOverride,
}: WorkQuestToastProps) {
  const variant = variantOverride ?? mapToastTypeToVariant(t.type)
  const resolvedMessage = useMemo(
    () => (titleOverride !== undefined ? null : resolveValue(t.message, t)),
    [t, titleOverride]
  )

  const { title, description } =
    titleOverride !== undefined
      ? { title: titleOverride, description: descriptionOverride }
      : parseToastMessage(resolvedMessage)

  const { circle, bar, Icon } = VARIANT_STYLES[variant]
  const isLoading = variant === 'loading'
  const durationMs =
    typeof t.duration === 'number' && Number.isFinite(t.duration) && t.duration > 0
      ? t.duration
      : 5000
  const showCountdown = !isLoading && Number.isFinite(durationMs)

  const animationStyle = t.height ? undefined : ({ opacity: 0 } as CSSProperties)

  return (
    <div
      className={cn(
        "relative flex w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-xl border border-darkBrown/10 bg-offWhite font-baloo2 shadow-[0_4px_24px_rgba(61,55,48,0.12)] transition-all duration-300 ease-[cubic-bezier(0.21,1.02,0.73,1)]",
        t.visible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
      )}
      style={animationStyle}
    >
      <button
        type="button"
        className="pointer-events-auto absolute right-2 top-2 z-20 flex h-9 w-9 items-center justify-center rounded-lg font-baloo2 text-xl leading-none text-brown/50 transition-colors hover:bg-cream hover:text-darkBrown active:scale-95"
        aria-label="Close"
        onClick={() => hotToast.dismiss(t.id)}
      >
        <span aria-hidden className="relative -top-px font-semibold tracking-tight">
          ×
        </span>
      </button>

      <div className="flex gap-3 p-4 pr-11">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-sm',
            circle,
            isLoading ? 'text-darkBrown' : 'text-white'
          )}
        >
          <Icon className={cn('h-5 w-5', isLoading && 'animate-spin')} strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1 pt-0.5" {...t.ariaProps}>
          <p className="!text-base !font-bold !leading-snug text-darkBrown">{title}</p>
          {description ? (
            <p className="mt-1 !text-sm !leading-relaxed text-brown/90">{description}</p>
          ) : null}
        </div>
      </div>

      {showCountdown ? (
        <div className="h-1 w-full bg-veryLightBrown/80">
          <div
            key={`${t.id}-${t.createdAt}`}
            className={cn('h-full w-full origin-left wq-toast-progress-bar', bar)}
            style={
              {
                '--wq-toast-duration': `${durationMs}ms`,
              } as CSSProperties
            }
          />
        </div>
      ) : null}
    </div>
  )
}

/**
 * Pass as <Toaster>{(t) => <WorkQuestToasterChild toast={t} />}</Toaster>
 */
export function WorkQuestToasterChild({ toast: t }: { toast: Toast }) {
  return <WorkQuestToast toast={t} />
}
