<script lang="ts" setup>
import type { ShapeConfig } from '@/types'
import type { TranslationKeys } from '@/i18n/en'
import RangeSlider from '../shared/RangeSlider.vue'
import ColorPicker from '../shared/ColorPicker.vue'

defineProps<{
  config: ShapeConfig
  t: (key: TranslationKeys) => string
}>()

const emit = defineEmits<{
  (e: 'update', key: keyof ShapeConfig, value: string | number): void
  (e: 'addShape'): void
}>()

const shapes = [
  { type: 'rect' as const, label: 'rectangle' as const },
  { type: 'circle' as const, label: 'circle' as const },
  { type: 'line' as const, label: 'line' as const },
  { type: 'arrow' as const, label: 'arrow' as const },
]
</script>

<template>
  <div>
    <div class="vuedit-panel__title">{{ t('shape') }}</div>

    <div class="vuedit-panel__section">
      <div class="vuedit-toggle-group">
        <button
          v-for="s in shapes"
          :key="s.type"
          class="vuedit-toggle"
          :class="{ 'vuedit-toggle--active': config.type === s.type }"
          @click="emit('update', 'type', s.type)"
        >{{ t(s.label) }}</button>
      </div>
    </div>

    <ColorPicker
      :label="t('strokeColor')"
      :model-value="config.strokeColor"
      @update:model-value="emit('update', 'strokeColor', $event)"
    />

    <ColorPicker
      :label="t('fillColor')"
      :model-value="config.fillColor"
      @update:model-value="emit('update', 'fillColor', $event)"
    />

    <div class="vuedit-panel__section">
      <RangeSlider
        :label="t('strokeWidth')"
        :model-value="config.strokeWidth"
        :min="1" :max="20" :step="1"
        @update:model-value="emit('update', 'strokeWidth', $event)"
      />
    </div>

    <div class="vuedit-panel__section">
      <button class="vuedit-btn vuedit-btn--primary" style="width:100%" @click="emit('addShape')">
        {{ t('shape') }}
      </button>
    </div>
  </div>
</template>
