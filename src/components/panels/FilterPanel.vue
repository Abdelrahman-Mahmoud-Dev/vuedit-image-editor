<script lang="ts" setup>
import type { FilterState } from '@/types'
import type { TranslationKeys } from '@/i18n/en'
import RangeSlider from '../shared/RangeSlider.vue'

defineProps<{
  state: FilterState
  t: (key: TranslationKeys) => string
}>()

const emit = defineEmits<{
  (e: 'update', key: keyof FilterState, value: number | boolean): void
  (e: 'reset'): void
  (e: 'commit'): void
}>()
</script>

<template>
  <div>
    <div class="vuedit-panel__title">{{ t('filter') }}</div>

    <div class="vuedit-panel__section">
      <RangeSlider
        :label="t('brightness')"
        :model-value="state.brightness"
        :min="-1" :max="1" :step="0.01"
        @update:model-value="emit('update', 'brightness', $event)"
      />
    </div>
    <div class="vuedit-panel__section">
      <RangeSlider
        :label="t('contrast')"
        :model-value="state.contrast"
        :min="-1" :max="1" :step="0.01"
        @update:model-value="emit('update', 'contrast', $event)"
      />
    </div>
    <div class="vuedit-panel__section">
      <RangeSlider
        :label="t('saturation')"
        :model-value="state.saturation"
        :min="-1" :max="1" :step="0.01"
        @update:model-value="emit('update', 'saturation', $event)"
      />
    </div>
    <div class="vuedit-panel__section">
      <RangeSlider
        :label="t('exposure')"
        :model-value="state.exposure"
        :min="-1" :max="1" :step="0.01"
        @update:model-value="emit('update', 'exposure', $event)"
      />
    </div>
    <div class="vuedit-panel__section">
      <RangeSlider
        :label="t('blur')"
        :model-value="state.blur"
        :min="0" :max="1" :step="0.01"
        @update:model-value="emit('update', 'blur', $event)"
      />
    </div>

    <div class="vuedit-panel__section">
      <div class="vuedit-toggle-group">
        <button
          class="vuedit-toggle"
          :class="{ 'vuedit-toggle--active': state.grayscale }"
          @click="emit('update', 'grayscale', !state.grayscale)"
        >{{ t('grayscale') }}</button>
        <button
          class="vuedit-toggle"
          :class="{ 'vuedit-toggle--active': state.sepia }"
          @click="emit('update', 'sepia', !state.sepia)"
        >{{ t('sepia') }}</button>
        <button
          class="vuedit-toggle"
          :class="{ 'vuedit-toggle--active': state.invert }"
          @click="emit('update', 'invert', !state.invert)"
        >{{ t('invert') }}</button>
      </div>
    </div>

    <div class="vuedit-confirm-bar">
      <button class="vuedit-btn vuedit-btn--secondary" @click="emit('reset')">
        {{ t('reset') }}
      </button>
      <button class="vuedit-btn vuedit-btn--primary" @click="emit('commit')">
        {{ t('apply') }}
      </button>
    </div>
  </div>
</template>
