<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { ToolType, CropAspectRatio, ImageSource, FilterState, TextConfig, BrushConfig, ShapeConfig } from '@/types'
import { resolveTranslations, type VueditTranslations } from '@/i18n'
import FabricCanvas from './canvas/FabricCanvas.vue'
import EditorToolbar from './toolbar/EditorToolbar.vue'
import CropPanel from './panels/CropPanel.vue'
import RotateFlipPanel from './panels/RotateFlipPanel.vue'
import FilterPanel from './panels/FilterPanel.vue'
import TextPanel from './panels/TextPanel.vue'
import DrawPanel from './panels/DrawPanel.vue'
import ShapePanel from './panels/ShapePanel.vue'
import ResizePanel from './panels/ResizePanel.vue'
import { UndoIcon, RedoIcon, ZoomInIcon, ZoomOutIcon } from '@/icons'
import { useFabricCanvas } from '@/composables/useFabricCanvas'
import { useHistory } from '@/composables/useHistory'
import { useEditorState } from '@/composables/useEditorState'
import { useCrop } from '@/composables/useCrop'
import { useRotateFlip } from '@/composables/useRotateFlip'
import { useFilters } from '@/composables/useFilters'
import { useText } from '@/composables/useText'
import { useDraw } from '@/composables/useDraw'
import { useShapes } from '@/composables/useShapes'
import { useResize } from '@/composables/useResize'
import { useZoom } from '@/composables/useZoom'

const props = withDefaults(
  defineProps<{
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
    tools: () => ['crop', 'rotate', 'filter', 'text', 'draw', 'shape', 'resize'],
    cropAspectRatios: () => [
      { label: 'Free', value: null },
      { label: '1:1', value: 1 },
      { label: '4:3', value: 4 / 3 },
      { label: '16:9', value: 16 / 9 },
      { label: '3:2', value: 3 / 2 },
    ],
    locale: 'en',
    dir: 'auto',
  }
)

const emit = defineEmits<{
  (e: 'save', result: File | Blob | string | HTMLCanvasElement): void
  (e: 'cancel'): void
  (e: 'change', dirty: boolean): void
  (e: 'error', error: Error): void
}>()

const t = resolveTranslations(props.locale)
const direction = computed(() => {
  if (props.dir !== 'auto') return props.dir
  return typeof props.locale === 'string' && props.locale === 'ar' ? 'rtl' : 'ltr'
})

const fabricCanvasRef = ref<InstanceType<typeof FabricCanvas> | null>(null)

// Core composables
const {
  canvas,
  originalImage,
  isLoading,
  imageWidth,
  imageHeight,
  init,
  fitToContainer,
  loadImage,
  exportImage,
  dispose,
} = useFabricCanvas()

const { canUndo, canRedo, saveState, undo, redo, clearHistory } = useHistory(canvas)
const { activeTool, setTool, clearTool } = useEditorState()

// Tool composables
const crop = useCrop(canvas, originalImage, saveState)
const rotateFlip = useRotateFlip(canvas, originalImage, saveState)
const filterTool = useFilters(canvas, originalImage, saveState)
const textTool = useText(canvas, saveState)
const drawTool = useDraw(canvas, saveState)
const shapeTool = useShapes(canvas, saveState)
const resizeTool = useResize(canvas, originalImage, imageWidth, imageHeight, saveState)
const zoomTool = useZoom(canvas)

// Handle tool switching side effects
watch(activeTool, (newTool, oldTool) => {
  // Clean up old tool
  if (oldTool === 'draw') drawTool.disableDrawing()
  if (oldTool === 'crop') crop.cancelCrop()

  // Set up new tool
  if (newTool === 'draw') drawTool.enableDrawing()
  if (newTool === 'crop') crop.startCrop(props.cropAspectRatios[0])
  if (newTool === 'resize') resizeTool.initResize()
})

// Load image
onMounted(async () => {
  await nextTick()
  if (fabricCanvasRef.value?.canvasEl && fabricCanvasRef.value?.containerEl) {
    init(fabricCanvasRef.value.canvasEl, fabricCanvasRef.value.containerEl)
    zoomTool.enableWheelZoom()
    try {
      await loadImage(props.src)
      clearHistory()
      saveState()
    } catch (err) {
      emit('error', err as Error)
    }
  }
})

watch(
  () => props.src,
  async (newSrc) => {
    if (newSrc && canvas.value) {
      try {
        await loadImage(newSrc)
        clearHistory()
        saveState()
      } catch (err) {
        emit('error', err as Error)
      }
    }
  }
)

// Resize handler
let resizeObserver: ResizeObserver | null = null
onMounted(() => {
  if (fabricCanvasRef.value?.containerEl) {
    resizeObserver = new ResizeObserver(() => {
      if (fabricCanvasRef.value?.containerEl) {
        fitToContainer(fabricCanvasRef.value.containerEl)
      }
    })
    resizeObserver.observe(fabricCanvasRef.value.containerEl)
  }
})

// Keyboard shortcuts
function onKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      undo()
    } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
      e.preventDefault()
      redo()
    }
  }
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (canvas.value?.getActiveObject()) {
      const active = canvas.value.getActiveObject()
      if (active && active !== originalImage.value) {
        canvas.value.remove(active)
        canvas.value.renderAll()
        saveState()
      }
    }
  }
  if (e.key === 'Escape') {
    clearTool()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  resizeObserver?.disconnect()
  dispose()
})

// Actions
async function handleSave() {
  try {
    // Deactivate any tool to ensure clean export
    if (activeTool.value === 'draw') drawTool.disableDrawing()
    if (activeTool.value === 'crop') crop.cancelCrop()
    clearTool()

    const result = await exportImage({
      format: props.outputFormat,
      mimeType: props.outputMimeType,
      quality: props.outputQuality,
      fileName: props.outputFileName,
    })
    emit('save', result)
  } catch (err) {
    emit('error', err as Error)
  }
}

// Panel event handlers
function onFilterUpdate(key: keyof FilterState, value: number | boolean) {
  ;(filterTool.state as any)[key] = value
}

function onTextUpdate(key: keyof TextConfig, value: string | number) {
  ;(textTool.config as any)[key] = value
  textTool.updateSelectedText()
}

function onDrawUpdate(key: keyof BrushConfig, value: number | string) {
  ;(drawTool.config as any)[key] = value
}

function onShapeUpdate(key: keyof ShapeConfig, value: string | number) {
  ;(shapeTool.config as any)[key] = value
}
</script>

<template>
  <div class="vuedit-editor" :dir="direction">
    <!-- Header: undo/redo + zoom + save/cancel -->
    <div class="vuedit-header">
      <div class="vuedit-header__history">
        <button class="vuedit-btn--icon" :disabled="!canUndo" :title="t('undo')" @click="undo">
          <UndoIcon style="width:18px;height:18px" />
        </button>
        <button class="vuedit-btn--icon" :disabled="!canRedo" :title="t('redo')" @click="redo">
          <RedoIcon style="width:18px;height:18px" />
        </button>
        <span style="width:1px;height:24px;background:var(--vuedit-color-border);margin:0 4px" />
        <button class="vuedit-btn--icon" :title="t('zoomIn')" @click="zoomTool.zoomIn()">
          <ZoomInIcon style="width:18px;height:18px" />
        </button>
        <button class="vuedit-btn--icon" :title="t('zoomOut')" @click="zoomTool.zoomOut()">
          <ZoomOutIcon style="width:18px;height:18px" />
        </button>
        <span style="font-size:12px;color:var(--vuedit-color-text-muted);min-width:40px;text-align:center">
          {{ Math.round(zoomTool.zoomLevel.value * 100) }}%
        </span>
      </div>
      <div class="vuedit-header__actions">
        <button class="vuedit-btn vuedit-btn--secondary" @click="emit('cancel')">
          {{ t('cancel') }}
        </button>
        <button class="vuedit-btn vuedit-btn--primary" @click="handleSave">
          {{ t('save') }}
        </button>
      </div>
    </div>

    <!-- Body: panel + canvas -->
    <div class="vuedit-body">
      <div v-if="activeTool" class="vuedit-panel">
        <CropPanel
          v-if="activeTool === 'crop'"
          :aspect-ratios="cropAspectRatios"
          :selected-ratio="crop.selectedRatio.value"
          :is-cropping="crop.isCropping.value"
          :t="t"
          @select-ratio="(r) => { crop.setAspectRatio(r); crop.startCrop(r) }"
          @apply="crop.applyCrop"
          @cancel="crop.cancelCrop"
        />
        <RotateFlipPanel
          v-else-if="activeTool === 'rotate'"
          :rotation="rotateFlip.rotation.value"
          :t="t"
          @rotate-left="rotateFlip.rotate90('left')"
          @rotate-right="rotateFlip.rotate90('right')"
          @flip-h="rotateFlip.flipHorizontal"
          @flip-v="rotateFlip.flipVertical"
          @set-rotation="rotateFlip.setRotation"
        />
        <FilterPanel
          v-else-if="activeTool === 'filter'"
          :state="filterTool.state"
          :t="t"
          @update="onFilterUpdate"
          @reset="filterTool.resetFilters"
          @commit="filterTool.commitFilters"
        />
        <TextPanel
          v-else-if="activeTool === 'text'"
          :config="textTool.config"
          :t="t"
          @update="onTextUpdate"
          @add-text="textTool.addText"
        />
        <DrawPanel
          v-else-if="activeTool === 'draw'"
          :config="drawTool.config"
          :t="t"
          @update="onDrawUpdate"
        />
        <ShapePanel
          v-else-if="activeTool === 'shape'"
          :config="shapeTool.config"
          :t="t"
          @update="onShapeUpdate"
          @add-shape="shapeTool.addShape"
        />
        <ResizePanel
          v-else-if="activeTool === 'resize'"
          :width="resizeTool.newWidth.value"
          :height="resizeTool.newHeight.value"
          :lock-ratio="resizeTool.lockRatio.value"
          :t="t"
          @set-width="resizeTool.setWidth"
          @set-height="resizeTool.setHeight"
          @toggle-lock="resizeTool.lockRatio.value = !resizeTool.lockRatio.value"
          @apply="resizeTool.applyResize"
          @cancel="clearTool"
        />
      </div>

      <FabricCanvas ref="fabricCanvasRef" />
    </div>

    <!-- Bottom Toolbar -->
    <EditorToolbar
      :tools="tools"
      :active-tool="activeTool"
      :t="t"
      @select-tool="setTool"
    />
  </div>
</template>
