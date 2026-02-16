import { ref, type ShallowRef } from 'vue'
import { Canvas, Rect, FabricImage } from 'fabric'
import type { CropAspectRatio } from '@/types'

export function useCrop(
  canvas: ShallowRef<Canvas | null>,
  originalImage: ShallowRef<FabricImage | null>,
  onAfterCrop: () => void
) {
  const isCropping = ref(false)
  const cropRect = ref<Rect | null>(null)
  const selectedRatio = ref<CropAspectRatio | null>(null)

  function startCrop(ratio?: CropAspectRatio) {
    if (!canvas.value) return
    cancelCrop()

    isCropping.value = true
    selectedRatio.value = ratio || null

    const cw = canvas.value.getWidth()
    const ch = canvas.value.getHeight()
    let w = cw * 0.7
    let h = ch * 0.7

    if (ratio?.value) {
      h = w / ratio.value
      if (h > ch * 0.7) {
        h = ch * 0.7
        w = h * ratio.value
      }
    }

    const rect = new Rect({
      left: (cw - w) / 2,
      top: (ch - h) / 2,
      width: w,
      height: h,
      fill: 'rgba(255,255,255,0.1)',
      stroke: '#ffffff',
      strokeWidth: 2,
      strokeDashArray: [8, 4],
      cornerColor: '#ffffff',
      cornerStrokeColor: '#333333',
      cornerSize: 10,
      transparentCorners: false,
      lockRotation: true,
      hasRotatingPoint: false,
    })

    if (ratio?.value) {
      rect.setControlsVisibility({
        mt: false,
        mb: false,
        ml: false,
        mr: false,
      })
      rect.on('scaling', () => {
        const scaleX = rect.scaleX ?? 1
        const scaleY = rect.scaleY ?? 1
        const newWidth = (rect.width ?? w) * scaleX
        const newHeight = newWidth / (ratio.value ?? 1)
        rect.set({ scaleX: 1, scaleY: 1, width: newWidth, height: newHeight })
        rect.setCoords()
      })
    }

    cropRect.value = rect
    canvas.value.add(rect)
    canvas.value.setActiveObject(rect)
    canvas.value.renderAll()
  }

  function setAspectRatio(ratio: CropAspectRatio) {
    selectedRatio.value = ratio
    if (isCropping.value) {
      cancelCrop()
      startCrop(ratio)
    }
  }

  async function applyCrop() {
    if (!canvas.value || !cropRect.value) return

    const rect = cropRect.value
    const left = rect.left ?? 0
    const top = rect.top ?? 0
    const width = rect.getScaledWidth()
    const height = rect.getScaledHeight()

    canvas.value.remove(rect as any)
    cropRect.value = null
    isCropping.value = false

    const dataURL = canvas.value.toDataURL({
      left,
      top,
      width,
      height,
      multiplier: 1,
      format: 'png' as any,
    })

    const img = await FabricImage.fromURL(dataURL)
    const cw = canvas.value.getWidth()
    const ch = canvas.value.getHeight()
    const scale = Math.min(cw / (img.width ?? 1), ch / (img.height ?? 1), 1)

    img.scale(scale)
    img.set({
      left: (cw - img.getScaledWidth()) / 2,
      top: (ch - img.getScaledHeight()) / 2,
      selectable: false,
      evented: false,
    })

    canvas.value.clear()
    canvas.value.backgroundColor = '#1a1a2e'
    canvas.value.add(img)
    canvas.value.sendObjectToBack(img)
    originalImage.value = img
    canvas.value.renderAll()

    onAfterCrop()
  }

  function cancelCrop() {
    if (!canvas.value || !cropRect.value) return
    canvas.value.remove(cropRect.value as any)
    cropRect.value = null
    isCropping.value = false
    canvas.value.renderAll()
  }

  return {
    isCropping,
    selectedRatio,
    startCrop,
    setAspectRatio,
    applyCrop,
    cancelCrop,
  }
}
