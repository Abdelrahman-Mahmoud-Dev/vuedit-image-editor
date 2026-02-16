import { ref, computed, type ShallowRef } from 'vue'
import type { Canvas } from 'fabric'

export function useHistory(canvas: ShallowRef<Canvas | null>, maxStates = 50) {
  const states = ref<string[]>([])
  const currentIndex = ref(-1)
  const isRestoring = ref(false)

  const canUndo = computed(() => currentIndex.value > 0)
  const canRedo = computed(() => currentIndex.value < states.value.length - 1)

  function saveState() {
    if (isRestoring.value || !canvas.value) return
    states.value = states.value.slice(0, currentIndex.value + 1)
    const json = JSON.stringify(canvas.value.toJSON())
    states.value.push(json)
    if (states.value.length > maxStates) {
      states.value.shift()
    } else {
      currentIndex.value++
    }
  }

  async function restoreState(index: number) {
    if (!canvas.value || index < 0 || index >= states.value.length) return
    isRestoring.value = true
    currentIndex.value = index
    await canvas.value.loadFromJSON(states.value[index])
    canvas.value.renderAll()
    isRestoring.value = false
  }

  function undo() {
    if (canUndo.value) restoreState(currentIndex.value - 1)
  }

  function redo() {
    if (canRedo.value) restoreState(currentIndex.value + 1)
  }

  function clearHistory() {
    states.value = []
    currentIndex.value = -1
  }

  return { canUndo, canRedo, saveState, undo, redo, clearHistory }
}
