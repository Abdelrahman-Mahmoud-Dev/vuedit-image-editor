<script lang="ts" setup>
defineProps<{
  label: string
  active?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button
    class="vuedit-tool-btn"
    :class="{ 'vuedit-tool-btn--active': active }"
    @click="emit('click')"
  >
    <span class="vuedit-tool-btn__icon">
      <slot />
    </span>
    <span class="vuedit-tool-btn__label">{{ label }}</span>
  </button>
</template>
