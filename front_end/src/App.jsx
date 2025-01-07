'use client'

import { useState, useRef, useEffect } from 'react'
import Toolbar from './components/Toolbar'
import TopBar from './components/TopBar'
import ShapeMenu from './components/ShapeMenu'
import ColorPicker from './components/ColorPicker'
import { initCanvas, drawShape, drawConnection } from './utils/canvas-utils'
import './styles/globals.css'

function App() {
  const canvasRef = useRef(null)
  const [selectedTool, setSelectedTool] = useState('select')
  const [shapes, setShapes] = useState([])
  const [connections, setConnections] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showShapeMenu, setShowShapeMenu] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectingShape, setConnectingShape] = useState(null)
  const [editingText, setEditingText] = useState(null)
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [selectionBox, setSelectionBox] = useState(null)
  
  useEffect(() => {
    if (canvasRef.current) {
      const resizeCanvas = () => {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight - 64 // Subtract header height
        renderCanvas()
      }
      
      window.addEventListener('resize', resizeCanvas)
      resizeCanvas()
      
      return () => window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - pan.x) / scale
    const y = (e.clientY - rect.top - pan.y) / scale

    if (selectedTool === 'select') {
      const clickedShape = shapes.find(shape => 
        x >= shape.x && x <= shape.x + shape.width && 
        y >= shape.y && y <= shape.y + shape.height
      )
      if (clickedShape) {
        setSelectedItems([clickedShape])
      } else {
        setSelectedItems([])
      }
    } else if (selectedTool === 'connect') {
      const clickedShape = shapes.find(shape => 
        x >= shape.x && x <= shape.x + shape.width && 
        y >= shape.y && y <= shape.y + shape.height
      )
      if (clickedShape) {
        if (isConnecting) {
          if (clickedShape.id !== connectingShape.id) {
            setConnections([...connections, {
              id: Date.now(),
              start: connectingShape.id,
              end: clickedShape.id,
              label: ''
            }])
          }
          setIsConnecting(false)
          setConnectingShape(null)
        } else {
          setIsConnecting(true)
          setConnectingShape(clickedShape)
        }
      }
    }
  }

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - pan.x) / scale
    const y = (e.clientY - rect.top - pan.y) / scale

    if (selectedTool === 'select') {
      const clickedShape = shapes.find(shape => 
        x >= shape.x && x <= shape.x + shape.width && 
        y >= shape.y && y <= shape.y + shape.height
      )
      if (clickedShape) {
        setSelectedItems([clickedShape])
        setIsDragging(true)
        setDragStart({ x: x - clickedShape.x, y: y - clickedShape.y })
      } else {
        setSelectionBox({ startX: x, startY: y, endX: x, endY: y })
      }
    } else if (selectedTool === 'move') {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - pan.x) / scale
    const y = (e.clientY - rect.top - pan.y) / scale

    if (isDragging && selectedItems.length === 1) {
      const shape = selectedItems[0]
      setShapes(shapes.map(s => 
        s.id === shape.id 
          ? { ...s, x: x - dragStart.x, y: y - dragStart.y } 
          : s
      ))
    } else if (selectedTool === 'select' && selectionBox) {
      setSelectionBox(prev => ({ ...prev, endX: x, endY: y }))
    } else if (selectedTool === 'move' && isDragging) {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y
      setPan(prevPan => ({ x: prevPan.x + dx, y: prevPan.y + dy }))
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    if (selectedTool === 'select' && selectionBox) {
      const selectedShapes = shapes.filter(shape => 
        shape.x >= Math.min(selectionBox.startX, selectionBox.endX) &&
        shape.x + shape.width <= Math.max(selectionBox.startX, selectionBox.endX) &&
        shape.y >= Math.min(selectionBox.startY, selectionBox.endY) &&
        shape.y + shape.height <= Math.max(selectionBox.startY, selectionBox.endY)
      )
      setSelectedItems(selectedShapes)
    }
    setIsDragging(false)
    setSelectionBox(null)
  }

  const handleDoubleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - pan.x) / scale
    const y = (e.clientY - rect.top - pan.y) / scale

    const clickedShape = shapes.find(shape => 
      x >= shape.x && x <= shape.x + shape.width && 
      y >= shape.y && y <= shape.y + shape.height
    )

    if (clickedShape) {
      setEditingText(clickedShape)
    }
  }

  const handleShapeSelect = (shapeType) => {
    const newShape = {
      id: Date.now(),
      type: shapeType,
      x: Math.random() * (canvasRef.current.width - 200) / scale - pan.x,
      y: Math.random() * (canvasRef.current.height - 100) / scale - pan.y,
      width: 200,
      height: 100,
      text: '',
      color: '#FFFFFF',
      borderColor: selectedColor,
    }
    setShapes([...shapes, newShape])
    setShowShapeMenu(false)
  }

  const handleTextChange = (e) => {
    if (editingText) {
      setShapes(shapes.map(shape => 
        shape.id === editingText.id ? { ...shape, text: e.target.value } : shape
      ))
    }
  }

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale * 1.1, 3))
  }

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale / 1.1, 0.5))
  }

  const handleCopy = () => {
    const copiedItems = selectedItems.map(item => ({...item, id: Date.now() + Math.random()}))
    setShapes([...shapes, ...copiedItems])
  }

  const handleDelete = () => {
    const newShapes = shapes.filter(shape => !selectedItems.includes(shape))
    const newConnections = connections.filter(conn => 
      !selectedItems.some(item => item.id === conn.start || item.id === conn.end)
    )
    setShapes(newShapes)
    setConnections(newConnections)
    setSelectedItems([])
  }

  const renderCanvas = () => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    ctx.save()
    ctx.translate(pan.x, pan.y)
    ctx.scale(scale, scale)

    connections.forEach(conn => {
      const start = shapes.find(shape => shape.id === conn.start)
      const end = shapes.find(shape => shape.id === conn.end)
      if (start && end) {
        drawConnection(ctx, start, end, conn.label, selectedItems.includes(conn))
      }
    })

    shapes.forEach(shape => {
      drawShape(ctx, shape, selectedItems.includes(shape))
    })

    if (selectionBox) {
      ctx.strokeStyle = 'blue'
      ctx.lineWidth = 1
      ctx.strokeRect(
        selectionBox.startX,
        selectionBox.startY,
        selectionBox.endX - selectionBox.startX,
        selectionBox.endY - selectionBox.startY
      )
    }

    ctx.restore()
  }

  useEffect(() => {
    renderCanvas()
  }, [shapes, connections, selectedItems, selectedColor, scale, pan, selectionBox])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
      <main className="flex-grow overflow-hidden relative">
        <canvas
          ref={canvasRef}
          className="canvas w-full h-full"
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          style={{ cursor: selectedTool === 'move' ? 'move' : 'default' }}
        />
        {editingText && (
          <div 
            className="absolute flex items-center justify-center"
            style={{
              left: (editingText.x * scale + pan.x),
              top: (editingText.y * scale + pan.y),
              width: editingText.width * scale,
              height: editingText.height * scale,
            }}
          >
            <input
              type="text"
              value={editingText.text}
              onChange={handleTextChange}
              className="w-full h-full text-center bg-transparent border-none outline-none 
                         font-medium text-base focus:ring-2 focus:ring-blue-500 rounded-md
                         placeholder-gray-400"
              placeholder="Enter text"
              style={{ 
                color: editingText.borderColor,
                transform: `scale(${scale})`,
                transformOrigin: 'center center'
              }}
              onBlur={() => setEditingText(null)}
              autoFocus
            />
          </div>
        )}
      </main>

      {showShapeMenu && (
        <ShapeMenu onSelect={handleShapeSelect} />
      )}
      <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
      <Toolbar 
        selectedTool={selectedTool}
        onToolSelect={(tool) => {
          setSelectedTool(tool)
          if (tool === 'add') {
            setShowShapeMenu(true)
          } else {
            setShowShapeMenu(false)
          }
        }}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onCopy={handleCopy}
        onDelete={handleDelete}
        className="animate-fade-in"
      />
    </div>
  )
}

export default App

