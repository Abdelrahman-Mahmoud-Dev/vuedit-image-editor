<script lang="ts" setup>
import type { CropAspectRatio } from '@/types'
import type { TranslationKeys } from '@/i18n/en'
import ConfirmBar from '../shared/ConfirmBar.vue'

defineProps<{
  aspectRatios: CropAspectRatio[]
  selectedRatio: CropAspectRatio | null
  isCropping: boolean
  t: (key: TranslationKeys) => string
}>()

const emit = defineEmits<{
  (e: 'selectRatio', ratio: CropAspectRatio): void
  (e: 'apply'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div>
    <div class="vuedit-panel__title">{{ t('crop') }}</div>
    <div class="vuedit-panel__section">
      <div class="vuedit-aspect-ratios">
        <button
          v-for="ratio in aspectRatios"
          :key="ratio.label"
          class="vuedit-aspect-chip"
          :class="{ 'vuedit-aspect-chip--active': selectedRatio?.label === ratio.label }"
          @click="emit('selectRatio', ratio)"
        >
          {{ ratio.label }}
        </button>
      </div>
    </div>
    <ConfirmBar
      v-if="isCropping"
      :apply-label="t('apply')"
      :cancel-label="t('cancel')"
      @apply="emit('apply')"
      @cancel="emit('cancel')"
    />
  </div>
</template>
