import { reactive, type ShallowRef } from 'vue'
import { Canvas, Rect, Circle, Line, Path } from 'fabric'
import type { ShapeConfig } from '@/types'

export function useShapes(
  canvas: ShallowRef<Canvas | null>,
  onAfterAdd: () => void
) {
  const config = reactive<ShapeConfig>({
    type: 'rect',
    strokeColor: '#ffffff',
    fillColor: 'transparent',
    strokeWidth: 2,
  })

  function addShape() {
    if (!canvas.value) return

    const cx = canvas.value.getWidth() / 2
    const cy = canvas.value.getHeight() / 2
    let shape: any

    switch (config.type) {
      case 'rect':
        shape = new Rect({
          left: cx - 50,
          top: cy - 40,
          width: 100,
          height: 80,
          fill: config.fillColor,
          stroke: config.strokeColor,
          strokeWidth: config.strokeWidth,
        })
        break

      case 'circle':
        shape = new Circle({
          left: cx - 40,
          top: cy - 40,
          radius: 40,
          fill: config.fillColor,
          stroke: config.strokeColor,
          strokeWidth: config.strokeWidth,
        })
        break

      case 'line':
        shape = new Line([cx - 60, cy, cx + 60, cy], {
          stroke: config.strokeColor,
          strokeWidth: config.strokeWidth,
        })
        break

      case 'arrow': {
        const startX = cx - 60
        const endX = cx + 60
        const pathData = `M ${startX} ${cy} L ${endX} ${cy} M ${endX - 12} ${cy - 8} L ${endX} ${cy} L ${endX - 12} ${cy + 8}`
        shape = new Path(pathData, {
          fill: '',
          stroke: config.strokeColor,
          strokeWidth: config.strokeWidth,
          strokeLineCap: 'round',
          strokeLineJoin: 'round',
        })
        break
      }
    }

    if (shape) {
      canvas.value.add(shape)
      canvas.value.setActiveObject(shape)
      canvas.value.renderAll()
      onAfterAdd()
    }
  }

  return { config, addShape }
}
