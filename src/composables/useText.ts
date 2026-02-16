import { reactive, type ShallowRef } from 'vue'
import { Canvas, IText } from 'fabric'
import type { TextConfig } from '@/types'

export function useText(
  canvas: ShallowRef<Canvas | null>,
  onAfterAdd: () => void
) {
  const config = reactive<TextConfig>({
    text: 'Text',
    fontFamily: 'Arial',
    fontSize: 24,
    fill: '#ffffff',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
  })

  function addText() {
    if (!canvas.value) return

    const text = new IText(config.text, {
      left: canvas.value.getWidth() / 2 - 50,
      top: canvas.value.getHeight() / 2 - 20,
      fontFamily: config.fontFamily,
      fontSize: config.fontSize,
      fill: config.fill,
      fontWeight: config.fontWeight,
      fontStyle: config.fontStyle,
      textAlign: config.textAlign,
      editable: true,
    })

    canvas.value.add(text)
    canvas.value.setActiveObject(text)
    canvas.value.renderAll()
    onAfterAdd()
  }

  function updateSelectedText() {
    if (!canvas.value) return
    const active = canvas.value.getActiveObject()
    if (!(active instanceof IText)) return

    active.set({
      fontFamily: config.fontFamily,
      fontSize: config.fontSize,
      fill: config.fill,
      fontWeight: config.fontWeight,
      fontStyle: config.fontStyle,
      textAlign: config.textAlign,
    })
    canvas.value.renderAll()
  }

  return { config, addText, updateSelectedText }
}
