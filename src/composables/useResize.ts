import { ref, type ShallowRef } from 'vue'
import { Canvas, FabricImage } from 'fabric'

export function useResize(
  canvas: ShallowRef<Canvas | null>,
  originalImage: ShallowRef<FabricImage | null>,
  imageWidth: { value: number },
  imageHeight: { value: number },
  onAfterResize: () => void
) {
  const newWidth = ref(0)
  const newHeight = ref(0)
  const lockRatio = ref(true)
  const aspectRatio = ref(1)

  function initResize() {
    newWidth.value = imageWidth.value
    newHeight.value = imageHeight.value
    aspectRatio.value =
      imageHeight.value > 0 ? imageWidth.value / imageHeight.value : 1
  }

  function setWidth(w: number) {
    newWidth.value = w
    if (lockRatio.value) {
      newHeight.value = Math.round(w / aspectRatio.value)
    }
  }

  function setHeight(h: number) {
    newHeight.value = h
    if (lockRatio.value) {
      newWidth.value = Math.round(h * aspectRatio.value)
    }
  }

  async function applyResize() {
    if (!canvas.value || !originalImage.value) return

    const dataURL = canvas.value.toDataURL({
      format: 'png' as any,
      multiplier: 1,
    })

    const tmpCanvas = document.createElement('canvas')
    tmpCanvas.width = newWidth.value
    tmpCanvas.height = newHeight.value
    const ctx = tmpCanvas.getContext('2d')!
    const imgEl = new window.Image()

    await new Promise<void>((resolve) => {
      imgEl.onload = () => {
        ctx.drawImage(imgEl, 0, 0, newWidth.value, newHeight.value)
        resolve()
      }
      imgEl.src = dataURL
    })

    const resizedDataURL = tmpCanvas.toDataURL('image/png')
    const img = await FabricImage.fromURL(resizedDataURL)

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
    originalImage.value = img
    imageWidth.value = newWidth.value
    imageHeight.value = newHeight.value
    canvas.value.renderAll()

    onAfterResize()
  }

  return { newWidth, newHeight, lockRatio, initResize, setWidth, setHeight, applyResize }
}
