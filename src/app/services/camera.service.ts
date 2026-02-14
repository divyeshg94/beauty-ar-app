import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CameraConfig } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private stream: MediaStream | null = null;
  private cameraActiveSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public cameraActive$: Observable<boolean> = this.cameraActiveSubject.asObservable();
  public error$: Observable<string | null> = this.errorSubject.asObservable();

  constructor() {}

  /**
   * Start camera with specified configuration
   */
  async startCamera(config: Partial<CameraConfig> = {}): Promise<MediaStream> {
    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported in this browser');
      }

      // Default camera configuration
      const defaultConfig: CameraConfig = {
        facingMode: 'user', // Front camera for selfie
        width: { ideal: 1280 },
        height: { ideal: 720 }
      };

      const finalConfig = { ...defaultConfig, ...config };

      // Request camera access
      console.log('📷 Requesting camera access...');
      
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: finalConfig.facingMode,
          width: finalConfig.width,
          height: finalConfig.height,
          aspectRatio: finalConfig.aspectRatio,
          frameRate: finalConfig.frameRate
        },
        audio: false
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      this.cameraActiveSubject.next(true);
      this.errorSubject.next(null);
      
      console.log('✅ Camera access granted');
      console.log('Stream settings:', this.stream.getVideoTracks()[0].getSettings());
      
      return this.stream;
      
    } catch (error: any) {
      console.error('❌ Camera access failed:', error);
      
      let errorMessage = 'Failed to access camera';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera permission denied. Please allow camera access.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Camera is already in use by another application.';
      }
      
      this.errorSubject.next(errorMessage);
      this.cameraActiveSubject.next(false);
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Stop camera and release resources
   */
  stopCamera(): void {
    if (this.stream) {
      console.log('⏹️ Stopping camera...');
      
      this.stream.getTracks().forEach(track => {
        track.stop();
      });
      
      this.stream = null;
      this.cameraActiveSubject.next(false);
      
      console.log('✅ Camera stopped');
    }
  }

  /**
   * Switch between front and back camera
   */
  async switchCamera(): Promise<MediaStream> {
    const currentFacingMode = this.getCurrentFacingMode();
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    
    this.stopCamera();
    
    return this.startCamera({ facingMode: newFacingMode });
  }

  /**
   * Get current camera facing mode
   */
  private getCurrentFacingMode(): 'user' | 'environment' {
    if (!this.stream) return 'user';
    
    const videoTrack = this.stream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();
    
    return (settings.facingMode as 'user' | 'environment') || 'user';
  }

  /**
   * Check if camera is currently active
   */
  isActive(): boolean {
    return this.cameraActiveSubject.value;
  }

  /**
   * Get current stream
   */
  getStream(): MediaStream | null {
    return this.stream;
  }

  /**
   * Capture a photo from the current video stream
   */
  capturePhoto(videoElement: HTMLVideoElement): string {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    
    // Draw current video frame
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Return as data URL
    return canvas.toDataURL('image/png');
  }

  /**
   * Check if device has multiple cameras
   */
  async hasMultipleCameras(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      return videoDevices.length > 1;
    } catch (error) {
      console.error('Failed to enumerate devices:', error);
      return false;
    }
  }
}
