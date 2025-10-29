import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'premium'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group active:scale-[0.98]'

const variants: Record<Variant, string> = {
  default:
    'bg-gradient-to-br from-purple-600 via-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:ring-offset-background before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity',
  premium:
    'bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 focus-visible:ring-offset-background before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:via-transparent before:to-white/10 before:opacity-0 hover:before:opacity-100 before:transition-all before:duration-500',
  secondary:
    'bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-slate-200/60 dark:from-slate-800 dark:to-slate-900 dark:text-slate-100 dark:border-slate-700/60 dark:hover:border-slate-600 focus-visible:ring-offset-background',
  outline:
    'border-2 border-purple-300/50 bg-background/80 text-purple-700 shadow-sm hover:shadow-md hover:border-purple-400 hover:bg-purple-50 hover:-translate-y-0.5 dark:border-purple-500/30 dark:bg-background/30 dark:text-purple-300 dark:hover:border-purple-400 dark:hover:bg-purple-950/30 focus-visible:ring-offset-background',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white focus-visible:ring-offset-background shadow-none',
  danger:
    'bg-gradient-to-br from-rose-500 via-red-500 to-rose-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:ring-rose-500/60 focus-visible:ring-offset-background before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-xs font-semibold tracking-wide rounded-xl',
  md: 'h-11 px-6 text-sm font-semibold rounded-xl',
  lg: 'h-12 px-8 text-base font-bold rounded-2xl',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="relative z-10">Loading...</span>
        </>
      ) : (
        <span className="relative z-10">{children}</span>
      )}
    </button>
  ),
)

Button.displayName = 'Button'
