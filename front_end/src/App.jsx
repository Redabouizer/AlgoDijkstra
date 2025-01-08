import React, { useState, useRef, useEffect } from 'react';
import Toolbar from './components/Toolbar';
import TopBar from './components/TopBar';
import ShapeMenu from './components/ShapeMenu';
import ColorPicker from './components/ColorPicker';
import { initCanvas, drawShape, drawConnection } from './utils/canvas-utils';
import './styles/globals.css';

function App() {
  const canvasRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState('select');
  const [shapes, setShapes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingShape, setConnectingShape] = useState(null);
  const [editingText, setEditingText] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectionBox, setSelectionBox] = useState(null);
  const [shortestPath, setShortestPath] = useState([]);
  const [highlightedShape, setHighlightedShape] = useState(null);



  useEffect(() => {
    if (canvasRef.current) {
      const resizeCanvas = () => {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight - 64; // Subtract header height
        renderCanvas();
      };

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, []);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / scale;
    const y = (e.clientY - rect.top - pan.y) / scale;

    if (selectedTool === 'select') {
      const clickedShape = shapes.find(shape =>
        x >= shape.x && x <= shape.x + shape.width &&
        y >= shape.y && y <= shape.y + shape.height
      );
      if (clickedShape) {
        setSelectedItems([clickedShape]);
        // Set shape color to red if "chemain" is found
        if (clickedShape.text === 'chemain') {
          setHighlightedShape(clickedShape.id);
        }
      } else {
        setSelectedItems([]);
      }
    } else if (selectedTool === 'connect') {
      const clickedShape = shapes.find(shape =>
        x >= shape.x && x <= shape.x + shape.width &&
        y >= shape.y && y <= shape.y + shape.height
      );
      if (clickedShape) {
        if (isConnecting) {
          if (clickedShape.id !== connectingShape.id) {
            const number = prompt("Enter a number for the connection:");
            if (number !== null) {
              setConnections([...connections, {
                id: Date.now(),
                start: connectingShape.id,
                end: clickedShape.id,
                label: number
              }]);
            }
          }
          setIsConnecting(false);
          setConnectingShape(null);
        } else {
          setIsConnecting(true);
          setConnectingShape(clickedShape);
        }
      } else if (isConnecting) {
        setIsConnecting(false);
        setConnectingShape(null);
      }
    }
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / scale;
    const y = (e.clientY - rect.top - pan.y) / scale;

    if (selectedTool === 'select') {
      const clickedShape = shapes.find(shape =>
        x >= shape.x && x <= shape.x + shape.width &&
        y >= shape.y && y <= shape.y + shape.height
      );
      if (clickedShape) {
        setSelectedItems([clickedShape]);
        setIsDragging(true);
        setDragStart({ x: x - clickedShape.x, y: y - clickedShape.y });
      } else {
        setSelectionBox({ startX: x, startY: y, endX: x, endY: y });
      }
    } else if (selectedTool === 'move') {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / scale;
    const y = (e.clientY - rect.top - pan.y) / scale;

    if (isDragging && selectedItems.length === 1) {
      const shape = selectedItems[0];
      setShapes(shapes.map(s =>
        s.id === shape.id
          ? { ...s, x: x - dragStart.x, y: y - dragStart.y }
          : s
      ));
    } else if (selectedTool === 'select' && selectionBox) {
      setSelectionBox(prev => ({ ...prev, endX: x, endY: y }));
    } else if (selectedTool === 'move' && isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPan(prevPan => ({ x: prevPan.x + dx, y: prevPan.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    if (selectedTool === 'select' && selectionBox) {
      const selectedShapes = shapes.filter(shape =>
        shape.x >= Math.min(selectionBox.startX, selectionBox.endX) &&
        shape.x + shape.width <= Math.max(selectionBox.startX, selectionBox.endX) &&
        shape.y >= Math.min(selectionBox.startY, selectionBox.endY) &&
        shape.y + shape.height <= Math.max(selectionBox.startY, selectionBox.endY)
      );
      setSelectedItems(selectedShapes);
    }
    setIsDragging(false);
    setSelectionBox(null);
  };

  const handleDoubleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / scale;
    const y = (e.clientY - rect.top - pan.y) / scale;

    const clickedShape = shapes.find(shape =>
      x >= shape.x && x <= shape.x + shape.width &&
      y >= shape.y && y <= shape.y + shape.height
    );

    if (clickedShape) {
      setEditingText(clickedShape);
    }
  };

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
    };
    setShapes([...shapes, newShape]);
    setShowShapeMenu(false);
  };

  const handleTextChange = (e) => {
    if (editingText) {
      const updatedText = e.target.value;
      setShapes(shapes.map(shape =>
        shape.id === editingText.id ? { ...shape, text: updatedText } : shape
      ));
      setEditingText({ ...editingText, text: updatedText });
    }
  };

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale * 1.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale / 1.1, 0.5));
  };

  const handleCopy = () => {
    const copiedItems = selectedItems.map(item => ({ ...item, id: Date.now() + Math.random() }));
    setShapes([...shapes, ...copiedItems]);
  };

  const handleDelete = () => {
    const newShapes = shapes.filter(shape => !selectedItems.includes(shape));
    const newConnections = connections.filter(conn =>
      !selectedItems.some(item => item.id === conn.start || item.id === conn.end)
    );
    setShapes(newShapes);
    setConnections(newConnections);
    setSelectedItems([]);
  };

  const renderCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(scale, scale);

    // Render connections with highlight for the shortest path
    connections.forEach(conn => {
      const start = shapes.find(shape => shape.id === conn.start);
      const end = shapes.find(shape => shape.id === conn.end);

      // Highlight only the shortest path
      const isShortest = conn.highlighted;

      drawConnection(ctx, start, end, conn.label, selectedItems.includes(conn), isShortest);
    });

    // Render shapes
    shapes.forEach(shape => {
      const shapeClass = highlightedShape === shape.id ? 'border-2 border-red-500' : 'border';
      drawShape(ctx, shape, selectedItems.includes(shape), shapeClass);
    });

    // Render selection box if active
    if (selectionBox) {
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        selectionBox.startX,
        selectionBox.startY,
        selectionBox.endX - selectionBox.startX,
        selectionBox.endY - selectionBox.startY
      );
    }

    ctx.restore();
  };

  useEffect(() => {
    renderCanvas();
  }, [shapes, connections, selectedItems, selectedColor, scale, pan, selectionBox]);

  const dijkstra = (startId, endId, connections) => {
    if (startId === endId) {
      return [startId];
    }

    const distances = {};
    const previous = {};
    shapes.forEach(shape => {
      distances[shape.id] = Infinity;
      previous[shape.id] = null;
    });
    distances[startId] = 0;

    const unvisited = new Set(shapes.map(s => s.id));

    while (unvisited.size > 0) {
      const current = Array.from(unvisited)
        .reduce((min, node) => distances[node] < distances[min] ? node : min);

      if (current === endId) break;
      if (distances[current] === Infinity) return [];

      unvisited.delete(current);

      connections
        .filter(conn => conn.start === current || conn.end === current)
        .forEach(conn => {
          const next = conn.start === current ? conn.end : conn.start;
          const weight = parseInt(conn.label) || 1;
          const dist = distances[current] + weight;

          if (dist < distances[next]) {
            distances[next] = dist;
            previous[next] = current;
          }
        });
    }

    if (!previous[endId]) return [];

    const path = [];
    let current = endId;
    while (current) {
      path.unshift(current);
      current = previous[current];
    }

    // Reset all connections highlighting
    connections.forEach(conn => {
      conn.highlighted = false;
    });

    // Only highlight connections that are part of the shortest path
    let minPathDistance = distances[endId];
    for (let i = 0; i < path.length - 1; i++) {
      const conn = connections.find(c =>
        (c.start === path[i] && c.end === path[i + 1]) ||
        (c.start === path[i + 1] && c.end === path[i])
      );
      if (conn) {
        conn.highlighted = true;
      }
    }

    console.log(`Shortest path distance: ${minPathDistance}`);
    return path;
  };




  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBar shapes={shapes} connections={connections} dijkstra={dijkstra} setShortestPath={setShortestPath} />

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
            <textarea
              value={editingText.text}
              onChange={handleTextChange}
              className="shape-input"
              placeholder="Enter text"
              style={{
                color: editingText.borderColor,
                transform: `scale(${scale})`, // Corrected this line
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
          setSelectedTool(tool);
          if (tool === 'add') {
            setShowShapeMenu(true);
          } else {
            setShowShapeMenu(false);
          }
          if (tool !== 'connect') {
            setIsConnecting(false);
            setConnectingShape(null);
          }
        }}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onCopy={handleCopy}
        onDelete={handleDelete}
        className="animate-fade-in"
      />
    </div>
  );
}

export default App;