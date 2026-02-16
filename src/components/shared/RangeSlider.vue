<script lang="ts" setup>
const props = defineProps<{
  label: string
  modelValue: number
  min?: number
  max?: number
  step?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

function onInput(event: Event) {
  emit('update:modelValue', parseFloat((event.target as HTMLInputElement).value))
}
</script>

<template>
  <div class="vuedit-range">
    <div class="vuedit-range__header">
      <span class="vuedit-range__label">{{ label }}</span>
      <span class="vuedit-range__value">{{ modelValue }}</span>
    </div>
    <input
      type="range"
      :value="modelValue"
      :min="min ?? -1"
      :max="max ?? 1"
      :step="step ?? 0.01"
      @input="onInput"
    />
  </div>
</template>
