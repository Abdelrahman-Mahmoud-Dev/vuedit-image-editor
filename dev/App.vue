<script lang="ts" setup>
import { ref } from 'vue'
import { VueditImageEditor, VueditImageEditorModal } from '../src'

const imageUrl = ref('https://picsum.photos/800/600')
const modalOpen = ref(false)

function onSave(result: File | Blob | string | HTMLCanvasElement) {
  console.log('Saved:', result)
  if (result instanceof File) {
    console.log('File name:', result.name, 'size:', result.size, 'type:', result.type)
  }
  modalOpen.value = false
}
</script>

<template>
  <div style="padding: 20px;">
    <h1 style="margin-bottom: 16px;">Vuedit Image Editor - Dev Playground</h1>

    <div style="margin-bottom: 16px; display: flex; gap: 12px; align-items: center;">
      <input
        v-model="imageUrl"
        style="flex:1; padding: 8px; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px;"
        placeholder="Image URL"
      />
      <button
        style="padding: 8px 16px; background: #1B4965; color: #fff; border: none; border-radius: 4px; cursor: pointer;"
        @click="modalOpen = true"
      >
        Open Modal Editor
      </button>
    </div>

    <h2 style="margin-bottom: 12px;">Inline Editor</h2>
    <div style="height: 600px; border: 1px solid #333; border-radius: 8px; overflow: hidden;">
      <VueditImageEditor
        :src="imageUrl"
        output-format="file"
        locale="en"
        @save="onSave"
        @cancel="() => console.log('Cancelled')"
        @error="(e) => console.error('Error:', e)"
      />
    </div>

    <VueditImageEditorModal
      :open="modalOpen"
      :src="imageUrl"
      output-format="file"
      locale="en"
      @save="onSave"
      @close="modalOpen = false"
    />
  </div>
</template>
