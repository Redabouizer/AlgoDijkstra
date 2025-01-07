import React from 'react'

export const Slider = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div className={`relative flex w-full touch-none select-none items-center ${className}`}>
      <input
        type="range"
        className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer"
        ref={ref}
        {...props}
      />
    </div>
  )
})

Slider.displayName = "Slider"

