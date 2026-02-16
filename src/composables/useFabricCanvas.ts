import { ref, shallowRef, type Ref, nextTick } from 'vue'
import { Canvas, FabricImage } from 'fabric'
import type { ImageSource, ExportOptions } from '@/types'

export function useFabricCanvas() {
  const canvas = shallowRef<Canvas | null>(null)
  const originalImage = shallowRef<FabricImage | null>(null)
  const isLoading = ref(false)
  const imageWidth = ref(0)
  const imageHeight = ref(0)

  function init(canvasEl: HTMLCanvasElement, container: HTMLElement) {
    canvas.value = new Canvas(canvasEl, {
      preserveObjectStacking: true,
      selection: true,
      backgroundColor: '#1a1a2e',
    })
    fitToContainer(container)
  }

  function fitToContainer(container: HTMLElement) {
    if (!canvas.value) return
    const w = container.clientWidth
    const h = container.clientHeight
    canvas.value.setDimensions({ width: w, height: h })
    canvas.value.renderAll()
  }

  async function loadImage(source: ImageSource): Promise<void> {
    if (!canvas.value) return
    isLoading.value = true

    try {
      let url: string
      let revokeUrl = false

      if (source instanceof File || source instanceof Blob) {
        url = URL.createObjectURL(source)
        revokeUrl = true
      } else {
        url = source
      }

      const img = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' })

      const canvasWidth = canvas.value.getWidth()
      const canvasHeight = canvas.value.getHeight()
      const scale = Math.min(
        canvasWidth / (img.width ?? 1),
        canvasHeight / (img.height ?? 1),
        1
      )

      img.scale(scale)
      img.set({
        left: (canvasWidth - img.getScaledWidth()) / 2,
        top: (canvasHeight - img.getScaledHeight()) / 2,
        selectable: false,
        evented: false,
      })

      canvas.value.clear()
      canvas.value.backgroundColor = '#1a1a2e'
      canvas.value.add(img)
      canvas.value.sendObjectToBack(img)
      originalImage.value = img
      imageWidth.value = img.width ?? 0
      imageHeight.value = img.height ?? 0
      canvas.value.renderAll()

      if (revokeUrl) {
        URL.revokeObjectURL(url)
      }
    } finally {
      isLoading.value = false
    }
  }

  async function exportImage(
    options: ExportOptions
  ): Promise<File | Blob | string | HTMLCanvasElement> {
    if (!canvas.value) throw new Error('Canvas not initialized')

    const format = options.mimeType.split('/')[1] || 'png'
    const dataURL = canvas.value.toDataURL({
      format: format as any,
      quality: options.quality,
      multiplier: 1,
    })

    switch (options.format) {
      case 'dataurl':
        return dataURL
      case 'canvas':
        return canvas.value.toCanvasElement()
      case 'blob': {
        const response = await fetch(dataURL)
        return response.blob()
      }
      case 'file':
      default: {
        const response = await fetch(dataURL)
        const blob = await response.blob()
        const ext = format === 'jpeg' ? 'jpg' : format
        return new File([blob], `${options.fileName}.${ext}`, {
          type: options.mimeType,
        })
      }
    }
  }

  function dispose() {
    canvas.value?.dispose()
    canvas.value = null
    originalImage.value = null
  }

  return {
    canvas,
    originalImage,
    isLoading,
    imageWidth,
    imageHeight,
    init,
    fitToContainer,
    loadImage,
    exportImage,
    dispose,
  }
}
