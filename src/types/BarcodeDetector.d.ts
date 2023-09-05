declare class BarcodeDetector {
  constructor(options?: BarcodeDetectorOptions);

  static getSupportedFormats(): Promise<string[]>;

  detect(image: ImageBitmap | HTMLImageElement | HTMLVideoElement | CanvasImageSource): Promise<Barcode[]>;
}

interface BarcodeDetectorOptions {
  formats?: string[];
}

interface Barcode {
  rawValue: string;
  cornerPoints: DOMPoint[];
  boundingBox: DOMRectReadOnly;
  format: string;
}
