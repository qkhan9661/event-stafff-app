import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'group relative rounded-3xl border border-slate-200/60 bg-card shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-slate-300',
      'dark:border-slate-800/60 dark:bg-card/60 dark:hover:border-slate-700',
      'before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/40 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100 dark:before:from-white/5',
      className,
    )}
    {...props}
  />
)

export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('relative z-10 flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
)

export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight text-card-foreground',
      className,
    )}
    {...props}
  />
)

export const CardDescription = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
)

export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('relative z-10 p-6 pt-0', className)} {...props} />
)

export const CardFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('relative z-10 flex items-center p-6 pt-0', className)} {...props} />
)
