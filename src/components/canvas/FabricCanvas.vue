<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasEl = ref<HTMLCanvasElement | null>(null)
const containerEl = ref<HTMLDivElement | null>(null)

defineExpose({
  canvasEl,
  containerEl,
})
</script>

<template>
  <div ref="containerEl" class="vuedit-canvas-area">
    <canvas ref="canvasEl" />
  </div>
</template>
