import { MousePointer, Move, ArrowUpRight, Trash2, Plus, ZoomIn, ZoomOut, Copy } from 'lucide-react'

function Toolbar({ selectedTool, onToolSelect, onZoomIn, onZoomOut, onCopy, onDelete, className }) {
  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'move', icon: Move, label: 'Move' },
    { id: 'connect', icon: ArrowUpRight, label: 'Connect' },
    { id: 'add', icon: Plus, label: 'Add Shape' },
    { id: 'delete', icon: Trash2, label: 'Delete', onClick: onDelete },
    { id: 'copy', icon: Copy, label: 'Copy', onClick: onCopy },
    { id: 'zoomIn', icon: ZoomIn, label: 'Zoom In', onClick: onZoomIn },
    { id: 'zoomOut', icon: ZoomOut, label: 'Zoom Out', onClick: onZoomOut },
  ]

  return (
    <div className={`toolbar fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 flex gap-4 ${className}`}>
      {tools.map((tool) => (
        <button
          key={tool.id}
          className={`toolbar-button p-2 rounded-full transition-all duration-200 ease-in-out ${selectedTool === tool.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
          onClick={() => tool.onClick ? tool.onClick() : onToolSelect(tool.id)}
          title={tool.label}
        >
          <tool.icon className="w-6 h-6" />
        </button>
      ))}
    </div>
  )
}

export default Toolbar

