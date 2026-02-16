import { ref, type ShallowRef } from 'vue'
import { Canvas, FabricImage } from 'fabric'

export function useRotateFlip(
  canvas: ShallowRef<Canvas | null>,
  originalImage: ShallowRef<FabricImage | null>,
  onAfterTransform: () => void
) {
  const rotation = ref(0)
  const flippedX = ref(false)
  const flippedY = ref(false)

  function rotate90(direction: 'left' | 'right') {
    if (!canvas.value) return
    const delta = direction === 'right' ? 90 : -90
    rotation.value = (rotation.value + delta + 360) % 360

    canvas.value.getObjects().forEach((obj) => {
      const cx = canvas.value!.getWidth() / 2
      const cy = canvas.value!.getHeight() / 2
      const objLeft = (obj.left ?? 0) - cx
      const objTop = (obj.top ?? 0) - cy
      const rad = (delta * Math.PI) / 180

      obj.set({
        left: cx + objLeft * Math.cos(rad) - objTop * Math.sin(rad),
        top: cy + objLeft * Math.sin(rad) + objTop * Math.cos(rad),
        angle: ((obj.angle ?? 0) + delta) % 360,
      })
      obj.setCoords()
    })

    canvas.value.renderAll()
    onAfterTransform()
  }

  function setRotation(degrees: number) {
    if (!canvas.value || !originalImage.value) return
    const img = originalImage.value
    img.set({ angle: degrees })
    img.setCoords()
    rotation.value = degrees
    canvas.value.renderAll()
  }

  function flipHorizontal() {
    if (!canvas.value) return
    flippedX.value = !flippedX.value
    canvas.value.getObjects().forEach((obj) => {
      obj.set({ flipX: !obj.flipX })
      obj.setCoords()
    })
    canvas.value.renderAll()
    onAfterTransform()
  }

  function flipVertical() {
    if (!canvas.value) return
    flippedY.value = !flippedY.value
    canvas.value.getObjects().forEach((obj) => {
      obj.set({ flipY: !obj.flipY })
      obj.setCoords()
    })
    canvas.value.renderAll()
    onAfterTransform()
  }

  return {
    rotation,
    flippedX,
    flippedY,
    rotate90,
    setRotation,
    flipHorizontal,
    flipVertical,
  }
}
