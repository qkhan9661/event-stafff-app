import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'primary' | 'secondary'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  default:
    'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 border-slate-300/50 dark:from-slate-800 dark:to-slate-900 dark:text-slate-300 dark:border-slate-700/50',
  success:
    'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200/50 dark:from-emerald-950/50 dark:to-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800/50',
  warning:
    'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-700 border-amber-200/50 dark:from-amber-950/50 dark:to-amber-900/50 dark:text-amber-300 dark:border-amber-800/50',
  danger:
    'bg-gradient-to-br from-rose-50 to-rose-100 text-rose-700 border-rose-200/50 dark:from-rose-950/50 dark:to-rose-900/50 dark:text-rose-300 dark:border-rose-800/50',
  info:
    'bg-gradient-to-br from-sky-50 to-sky-100 text-sky-700 border-sky-200/50 dark:from-sky-950/50 dark:to-sky-900/50 dark:text-sky-300 dark:border-sky-800/50',
  purple:
    'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 border-purple-200/50 dark:from-purple-950/50 dark:to-purple-900/50 dark:text-purple-300 dark:border-purple-800/50',
  primary:
    'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 border-purple-200/50 dark:from-purple-950/50 dark:to-purple-900/50 dark:text-purple-300 dark:border-purple-800/50',
  secondary:
    'bg-gradient-to-br from-rose-50 to-rose-100 text-rose-700 border-rose-200/50 dark:from-rose-950/50 dark:to-rose-900/50 dark:text-rose-300 dark:border-rose-800/50',
}

const sizes: Record<Size, string> = {
  sm: 'px-2 py-0.5 text-xs rounded-md',
  md: 'px-3 py-1 text-xs rounded-lg',
  lg: 'px-4 py-1.5 text-sm rounded-xl',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
  size?: Size
  dot?: boolean
  pulse?: boolean
}

export const Badge = ({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  children,
  ...props
}: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 font-semibold border shadow-sm transition-all duration-200 hover:scale-105',
      variants[variant],
      sizes[size],
      className,
    )}
    {...props}
  >
    {(dot || pulse) && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
    {children}
  </span>
)
