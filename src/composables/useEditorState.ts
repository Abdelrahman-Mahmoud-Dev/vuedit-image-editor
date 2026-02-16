import { ref, computed } from 'vue'
import type { ToolType } from '@/types'

export function useEditorState() {
  const activeTool = ref<ToolType | null>(null)

  function setTool(tool: ToolType | null) {
    activeTool.value = activeTool.value === tool ? null : tool
  }

  function clearTool() {
    activeTool.value = null
  }

  return { activeTool, setTool, clearTool }
}
