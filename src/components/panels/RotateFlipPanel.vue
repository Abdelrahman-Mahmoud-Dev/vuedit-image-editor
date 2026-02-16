<script lang="ts" setup>
import type { TranslationKeys } from '@/i18n/en'
import RangeSlider from '../shared/RangeSlider.vue'
import { RotateLeftIcon, RotateRightIcon, FlipHIcon, FlipVIcon } from '@/icons'

defineProps<{
  rotation: number
  t: (key: TranslationKeys) => string
}>()

const emit = defineEmits<{
  (e: 'rotateLeft'): void
  (e: 'rotateRight'): void
  (e: 'flipH'): void
  (e: 'flipV'): void
  (e: 'setRotation', deg: number): void
}>()
</script>

<template>
  <div>
    <div class="vuedit-panel__title">{{ t('rotate') }}</div>

    <div class="vuedit-panel__section">
      <div class="vuedit-toggle-group">
        <button class="vuedit-toggle" :title="t('rotateLeft')" @click="emit('rotateLeft')">
          <RotateLeftIcon style="width:16px;height:16px" />
        </button>
        <button class="vuedit-toggle" :title="t('rotateRight')" @click="emit('rotateRight')">
          <RotateRightIcon style="width:16px;height:16px" />
        </button>
        <button class="vuedit-toggle" :title="t('flipHorizontal')" @click="emit('flipH')">
          <FlipHIcon style="width:16px;height:16px" />
        </button>
        <button class="vuedit-toggle" :title="t('flipVertical')" @click="emit('flipV')">
          <FlipVIcon style="width:16px;height:16px" />
        </button>
      </div>
    </div>

    <div class="vuedit-panel__section">
      <RangeSlider
        :label="t('degrees')"
        :model-value="rotation"
        :min="-180"
        :max="180"
        :step="1"
        @update:model-value="emit('setRotation', $event)"
      />
    </div>
  </div>
</template>
