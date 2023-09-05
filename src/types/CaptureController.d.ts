declare class CaptureController {
  constructor(options?: CaptureControllerOptions);

  startCapture(): Promise<void>;

  stopCapture(): Promise<void>;

  getPhotoCapabilities(): Promise<PhotoCapabilities>;

  getVideoCapabilities(): Promise<MediaTrackCapabilities>;

  getSettings(): Promise<MediaStreamTrackSettings>;

  setSettings(settings: MediaTrackSettings): Promise<void>;

  onstatechange: ((this: CaptureController, ev: Event) => any) | null;
}

interface CaptureControllerOptions {
  audio?: boolean | MediaTrackConstraints;
  video?: boolean | MediaTrackConstraints;
}

interface PhotoCapabilities {
  imageHeight: number;
  imageWidth: number;
  fillLightMode: string[];
  redEyeReduction: boolean;
  imageSizes: { width: number; height: number }[];
  zoom: number[];
}

interface MediaTrackSettings {
  width?: number;
  height?: number;
  aspectRatio?: number;
  frameRate?: number;
  facingMode?: string;
  resizeMode?: string;
}

interface MediaTrackCapabilities {
  width: { min: number; max: number };
  height: { min: number; max: number };
  aspectRatio: { min: number; max: number };
  frameRate: { min: number; max: number };
  facingMode: string[];
  resizeMode: string[];
  zoom: { min: number; max: number };
}
