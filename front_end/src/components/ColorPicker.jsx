import React from 'react'

function ColorPicker({ selectedColor, setSelectedColor }) {
  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF']

  return (
    <div className="color-picker fixed bottom-20 right-4 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-2 flex flex-wrap justify-center max-w-xs">
      {colors.map((color) => (
        <button
          key={color}
          className={`w-8 h-8 m-1 rounded-full transition-all duration-200 ease-in-out hover:scale-110 ${
            selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
          }`}
          style={{ backgroundColor: color }}
          onClick={() => setSelectedColor(color)}
          aria-label={`Select color: ${color}`}
        />
      ))}
    </div>
  )
}

export default ColorPicker

