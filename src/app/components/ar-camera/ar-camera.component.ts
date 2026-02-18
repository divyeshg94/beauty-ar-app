import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraService } from '../../services/camera.service';
import { PerfectCorpArService } from '../../services/perfect-corp-ar.service';
import { SkinAnalysis } from '../../models';

@Component({
  selector: 'app-ar-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ar-camera.component.html',
  styleUrls: ['./ar-camera.component.scss']
})
export class ArCameraComponent implements OnInit, OnDestroy {
@ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
@ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

isLoading = true;
faceDetected = false;
cameraError: string | null = null;
hasMultipleCameras = false;

isAnalyzing = false;
skinAnalysis: SkinAnalysis | null = null;
analysisError: string | null = null;

constructor(
  private cameraService: CameraService,
  private arService: PerfectCorpArService
) {}

  async ngOnInit() {
    await this.initializeCamera();
    await this.checkMultipleCameras();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  async initializeCamera() {
    try {
      this.isLoading = true;
      
      // Initialize AR engine
      const arInitialized = await this.arService.initialize();
      if (!arInitialized) {
        throw new Error('Failed to initialize AR engine');
      }

      // Allow the AR service to capture frames from the active camera element (for Makeup VTO)
      this.arService.registerVideoElementProvider(() => this.videoElement?.nativeElement ?? null);

      // Start camera
      const stream = await this.cameraService.startCamera();
      
      // Wait for video element to be ready
      setTimeout(() => {
        if (this.videoElement && this.canvasElement) {
          const video = this.videoElement.nativeElement;
          const canvas = this.canvasElement.nativeElement;
          
          video.srcObject = stream;
          video.play();

          // Set canvas size to match video
          video.addEventListener('loadedmetadata', () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Start AR tracking
            this.arService.startTracking(video, canvas);
            
            this.isLoading = false;
          });

          // Subscribe to face detection
          this.arService.faceData$.subscribe(faceData => {
            this.faceDetected = faceData?.detected || false;
          });
        }
      }, 100);

    } catch (error: any) {
      console.error('Camera initialization failed:', error);
      this.cameraError = error.message || 'Failed to access camera';
      this.isLoading = false;
    }
  }

  private async checkMultipleCameras() {
    this.hasMultipleCameras = await this.cameraService.hasMultipleCameras();
  }

  async switchCamera() {
    try {
      this.isLoading = true;
      const stream = await this.cameraService.switchCamera();
      
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = stream;
      }
      
      this.isLoading = false;
    } catch (error) {
      console.error('Failed to switch camera:', error);
    }
  }

  capturePhoto() {
    if (!this.videoElement?.nativeElement) return;

    const dataUrl = this.cameraService.capturePhoto(this.videoElement.nativeElement);
    if (!dataUrl) return;

    const fileName = `ar-photo-${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
    this.downloadDataUrl(dataUrl, fileName);

    console.log('📷 Photo saved to downloads:', fileName);
  }

  private downloadDataUrl(dataUrl: string, fileName: string) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = fileName;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async analyzeSkin() {
    console.log('🔍 analyzeSkin() called');
    
    // Clear previous results and errors
    this.skinAnalysis = null;
    this.analysisError = null;
    
    if (!this.videoElement?.nativeElement) {
      console.error('❌ Video element not available');
      this.analysisError = 'Camera not available. Please refresh the page.';
      return;
    }
    
    console.log('✅ Video element found:', this.videoElement.nativeElement);
    console.log('📹 Video dimensions:', {
      width: this.videoElement.nativeElement.videoWidth,
      height: this.videoElement.nativeElement.videoHeight
    });
    
    this.isAnalyzing = true;
    
    try {
      console.log('📸 Capturing frame...');
      
      // Capture current frame
      const base64 = this.arService.captureFrameAsBase64(
        this.videoElement.nativeElement
      );
      
      console.log('✅ Frame captured, base64 length:', base64?.length || 0);
      
      if (!base64 || base64.length === 0) {
        throw new Error('Failed to capture frame - empty base64 data');
      }
      
      console.log('🔬 Starting analysis (this will take 3-5 seconds)...');
      
      // Analyze (takes 3-5 seconds)
      this.skinAnalysis = await this.arService.analyzePhotoForSkinWithTone(base64);
      
      console.log('✅ Analysis complete:', this.skinAnalysis);
      console.log('📊 Texture:', this.skinAnalysis?.texture);
      console.log('📊 Pores:', this.skinAnalysis?.pores);
      console.log('📊 Wrinkles:', this.skinAnalysis?.wrinkles);
      console.log('📊 Spots:', this.skinAnalysis?.spots);
      console.log('📊 Overall Score:', this.skinAnalysis?.overallScore);
      console.log('📊 Skin Age:', this.skinAnalysis?.skinAge);
      
    } catch (error: any) {
      console.error('❌ Analysis failed:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      
      // Set user-friendly error message
      this.analysisError = this.getErrorMessage(error.message);
      
      console.error('User-facing error:', this.analysisError);
      
    } finally {
      this.isAnalyzing = false;
      console.log('🏁 Analysis process finished');
    }
  }

  /**
   * Convert API error messages to user-friendly messages
   */
  private getErrorMessage(errorMsg: string): string {
    if (!errorMsg) {
      return 'An unknown error occurred. Please try again.';
    }

    const lower = errorMsg.toLowerCase();

    // Face size errors
    if (lower.includes('face too small') || lower.includes('face_too_small')) {
      return '📸 Face too small - Please move closer to the camera so your face fills more of the screen.';
    }

    // Face detection errors
    if (lower.includes('face') && lower.includes('not')) {
      return '👤 Face not detected - Make sure your face is clearly visible and well-lit.';
    }

    // Image quality errors
    if (lower.includes('image') || lower.includes('quality')) {
      return '🖼️ Image quality issue - Ensure the photo is clear and well-lit.';
    }

    // Timeout errors
    if (lower.includes('timeout')) {
      return '⏱️ Analysis timed out - The server is taking too long. Please try again.';
    }

    // Generic error with original message
    return `❌ Error: ${errorMsg}`;
  }

  /**
   * Clear error message
   */
  clearError() {
    this.analysisError = null;
  }

  /**
   * Clear results
   */
  clearResults() {
    this.skinAnalysis = null;
  }

  private stopCamera() {
    this.cameraService.stopCamera();
  }
}
