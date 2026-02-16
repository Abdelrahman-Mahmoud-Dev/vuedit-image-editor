<script lang="ts" setup>
import type { BrushConfig } from '@/types'
import type { TranslationKeys } from '@/i18n/en'
import RangeSlider from '../shared/RangeSlider.vue'
import ColorPicker from '../shared/ColorPicker.vue'

defineProps<{
  config: BrushConfig
  t: (key: TranslationKeys) => string
}>()

const emit = defineEmits<{
  (e: 'update', key: keyof BrushConfig, value: number | string): void
}>()
</script>

<template>
  <div>
    <div class="vuedit-panel__title">{{ t('draw') }}</div>

    <div class="vuedit-panel__section">
      <RangeSlider
        :label="t('brushSize')"
        :model-value="config.width"
        :min="1" :max="50" :step="1"
        @update:model-value="emit('update', 'width', $event)"
      />
    </div>

    <div class="vuedit-panel__section">
      <RangeSlider
        :label="t('opacity')"
        :model-value="config.opacity"
        :min="0" :max="1" :step="0.05"
        @update:model-value="emit('update', 'opacity', $event)"
      />
    </div>

    <ColorPicker
      :label="t('brushColor')"
      :model-value="config.color"
      @update:model-value="emit('update', 'color', $event)"
    />
  </div>
</template>
