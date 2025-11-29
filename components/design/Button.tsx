'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-lg text-base font-medium cursor-pointer transition-opacity'
  const primaryClasses = 'bg-tg-button text-tg-button hover:opacity-90'
  const secondaryClasses = 'bg-tg-secondary text-tg-text border border-tg-hint hover:opacity-90'
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : ''
  const widthClasses = fullWidth ? 'w-full' : ''

  const variantClasses = variant === 'primary' ? primaryClasses : secondaryClasses

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${widthClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

