<script lang="ts" setup>
const props = defineProps<{
  modelValue: string
  label?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const presets = [
  '#ffffff', '#000000', '#ff0000', '#ff6600', '#ffcc00',
  '#33cc33', '#0099ff', '#6633cc', '#ff3399', '#999999',
]
</script>

<template>
  <div class="vuedit-panel__section">
    <label v-if="label" class="vuedit-panel__label">{{ label }}</label>
    <div class="vuedit-colors">
      <button
        v-for="color in presets"
        :key="color"
        class="vuedit-color-swatch"
        :class="{ 'vuedit-color-swatch--active': modelValue === color }"
        :style="{ background: color }"
        @click="emit('update:modelValue', color)"
      />
      <input
        type="color"
        :value="modelValue"
        class="vuedit-color-swatch"
        style="padding: 0; cursor: pointer;"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>
