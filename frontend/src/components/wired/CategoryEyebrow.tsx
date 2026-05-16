import React from 'react'

interface CategoryEyebrowProps {
  category: string
  className?: string
}

export function CategoryEyebrow({ category, className = '' }: CategoryEyebrowProps) {
  return (
    <span 
      className={`wired-nav ${className}`}
      style={{ color: 'var(--color-wired-body)' }}
    >
      {category.toUpperCase()}
    </span>
  )
}
