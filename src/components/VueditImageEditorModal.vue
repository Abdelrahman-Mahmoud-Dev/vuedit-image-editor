<script lang="ts" setup>
import { ref, watch } from 'vue'
import VueditImageEditor from './VueditImageEditor.vue'
import type { ToolType, CropAspectRatio, ImageSource } from '@/types'
import type { VueditTranslations } from '@/i18n'

const props = withDefaults(
  defineProps<{
    open: boolean
    src: ImageSource
    outputFormat?: 'file' | 'blob' | 'dataurl' | 'canvas'
    outputMimeType?: string
    outputQuality?: number
    outputFileName?: string
    tools?: ToolType[]
    cropAspectRatios?: CropAspectRatio[]
    locale?: string | VueditTranslations
    dir?: 'ltr' | 'rtl' | 'auto'
  }>(),
  {
    outputFormat: 'file',
    outputMimeType: 'image/png',
    outputQuality: 0.92,
    outputFileName: 'edited-image',
    locale: 'en',
    dir: 'auto',
  }
)

const emit = defineEmits<{
  (e: 'save', result: File | Blob | string | HTMLCanvasElement): void
  (e: 'close'): void
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      dialogRef.value?.showModal()
    } else {
      dialogRef.value?.close()
    }
  }
)
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialogRef" class="vuedit-modal" @close="emit('close')">
      <VueditImageEditor
        v-if="open"
        :src="src"
        :output-format="outputFormat"
        :output-mime-type="outputMimeType"
        :output-quality="outputQuality"
        :output-file-name="outputFileName"
        :tools="tools"
        :crop-aspect-ratios="cropAspectRatios"
        :locale="locale"
        :dir="dir"
        @save="(result) => emit('save', result)"
        @cancel="emit('close')"
      />
    </dialog>
  </Teleport>
</template>
