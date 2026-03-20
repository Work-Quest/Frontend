'use client'

import * as React from 'react'

// Chart component placeholder - not using recharts
// This file is kept for compatibility but chart components use custom SVG implementations

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
  }
}

// Placeholder exports for compatibility
export const ChartContainer = ({
  children,
  className,
  config: _config,
  ...props
}: React.ComponentProps<'div'> & { config?: ChartConfig }) => {
  void _config
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export const ChartTooltip = ({ children }: { children?: React.ReactNode }) => {
  return <>{children}</>
}

export const ChartTooltipContent = ({ children }: { children?: React.ReactNode }) => {
  return <>{children}</>
}

export const ChartLegend = ({ children }: { children?: React.ReactNode }) => {
  return <>{children}</>
}

export const ChartLegendContent = ({ children }: { children?: React.ReactNode }) => {
  return <>{children}</>
}
