import { ref, type ShallowRef } from 'vue'
import type { Canvas } from 'fabric'

const MIN_ZOOM = 0.1
const MAX_ZOOM = 5

export function useZoom(canvas: ShallowRef<Canvas | null>) {
  const zoomLevel = ref(1)

  function setZoom(level: number) {
    if (!canvas.value) return
    const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, level))
    zoomLevel.value = clamped
    canvas.value.setZoom(clamped)
    canvas.value.renderAll()
  }

  function zoomIn() {
    setZoom(zoomLevel.value * 1.15)
  }

  function zoomOut() {
    setZoom(zoomLevel.value / 1.15)
  }

  function resetZoom() {
    setZoom(1)
  }

  function enableWheelZoom() {
    canvas.value?.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY
      let zoom = canvas.value!.getZoom()
      zoom *= 0.999 ** delta
      setZoom(zoom)
      opt.e.preventDefault()
      opt.e.stopPropagation()
    })
  }

  return { zoomLevel, setZoom, zoomIn, zoomOut, resetZoom, enableWheelZoom }
}
