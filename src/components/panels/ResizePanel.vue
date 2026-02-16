<script lang="ts" setup>
import type { TranslationKeys } from '@/i18n/en'
import ConfirmBar from '../shared/ConfirmBar.vue'

defineProps<{
  width: number
  height: number
  lockRatio: boolean
  t: (key: TranslationKeys) => string
}>()

const emit = defineEmits<{
  (e: 'setWidth', v: number): void
  (e: 'setHeight', v: number): void
  (e: 'toggleLock'): void
  (e: 'apply'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div>
    <div class="vuedit-panel__title">{{ t('resize') }}</div>

    <div class="vuedit-panel__section">
      <label class="vuedit-panel__label">{{ t('width') }} ({{ t('pixels') }})</label>
      <input
        type="number"
        class="vuedit-input"
        :value="width"
        min="1"
        max="10000"
        @input="emit('setWidth', parseInt(($event.target as HTMLInputElement).value) || 1)"
      />
    </div>

    <div class="vuedit-panel__section">
      <label class="vuedit-panel__label">{{ t('height') }} ({{ t('pixels') }})</label>
      <input
        type="number"
        class="vuedit-input"
        :value="height"
        min="1"
        max="10000"
        @input="emit('setHeight', parseInt(($event.target as HTMLInputElement).value) || 1)"
      />
    </div>

    <div class="vuedit-panel__section">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
        <input
          type="checkbox"
          :checked="lockRatio"
          @change="emit('toggleLock')"
        />
        <span class="vuedit-panel__label" style="margin:0">{{ t('lockAspectRatio') }}</span>
      </label>
    </div>

    <ConfirmBar
      :apply-label="t('apply')"
      :cancel-label="t('cancel')"
      @apply="emit('apply')"
      @cancel="emit('cancel')"
    />
  </div>
</template>
