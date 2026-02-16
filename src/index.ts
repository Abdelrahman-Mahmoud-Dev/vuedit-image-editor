import VueditImageEditor from './components/VueditImageEditor.vue'
import VueditImageEditorModal from './components/VueditImageEditorModal.vue'
import './styles/editor.css'

export { VueditImageEditor, VueditImageEditorModal }

export { useFabricCanvas } from './composables/useFabricCanvas'
export { useHistory } from './composables/useHistory'

export type {
  ImageSource,
  OutputFormat,
  ToolType,
  CropAspectRatio,
  ExportOptions,
  FilterState,
  BrushConfig,
  ShapeConfig,
  TextConfig,
} from './types'

export { defaultTranslations, mergeTranslations, resolveTranslations } from './i18n'
export type { VueditTranslations, TranslationKeys } from './i18n'
