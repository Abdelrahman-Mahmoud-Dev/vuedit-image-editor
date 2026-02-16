import { reactive, watch, type ShallowRef } from 'vue'
import { Canvas, FabricImage, filters } from 'fabric'
import type { FilterState } from '@/types'

export function useFilters(
  canvas: ShallowRef<Canvas | null>,
  backgroundImage: ShallowRef<FabricImage | null>,
  onAfterFilter: () => void
) {
  const state = reactive<FilterState>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    exposure: 0,
    blur: 0,
    grayscale: false,
    sepia: false,
    invert: false,
  })

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function applyFilters() {
    if (!backgroundImage.value || !canvas.value) return
    const img = backgroundImage.value
    const list: InstanceType<typeof filters.BaseFilter>[] = []

    if (state.brightness !== 0)
      list.push(new filters.Brightness({ brightness: state.brightness }))
    if (state.contrast !== 0)
      list.push(new filters.Contrast({ contrast: state.contrast }))
    if (state.saturation !== 0)
      list.push(new filters.Saturation({ saturation: state.saturation }))
    if (state.exposure !== 0)
      list.push(
        new filters.Gamma({
          gamma: [1 + state.exposure, 1 + state.exposure, 1 + state.exposure],
        })
      )
    if (state.blur > 0) list.push(new filters.Blur({ blur: state.blur }))
    if (state.grayscale) list.push(new filters.Grayscale())
    if (state.sepia) list.push(new filters.Sepia())
    if (state.invert) list.push(new filters.Invert())

    img.filters = list
    img.applyFilters()
    canvas.value.renderAll()
  }

  function resetFilters() {
    Object.assign(state, {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      exposure: 0,
      blur: 0,
      grayscale: false,
      sepia: false,
      invert: false,
    })
    applyFilters()
    onAfterFilter()
  }

  watch(state, () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      applyFilters()
    }, 50)
  })

  function commitFilters() {
    applyFilters()
    onAfterFilter()
  }

  return { state, applyFilters, resetFilters, commitFilters }
}
