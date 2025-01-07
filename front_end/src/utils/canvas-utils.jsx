export function drawShape(ctx, shape, isSelected) {
  const { x, y, width, height, type, color, borderColor, text } = shape

  ctx.beginPath()
  ctx.fillStyle = color
  ctx.strokeStyle = isSelected ? 'blue' : borderColor
  ctx.lineWidth = isSelected ? 3 : 1

  switch (type) {
    case 'rectangle':
      ctx.roundRect(x, y, width, height, 10)
      break
    case 'ellipse':
      ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2)
      break
    case 'diamond':
      ctx.moveTo(x + width / 2, y)
      ctx.lineTo(x + width, y + height / 2)
      ctx.lineTo(x + width / 2, y + height)
      ctx.lineTo(x, y + height / 2)
      ctx.closePath()
      break
    default:
      ctx.roundRect(x, y, width, height, 10)
  }

  ctx.fill()
  ctx.stroke()

  // Draw text
  if (text) {
    ctx.fillStyle = borderColor
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, x + width / 2, y + height / 2)
  }

  // Draw selection outline
  if (isSelected) {
    ctx.strokeStyle = 'blue'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.strokeRect(x - 2, y - 2, width + 4, height + 4)
    ctx.setLineDash([])
  }
}

export function drawConnection(ctx, start, end, label, isSelected) {
  const startX = start.x + start.width / 2
  const startY = start.y + start.height / 2
  const endX = end.x + end.width / 2
  const endY = end.y + end.height / 2

  // Draw line
  ctx.beginPath()
  ctx.strokeStyle = isSelected ? 'blue' : '#666'
  ctx.lineWidth = isSelected ? 2 : 1
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)
  ctx.stroke()

  // Draw arrow
  const angle = Math.atan2(endY - startY, endX - startX)
  const arrowLength = 10

  ctx.beginPath()
  ctx.moveTo(endX, endY)
  ctx.lineTo(
    endX - arrowLength * Math.cos(angle - Math.PI / 6),
    endY - arrowLength * Math.sin(angle - Math.PI / 6)
  )
  ctx.moveTo(endX, endY)
  ctx.lineTo(
    endX - arrowLength * Math.cos(angle + Math.PI / 6),
    endY - arrowLength * Math.sin(angle + Math.PI / 6)
  )
  ctx.stroke()

  // Draw label
  if (label) {
    const midX = (startX + endX) / 2
    const midY = (startY + endY) / 2

    ctx.fillStyle = '#fff'
    ctx.strokeStyle = isSelected ? 'blue' : '#666'
    
    // Label background
    ctx.beginPath()
    ctx.roundRect(midX - 15, midY - 10, 30, 20, 5)
    ctx.fill()
    ctx.stroke()

    // Label text
    ctx.fillStyle = '#000'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, midX, midY)
  }
}

export function initCanvas(canvas) {
  const ctx = canvas.getContext('2d')
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

