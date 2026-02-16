# vuedit-image-editor

[![npm version](https://img.shields.io/npm/v/vuedit-image-editor.svg)](https://www.npmjs.com/package/vuedit-image-editor)
[![license](https://img.shields.io/npm/l/vuedit-image-editor.svg)](https://github.com/Abdelrahman-Mahmoud-Dev/vuedit-image-editor/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A feature-rich, Pintura-like image editor component for Vue 3, powered by Fabric.js.

## Features

- **Crop** - Free crop and predefined aspect ratios (1:1, 4:3, 16:9, 3:2)
- **Rotate & Flip** - 90° rotations, horizontal/vertical flip, custom angle rotation
- **Filters** - Brightness, contrast, saturation, exposure, blur, grayscale, sepia, invert
- **Text** - Add text with font family, size, color, bold/italic, alignment options
- **Draw** - Freehand drawing with configurable brush size, color, and opacity
- **Shapes** - Rectangle, circle, arrow, and line with stroke/fill customization
- **Resize** - Change dimensions with optional aspect ratio lock
- **Zoom** - Zoom in/out with mouse wheel support
- **Undo/Redo** - Full history with keyboard shortcuts
- **i18n** - Built-in English and Arabic, extensible to any language
- **RTL Support** - Automatic RTL layout for Arabic and similar locales
- **Two modes** - Inline editor and modal editor components

## Install

```bash
npm install vuedit-image-editor
```

**Peer dependency:** Vue 3.2+

## Quick Start

### Inline Editor

```vue
<script setup>
import { ref } from 'vue'
import { VueditImageEditor } from 'vuedit-image-editor'
import 'vuedit-image-editor/dist/style.css'

const imageUrl = ref('https://example.com/photo.jpg')

function onSave(result) {
  // result is a File by default
  console.log('Saved:', result.name, result.size)
}
</script>

<template>
  <div style="height: 600px;">
    <VueditImageEditor
      :src="imageUrl"
      output-format="file"
      @save="onSave"
      @cancel="() => console.log('Cancelled')"
      @error="(e) => console.error(e)"
    />
  </div>
</template>
```

### Modal Editor

```vue
<script setup>
import { ref } from 'vue'
import { VueditImageEditorModal } from 'vuedit-image-editor'
import 'vuedit-image-editor/dist/style.css'

const modalOpen = ref(false)

function onSave(result) {
  console.log('Saved:', result)
  modalOpen.value = false
}
</script>

<template>
  <button @click="modalOpen = true">Edit Image</button>

  <VueditImageEditorModal
    :open="modalOpen"
    src="https://example.com/photo.jpg"
    output-format="file"
    @save="onSave"
    @close="modalOpen = false"
  />
</template>
```

## Props

### VueditImageEditor

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string \| File \| Blob` | **required** | Image source |
| `outputFormat` | `'file' \| 'blob' \| 'dataurl' \| 'canvas'` | `'file'` | Export format |
| `outputMimeType` | `string` | `'image/png'` | Output MIME type |
| `outputQuality` | `number` | `0.92` | JPEG/WebP quality (0-1) |
| `outputFileName` | `string` | `'edited-image'` | Output file name |
| `tools` | `ToolType[]` | All tools | Which tools to show |
| `cropAspectRatios` | `CropAspectRatio[]` | Free, 1:1, 4:3, 16:9, 3:2 | Crop ratio options |
| `locale` | `string \| VueditTranslations` | `'en'` | Language or custom translations |
| `dir` | `'ltr' \| 'rtl' \| 'auto'` | `'auto'` | Text direction |

### VueditImageEditorModal

Same props as above, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | **required** | Controls modal visibility |

## Events

### VueditImageEditor

| Event | Payload | Description |
|-------|---------|-------------|
| `save` | `File \| Blob \| string \| HTMLCanvasElement` | Emitted when user clicks Save |
| `cancel` | — | Emitted when user clicks Cancel |
| `change` | `boolean` | Emitted when dirty state changes |
| `error` | `Error` | Emitted on errors (e.g. image load failure) |

### VueditImageEditorModal

| Event | Payload | Description |
|-------|---------|-------------|
| `save` | `File \| Blob \| string \| HTMLCanvasElement` | Emitted when user clicks Save |
| `close` | — | Emitted when modal is closed |

## Available Tools

Use the `tools` prop to control which tools appear:

```vue
<VueditImageEditor
  :src="imageUrl"
  :tools="['crop', 'rotate', 'filter']"
/>
```

| Tool | Description |
|------|-------------|
| `crop` | Crop with aspect ratio presets |
| `rotate` | Rotate and flip |
| `filter` | Image filters and effects |
| `text` | Add and edit text |
| `draw` | Freehand drawing |
| `shape` | Add shapes (rect, circle, arrow, line) |
| `resize` | Resize image dimensions |

## i18n

Built-in locales: `en` (English), `ar` (Arabic).

```vue
<!-- Use Arabic with automatic RTL -->
<VueditImageEditor :src="imageUrl" locale="ar" />
```

### Custom Translations

```js
import { mergeTranslations } from 'vuedit-image-editor'

const frenchLocale = mergeTranslations({}, {
  crop: 'Recadrer',
  rotate: 'Pivoter',
  filter: 'Filtre',
  save: 'Enregistrer',
  cancel: 'Annuler',
  // ...
})
```

```vue
<VueditImageEditor :src="imageUrl" :locale="frenchLocale" />
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` / `Ctrl+Shift+Z` | Redo |
| `Delete` / `Backspace` | Delete selected object |
| `Escape` | Deselect / clear active tool |

## Exports

```js
// Components
import { VueditImageEditor, VueditImageEditorModal } from 'vuedit-image-editor'

// Composables
import { useFabricCanvas, useHistory } from 'vuedit-image-editor'

// Types
import type {
  ImageSource,
  OutputFormat,
  ToolType,
  CropAspectRatio,
  ExportOptions,
  FilterState,
  BrushConfig,
  ShapeConfig,
  TextConfig,
  VueditTranslations,
  TranslationKeys,
} from 'vuedit-image-editor'

// i18n utilities
import { defaultTranslations, mergeTranslations, resolveTranslations } from 'vuedit-image-editor'
```

## License

[MIT](./LICENSE)
