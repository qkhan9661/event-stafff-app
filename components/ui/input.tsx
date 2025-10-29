import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, error, type = 'text', ...props }, ref) => {
    const hasError = invalid || error;
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'flex w-full rounded-xl border-2 bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all duration-200 placeholder:text-muted-foreground placeholder:font-normal',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          hasError
            ? 'border-red-500 bg-red-50/50 focus-visible:border-red-600 focus-visible:ring-red-500/20 dark:border-red-400 dark:bg-red-950/20 dark:focus-visible:border-red-400 dark:focus-visible:ring-red-400/20'
            : 'border-input focus-visible:border-purple-500 focus-visible:ring-purple-500/20 dark:focus-visible:border-purple-400 dark:focus-visible:ring-purple-400/20',
          className,
        )}
        {...props}
      />
    );
  }
)

Input.displayName = 'Input'
