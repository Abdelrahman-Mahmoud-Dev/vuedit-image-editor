<script lang="ts" setup>
import type { ToolType } from '@/types'
import type { TranslationKeys } from '@/i18n/en'
import ToolButton from './ToolButton.vue'
import {
  CropIcon,
  RotateIcon,
  FilterIcon,
  TextIcon,
  DrawIcon,
  ShapeIcon,
  ResizeIcon,
} from '@/icons'

defineProps<{
  tools: ToolType[]
  activeTool: ToolType | null
  t: (key: TranslationKeys) => string
}>()

const emit = defineEmits<{
  (e: 'selectTool', tool: ToolType): void
}>()

const iconMap: Record<ToolType, any> = {
  crop: CropIcon,
  rotate: RotateIcon,
  filter: FilterIcon,
  text: TextIcon,
  draw: DrawIcon,
  shape: ShapeIcon,
  resize: ResizeIcon,
}

const labelMap: Record<ToolType, TranslationKeys> = {
  crop: 'crop',
  rotate: 'rotate',
  filter: 'filter',
  text: 'text',
  draw: 'draw',
  shape: 'shape',
  resize: 'resize',
}
</script>

<template>
  <div class="vuedit-toolbar">
    <ToolButton
      v-for="tool in tools"
      :key="tool"
      :label="t(labelMap[tool])"
      :active="activeTool === tool"
      @click="emit('selectTool', tool)"
    >
      <component :is="iconMap[tool]" />
    </ToolButton>
  </div>
</template>
