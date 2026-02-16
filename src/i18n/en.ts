const en = {
  crop: 'Crop',
  rotate: 'Rotate',
  filter: 'Filter',
  text: 'Text',
  draw: 'Draw',
  shape: 'Shape',
  resize: 'Resize',

  save: 'Save',
  cancel: 'Cancel',
  apply: 'Apply',
  reset: 'Reset',
  undo: 'Undo',
  redo: 'Redo',
  zoomIn: 'Zoom In',
  zoomOut: 'Zoom Out',
  resetZoom: 'Reset Zoom',

  freeform: 'Freeform',
  original: 'Original',

  rotateLeft: 'Rotate Left',
  rotateRight: 'Rotate Right',
  flipHorizontal: 'Flip Horizontal',
  flipVertical: 'Flip Vertical',
  degrees: 'Degrees',

  brightness: 'Brightness',
  contrast: 'Contrast',
  saturation: 'Saturation',
  exposure: 'Exposure',
  blur: 'Blur',
  grayscale: 'Grayscale',
  sepia: 'Sepia',
  invert: 'Invert',

  addText: 'Add Text',
  fontFamily: 'Font',
  fontSize: 'Size',
  fontColor: 'Color',
  bold: 'Bold',
  italic: 'Italic',

  brushSize: 'Brush Size',
  brushColor: 'Color',
  opacity: 'Opacity',

  rectangle: 'Rectangle',
  circle: 'Circle',
  arrow: 'Arrow',
  line: 'Line',
  strokeColor: 'Stroke',
  fillColor: 'Fill',
  strokeWidth: 'Stroke Width',

  width: 'Width',
  height: 'Height',
  lockAspectRatio: 'Lock aspect ratio',
  pixels: 'px',
} as const

export type TranslationKeys = keyof typeof en

export default en
