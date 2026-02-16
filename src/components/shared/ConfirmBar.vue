<script lang="ts" setup>
defineProps<{
  applyLabel?: string
  cancelLabel?: string
}>()

const emit = defineEmits<{
  (e: 'apply'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div class="vuedit-confirm-bar">
    <button class="vuedit-btn vuedit-btn--secondary" @click="emit('cancel')">
      {{ cancelLabel || 'Cancel' }}
    </button>
    <button class="vuedit-btn vuedit-btn--primary" @click="emit('apply')">
      {{ applyLabel || 'Apply' }}
    </button>
  </div>
</template>
