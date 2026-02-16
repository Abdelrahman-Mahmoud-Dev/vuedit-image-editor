<script lang="ts" setup>
import type { TextConfig } from '@/types'
import type { TranslationKeys } from '@/i18n/en'
import ColorPicker from '../shared/ColorPicker.vue'

defineProps<{
  config: TextConfig
  t: (key: TranslationKeys) => string
}>()

const emit = defineEmits<{
  (e: 'update', key: keyof TextConfig, value: string | number): void
  (e: 'addText'): void
}>()

const fonts = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Verdana',
  'Impact',
  'Comic Sans MS',
]
</script>

<template>
  <div>
    <div class="vuedit-panel__title">{{ t('text') }}</div>

    <div class="vuedit-panel__section">
      <label class="vuedit-panel__label">{{ t('fontFamily') }}</label>
      <select
        class="vuedit-select"
        :value="config.fontFamily"
        @change="emit('update', 'fontFamily', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="font in fonts" :key="font" :value="font">{{ font }}</option>
      </select>
    </div>

    <div class="vuedit-panel__section">
      <label class="vuedit-panel__label">{{ t('fontSize') }}</label>
      <input
        type="number"
        class="vuedit-input"
        :value="config.fontSize"
        min="8"
        max="200"
        @input="emit('update', 'fontSize', parseInt(($event.target as HTMLInputElement).value) || 24)"
      />
    </div>

    <ColorPicker
      :label="t('fontColor')"
      :model-value="config.fill"
      @update:model-value="emit('update', 'fill', $event)"
    />

    <div class="vuedit-panel__section">
      <div class="vuedit-toggle-group">
        <button
          class="vuedit-toggle"
          :class="{ 'vuedit-toggle--active': config.fontWeight === 'bold' }"
          @click="emit('update', 'fontWeight', config.fontWeight === 'bold' ? 'normal' : 'bold')"
        ><strong>B</strong></button>
        <button
          class="vuedit-toggle"
          :class="{ 'vuedit-toggle--active': config.fontStyle === 'italic' }"
          @click="emit('update', 'fontStyle', config.fontStyle === 'italic' ? 'normal' : 'italic')"
        ><em>I</em></button>
      </div>
    </div>

    <div class="vuedit-panel__section">
      <button class="vuedit-btn vuedit-btn--primary" style="width:100%" @click="emit('addText')">
        {{ t('addText') }}
      </button>
    </div>
  </div>
</template>
