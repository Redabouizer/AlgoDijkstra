import React, { useState } from 'react'

export const TooltipProvider = ({ children }) => {
  return <>{children}</>
}

export const Tooltip = ({ children }) => {
  return <>{children}</>
}

export const TooltipTrigger = React.forwardRef(({ children, ...props }, ref) => {
  return React.cloneElement(children, { ref, ...props })
})

TooltipTrigger.displayName = "TooltipTrigger"

export const TooltipContent = ({ children }) => {
  return (
    <div className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1">
      {children}
    </div>
  )
}

