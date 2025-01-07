import { Square, Circle, Diamond } from 'lucide-react'

function ShapeMenu({ onSelect }) {
  const shapes = [
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'ellipse', icon: Circle, label: 'Ellipse' },
    { id: 'diamond', icon: Diamond, label: 'Diamond' },
  ]

  return (
    <div className="shape-menu fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-4 flex justify-center">
      {shapes.map((shape) => (
        <button
          key={shape.id}
          className="shape-button p-3 mx-2 rounded-lg hover:bg-gray-100 transition-all duration-200 ease-in-out flex flex-col items-center justify-center"
          onClick={() => onSelect(shape.id)}
        >
          <shape.icon className="w-8 h-8 text-gray-600" />
          <span className="text-xs mt-2">{shape.label}</span>
        </button>
      ))}
    </div>
  )
}

export default ShapeMenu

