import { reactive, watch, type ShallowRef } from 'vue'
import { Canvas, PencilBrush } from 'fabric'
import type { BrushConfig } from '@/types'

export function useDraw(
  canvas: ShallowRef<Canvas | null>,
  onAfterDraw: () => void
) {
  const config = reactive<BrushConfig>({
    width: 4,
    color: '#ffffff',
    opacity: 1,
  })

  function enableDrawing() {
    if (!canvas.value) return
    canvas.value.isDrawingMode = true
    const brush = new PencilBrush(canvas.value)
    brush.width = config.width
    brush.color = config.color
    canvas.value.freeDrawingBrush = brush
    canvas.value.on('path:created', () => {
      onAfterDraw()
    })
  }

  function disableDrawing() {
    if (!canvas.value) return
    canvas.value.isDrawingMode = false
    canvas.value.off('path:created')
  }

  watch(config, () => {
    if (!canvas.value?.freeDrawingBrush) return
    canvas.value.freeDrawingBrush.width = config.width
    canvas.value.freeDrawingBrush.color = config.color
  })

  return { config, enableDrawing, disableDrawing }
}
