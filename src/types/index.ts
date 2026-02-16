export type ImageSource = File | Blob | string

export type OutputFormat = 'file' | 'blob' | 'dataurl' | 'canvas'

export type ToolType =
  | 'crop'
  | 'rotate'
  | 'filter'
  | 'text'
  | 'draw'
  | 'shape'
  | 'resize'

export interface CropAspectRatio {
  label: string
  value: number | null
}

export interface ExportOptions {
  format: OutputFormat
  mimeType: string
  quality: number
  fileName: string
}

export interface FilterState {
  brightness: number
  contrast: number
  saturation: number
  exposure: number
  blur: number
  grayscale: boolean
  sepia: boolean
  invert: boolean
}

export interface BrushConfig {
  width: number
  color: string
  opacity: number
}

export interface ShapeConfig {
  type: 'rect' | 'circle' | 'arrow' | 'line'
  strokeColor: string
  fillColor: string
  strokeWidth: number
}

export interface TextConfig {
  text: string
  fontFamily: string
  fontSize: number
  fill: string
  fontWeight: 'normal' | 'bold'
  fontStyle: 'normal' | 'italic'
  textAlign: 'left' | 'center' | 'right'
}
