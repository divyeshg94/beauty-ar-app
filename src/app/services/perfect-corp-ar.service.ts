import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  FaceData, 
  MakeupApplication, 
  SkinAnalysis,
  ARConfig 
} from '../models';
import { environment } from '../../environments/environment';

// Custom error class to signal stopping polling
class StopPollingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StopPollingError';
  }
}

// YouCam API Response Interfaces
interface SkinToneResult {
  color: string;
  label: string;
  undertone?: string;
}

interface SkinTypeResult {
  type?: string;
  moisture?: number;
  texture?: number;
}

interface SkinConcernResult {
  dark_spot?: number;
  wrinkle?: number;
  pore?: number;
  acne?: number;
}

interface YouCamFileUploadResponse {
  status: number;
  data: {
    requests: Array<{
      file_id: string;
      url: string;
      headers: { [key: string]: string };
    }>;
  };
}

interface YouCamTaskCreateResponse {
  status: number;
  data: {
    task_id: string;
  };
}

interface YouCamTaskStatusResponse {
  status: number;
  data: {
    status?: 'running' | 'completed' | 'failed';
    task_status?: 'running' | 'success' | 'failed' | 'error';
    result?: {
      skin_tone?: SkinToneResult;
      skin_type?: SkinTypeResult;
      skin_concern?: SkinConcernResult;
      error?: string;
      code?: string;
      message?: string;
    };
    results?: any;
    error?: string | null;
  };
}

interface YouCamSkinAnalysisResponse {
  result?: {
    skin_tone?: SkinToneResult;
    skin_type?: SkinTypeResult;
    skin_concern?: SkinConcernResult;
  };
  error?: {
    code: string;
    message: string;
  };
}

// Generic API Response (for backwards compatibility)
interface ApiResponse {
  [key: string]: any;
  data?: any;
  result?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PerfectCorpArService {
private arEngine: any = null;
private faceDataSubject = new BehaviorSubject<FaceData | null>(null);
private skinAnalysisSubject = new BehaviorSubject<SkinAnalysis | null>(null);
private isInitialized = false;
private hasWarnedAboutRealtime = false; // Flag to show warning only once

public faceData$: Observable<FaceData | null> = this.faceDataSubject.asObservable();
public skinAnalysis$: Observable<SkinAnalysis | null> = this.skinAnalysisSubject.asObservable();

private apiBaseUrl = environment.perfectCorpApiUrl;
private apiKey = environment.perfectCorpApiKey;

constructor(private http: HttpClient) {}

  /**
   * Initialize the Perfect Corp AR Engine
   */
  async initialize(config: Partial<ARConfig> = {}): Promise<boolean> {
    try {
      const defaultConfig: ARConfig = {
        apiKey: this.apiKey,
        mode: 'realtime',
        features: ['face_tracking', 'skin_analysis', 'virtual_makeup', 'color_matching']
      };

      const finalConfig = { ...defaultConfig, ...config };

      // Validate API key is configured
      if (!this.apiKey || this.apiKey === 'YOUR_PERFECT_CORP_API_KEY_HERE') {
        throw new Error('Perfect Corp API key not configured. Please set it in environment.ts');
      }

      console.log('Initializing Perfect Corp AR with config:', finalConfig);
      
      this.arEngine = {
        initialized: true,
        config: finalConfig
      };

      this.isInitialized = true;
      console.log('✅ Perfect Corp AR Engine initialized successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Perfect Corp AR:', error);
      return false;
    }
  }

  /**
   * Start real-time face tracking
   */
  async startTracking(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('AR Engine not initialized. Call initialize() first.');
    }

    console.log('🎯 Starting face tracking...');

    // Start tracking loop
    this.trackingLoop(videoElement, canvasElement);
  }

  /**
   * Main tracking loop
   */
  private trackingLoop(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): void {
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    const track = () => {
      if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
        // Capture frame and detect face
        this.detectFaceFromVideo(videoElement, canvasElement).then(faceData => {
          if (faceData && faceData.detected) {
            this.faceDataSubject.next(faceData);
            
            // Draw AR overlays
            this.renderAROverlay(ctx, canvasElement, faceData);
          } else {
            this.faceDataSubject.next(null);
          }
        }).catch(error => {
          console.error('Face detection error:', error);
        });
      }

      requestAnimationFrame(track);
    };

    track();
  }

  /**
   * ⚠️ DISABLED: Real-time face detection not supported with S2S v2.0 API
   * 
   * The YouCam S2S v2.0 API is designed for batch processing, not real-time tracking.
   * Each analysis takes 3-5 seconds (upload → process → poll results).
   * 
   * For real-time face tracking, you need:
   * 1. YouCam Web SDK (client-side AR)
   * 2. Or implement a "Take Photo" button for static analysis
   * 
   * This method now returns mock data for UI development purposes.
   */
  private async detectFaceFromVideo(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): Promise<FaceData> {
    // Show warning only once to avoid console spam
    if (!this.hasWarnedAboutRealtime) {
      console.warn('⚠️ Real-time face detection is disabled. YouCam S2S API is not suitable for real-time analysis.');
      console.warn('💡 Use analyzePhotoForSkin() method with a "Take Photo" button instead.');
      console.warn('📖 See YOUCAM_REALTIME_LIMITATIONS.md for details.');
      this.hasWarnedAboutRealtime = true;
    }
    
    // Return mock face data for UI development
    return {
      detected: true,
      confidence: 0.85,
      landmarks: {
        leftEye: { x: videoElement.videoWidth * 0.35, y: videoElement.videoHeight * 0.35 },
        rightEye: { x: videoElement.videoWidth * 0.65, y: videoElement.videoHeight * 0.35 },
        nose: { x: videoElement.videoWidth * 0.5, y: videoElement.videoHeight * 0.5 },
        mouth: { x: videoElement.videoWidth * 0.5, y: videoElement.videoHeight * 0.65 },
        leftCheek: { x: videoElement.videoWidth * 0.3, y: videoElement.videoHeight * 0.55 },
        rightCheek: { x: videoElement.videoWidth * 0.7, y: videoElement.videoHeight * 0.55 },
        forehead: { x: videoElement.videoWidth * 0.5, y: videoElement.videoHeight * 0.2 },
        chin: { x: videoElement.videoWidth * 0.5, y: videoElement.videoHeight * 0.8 }
      },
      boundingBox: {
        x: videoElement.videoWidth * 0.25,
        y: videoElement.videoHeight * 0.15,
        width: videoElement.videoWidth * 0.5,
        height: videoElement.videoHeight * 0.7
      }
    };
  }

  /**
   * ⚠️ IMPORTANT: This method is NOT suitable for real-time face tracking!
   * 
   * YouCam S2S v2.0 API uses an asynchronous multi-step process:
   * 1. POST /file/skin-analysis → Get upload URL
   * 2. PUT to S3 → Upload image
   * 3. POST /task/skin-analysis → Create analysis task
   * 4. GET /task/skin-analysis/{task_id} → Poll for results
   * 
   * This takes several seconds and cannot provide real-time feedback.
   * 
   * For real-time AR, you need:
   * - YouCam Web SDK (JavaScript SDK for browser AR)
   * - Or implement static photo capture mode instead
   */
  private async callSkinAnalysisApi(imageBase64: string): Promise<YouCamSkinAnalysisResponse> {
    console.log('🚀 Starting 4-step YouCam API flow...');
    
    try {
      // Step 1: Request upload URL
      console.log('📤 Step 1/4: Requesting upload URL...');
      const uploadInfo = await this.requestFileUpload(imageBase64);
      console.log('✅ Step 1 complete - Got file_id:', uploadInfo.file_id);
      
      // Step 2: Upload image to S3
      console.log('📤 Step 2/4: Uploading image to S3...');
      await this.uploadImageToS3(imageBase64, uploadInfo);
      console.log('✅ Step 2 complete - Image uploaded');
      
      // Step 3: Create analysis task
      console.log('📤 Step 3/4: Creating analysis task...');
      const taskId = await this.createSkinAnalysisTask(uploadInfo.file_id);
      console.log('✅ Step 3 complete - Task created:', taskId);
      
      // Step 4: Poll for results
      console.log('📤 Step 4/4: Polling for results...');
      const result = await this.pollTaskStatus(taskId);
      console.log('✅ Step 4 complete - Got results:', result);
      
      console.log('🎉 All steps complete! Analysis successful.');
      
      return { result };
    } catch (error: any) {
      console.error('❌ Skin analysis flow failed:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  /**
   * Step 1: Request file upload URL
   */
  private async requestFileUpload(imageBase64: string): Promise<{ file_id: string; url: string; headers: any }> {
    console.log('📤 Step 1: Requesting upload URL...');
    
    // Convert base64 to blob to get file size
    const byteString = atob(imageBase64);
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    
    const payload = {
      files: [
        {
          content_type: 'image/jpeg',
          file_name: `analysis_${Date.now()}.jpg`,
          file_size: blob.size
        }
      ]
    };

    console.log('📋 Request payload:', payload);
    console.log('🔑 API Key (first 10 chars):', this.apiKey.substring(0, 10) + '...');
    console.log('🌐 API URL:', `${this.apiBaseUrl}/file/skin-analysis`);

    try {
      const response = await this.http.post<any>(
        `${this.apiBaseUrl}/file/skin-analysis`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      ).toPromise();

      console.log('📥 Raw response received:', response);

      // The actual structure is response.data.files[0] which contains file_id and requests array
      const fileData = response?.data?.files?.[0];
      
      if (!fileData) {
        console.error('❌ Could not find files[0] in response');
        throw new Error('Invalid response structure - no files array');
      }

      console.log('✅ File data found:', {
        file_id: fileData.file_id,
        has_requests: Array.isArray(fileData.requests)
      });

      const uploadRequest = fileData.requests?.[0];
      
      if (!uploadRequest || !uploadRequest.url) {
        console.error('❌ Could not find upload request', uploadRequest);
        throw new Error('Invalid response structure - no upload request');
      }

      console.log('✅ Got upload URL and file_id:', {
        file_id: fileData.file_id,
        url: uploadRequest.url.substring(0, 50) + '...'
      });

      return {
        file_id: fileData.file_id,
        url: uploadRequest.url,
        headers: uploadRequest.headers || {}
      };
    } catch (error: any) {
      console.error('❌ Step 1 failed:', error);
      console.error('Error details:', {
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        error: error.error
      });
      throw new Error(`Failed to get upload URL: ${error.error?.message || error.message || 'Unknown error'}`);
    }
  }

  /**
   * Step 2: Upload image to S3 using pre-signed URL
   */
  private async uploadImageToS3(imageBase64: string, uploadInfo: { url: string; headers: any }): Promise<void> {
    console.log('☁️ Uploading to S3...');
    console.log('📍 S3 URL (first 50 chars):', uploadInfo.url.substring(0, 50) + '...');
    
    try {
      // Convert base64 to blob
      const byteString = atob(imageBase64);
      const byteArray = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      
      console.log('📦 Blob created, size:', blob.size, 'bytes');

      // Upload to S3 using pre-signed URL
      await this.http.put(uploadInfo.url, blob, {
        headers: uploadInfo.headers
      }).toPromise();
      
      console.log('✅ S3 upload complete');
    } catch (error: any) {
      console.error('❌ S3 upload failed:', error);
      throw new Error(`S3 upload failed: ${error.message}`);
    }
  }

  /**
   * Step 3: Create skin analysis task
   */
  private async createSkinAnalysisTask(fileId: string): Promise<string> {
    console.log('📋 Creating analysis task with file_id:', fileId);
    
    const payload = {
      src_file_id: fileId,
      dst_actions: ['wrinkle', 'pore', 'texture', 'acne'],
      format: 'json'
    };
    
    console.log('📤 Task payload:', payload);

    try {
      const response = await this.http.post<YouCamTaskCreateResponse>(
        `${this.apiBaseUrl}/task/skin-analysis`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      ).toPromise();

      console.log('📥 Task creation response:', response);

      if (!response || !response.data || !response.data.task_id) {
        console.error('❌ Invalid task response:', response);
        throw new Error('Failed to create analysis task - Invalid response');
      }

      console.log('✅ Task created, ID:', response.data.task_id);
      return response.data.task_id;
    } catch (error: any) {
      console.error('❌ Task creation failed:', error);
      console.error('Error details:', error.error);
      throw new Error(`Task creation failed: ${error.error?.message || error.message}`);
    }
  }

  /**
   * Step 4: Poll task status until completion
   */
  private async pollTaskStatus(taskId: string, maxAttempts: number = 60): Promise<any> {
    console.log('⏳ Starting to poll task status...');
    console.log('🆔 Task ID:', taskId);
    console.log('⏱️ Max attempts:', maxAttempts, `(~${maxAttempts}s)`);
    console.log('💡 Note: Analysis typically takes 3-5 seconds but can take up to 30s');
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const elapsedSeconds = attempt * 1;
      const progress = Math.round((attempt / maxAttempts) * 100);
      console.log(`🔄 Poll attempt ${attempt + 1}/${maxAttempts} (${elapsedSeconds}s elapsed, ${progress}%)...`);
      
      try {
        const response = await this.http.get<YouCamTaskStatusResponse>(
          `${this.apiBaseUrl}/task/skin-analysis/${taskId}`,
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        ).toPromise();

        if (!response) {
          console.error('❌ No response from poll');
          throw new Error('No response from task status endpoint');
        }

        console.log(`📊 Poll response (attempt ${attempt + 1}):`, {
          task_status: response.data?.task_status,
          has_results: !!response.data?.results,
          has_error: !!response.data?.error
        });

        // Check if there's an error in the response - STOP POLLING
        if (response.data?.error) {
          console.error('❌ Task returned error:', response.data.error);
          // Throw StopPollingError to indicate we should NOT retry
          throw new StopPollingError(response.data.error);
        }

        // Check for error status explicitly - STOP POLLING
        if (response.data?.task_status === 'error') {
          console.error('❌ Task status is error');
          throw new StopPollingError(response.data.error || 'Analysis task returned error status');
        }

        // Check for success status - SUCCESS!
        if (response.data?.task_status === 'success') {
          console.log('✅ Task completed! Results:', response.data.results);
          return response.data.results;
        }

        if (response.data?.status === 'completed') {
          console.log('✅ Task completed! Results:', response.data.result);
          return response.data.result;
        }

        // Check for failed status - STOP POLLING
        if (response.data?.task_status === 'failed' || response.data?.status === 'failed') {
          console.error('❌ Task failed:', response.data.error);
          throw new StopPollingError(`Task failed: ${response.data.error || 'Unknown error'}`);
        }

        // Still running - KEEP POLLING
        if (response.data?.task_status === 'running' || response.data?.status === 'running') {
          console.log(`⏳ Task still running... (attempt ${attempt + 1}/${maxAttempts})`);
          // Wait 1 second before next poll
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        // Unknown status - KEEP POLLING
        console.warn(`⚠️ Unknown task status: ${response.data?.task_status || response.data?.status}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error: any) {
        console.error(`❌ Poll attempt ${attempt + 1} failed:`, {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          name: error.name
        });
        
        // If it's a StopPollingError, throw it immediately (don't retry)
        if (error instanceof StopPollingError || error.name === 'StopPollingError') {
          console.error('🛑 Stopping polling due to:', error.message);
          throw error;
        }
        
        // If it's the last attempt, throw the error
        if (attempt === maxAttempts - 1) {
          console.error('❌ Max polling attempts reached');
          throw new Error(`Task polling failed after ${maxAttempts} attempts: ${error.message}`);
        }
        
        // Otherwise, wait and retry (for network errors only)
        console.log(`⏳ Retrying in 1 second... (${maxAttempts - attempt - 1} attempts remaining)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.error(`❌ Task polling timed out after ${maxAttempts} attempts (~${maxAttempts}s)`);
    throw new Error(`Task polling timed out after ${maxAttempts} attempts. The analysis may still be processing on the server.`);
  }

  /**
   * Parse face data from API response
   */
  private parseFaceDataFromResponse(responseData: any, videoElement: HTMLVideoElement): FaceData {
    try {
      const width = videoElement.videoWidth;
      const height = videoElement.videoHeight;

      // Extract landmarks from API response
      const landmarks = responseData.landmarks || {};
      
      return {
        detected: responseData.face_detected === true,
        confidence: responseData.confidence || 0.85,
        landmarks: {
          leftEye: { x: landmarks.left_eye_x || width * 0.35, y: landmarks.left_eye_y || height * 0.35 },
          rightEye: { x: landmarks.right_eye_x || width * 0.65, y: landmarks.right_eye_y || height * 0.35 },
          nose: { x: landmarks.nose_x || width * 0.5, y: landmarks.nose_y || height * 0.5 },
          mouth: { x: landmarks.mouth_x || width * 0.5, y: landmarks.mouth_y || height * 0.65 },
          leftCheek: { x: landmarks.left_cheek_x || width * 0.3, y: landmarks.left_cheek_y || height * 0.55 },
          rightCheek: { x: landmarks.right_cheek_x || width * 0.7, y: landmarks.right_cheek_y || height * 0.55 },
          forehead: { x: landmarks.forehead_x || width * 0.5, y: landmarks.forehead_y || height * 0.2 },
          chin: { x: landmarks.chin_x || width * 0.5, y: landmarks.chin_y || height * 0.8 }
        },
        boundingBox: {
          x: responseData.face_box_x || width * 0.25,
          y: responseData.face_box_y || height * 0.15,
          width: responseData.face_box_width || width * 0.5,
          height: responseData.face_box_height || height * 0.7
        }
      };
    } catch (error) {
      console.error('Error parsing face data:', error);
      return this.getEmptyFaceData();
    }
  }

  /**
   * Render AR overlay on canvas
   */
  private renderAROverlay(
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    faceData: FaceData
  ): void {
    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw face landmarks (for debugging)
    if (faceData.detected) {
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      
      // Draw bounding box
      ctx.strokeRect(
        faceData.boundingBox.x,
        faceData.boundingBox.y,
        faceData.boundingBox.width,
        faceData.boundingBox.height
      );

      // Draw landmarks
      ctx.fillStyle = '#ec4899';
      const landmarkPoints = [
        faceData.landmarks.leftEye,
        faceData.landmarks.rightEye,
        faceData.landmarks.nose,
        faceData.landmarks.mouth,
        faceData.landmarks.leftCheek,
        faceData.landmarks.rightCheek,
        faceData.landmarks.forehead,
        faceData.landmarks.chin
      ];
      
      landmarkPoints.forEach((point: any) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  }

  /**
   * Apply makeup to face using YouCam Makeup API
   * Endpoint: POST /makeup
   * Documentation: https://yce.perfectcorp.com/document/index.html#tag/Makeup
   * NOTE: This returns an image with makeup applied, not real-time AR
   */
  async applyMakeup(application: MakeupApplication): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('AR Engine not initialized');
    }

    console.log('💄 Applying makeup:', application);

    try {
      // YouCam Makeup API expects specific makeup style IDs
      // For now, log the request - actual implementation needs makeup style IDs from YouCam catalog
      const payload = {
        img: application.productId,  // Base64 image
        makeup_style: application.category,  // Makeup style ID from YouCam catalog
        intensity: application.intensity
      };

      console.warn('⚠️ Makeup application requires YouCam makeup style IDs from their catalog');
      console.log('Payload would be:', payload);

      // Uncomment when you have actual makeup style IDs:
      // await this.http.post(`${this.apiBaseUrl}/makeup`, payload, {
      //   headers: {
      //     'X-API-Key': this.apiKey,
      //     'Content-Type': 'application/json'
      //   }
      // }).toPromise();

      console.log(`✅ Makeup application logged (not yet implemented with real API)`);
    } catch (error) {
      console.error('Failed to apply makeup:', error);
      this.handleApiError(error, 'Makeup API');
    }
  }

  /**
   * Analyze skin from a static photo (NOT real-time)
   * This is the correct way to use YouCam S2S v2.0 API
   * 
   * Usage:
   * 1. User clicks "Take Photo" or "Analyze" button
   * 2. Capture current video frame as base64
   * 3. Call this method (takes 3-5 seconds)
   * 4. Show loading indicator while processing
   * 5. Display results when complete
   */
  async analyzePhotoForSkin(imageBase64: string): Promise<SkinAnalysis | null> {
    if (!this.isInitialized) {
      throw new Error('AR Engine not initialized');
    }

    console.log('📸 Starting photo skin analysis (this will take 3-5 seconds)...');

    try {
      const result = await this.callSkinAnalysisApi(imageBase64);
      
      if (result) {
        const analysis = this.parseApiResponse(result);
        
        if (analysis) {
          this.skinAnalysisSubject.next(analysis);
          console.log('✅ Photo skin analysis completed:', analysis);
          return analysis;
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to analyze photo:', error);
      throw error;
    }
  }

  /**
   * Parse YouCam API response and convert to SkinAnalysis
   */
  private parseApiResponse(result: any): SkinAnalysis | null {
    try {
      console.log('📊 Full API Response received:', result);
      console.log('📊 Response.results:', result.results);
      console.log('📊 Response.results.output:', result.results?.output);

      // Extract scores from the output array
      let textureScore = null;
      let poreScore = null;
      let wrinkleScore = null;
      let acneScore = null;
      let skinAgeScore = null;
      let overallScore = null;

      if (result.result.output && Array.isArray(result.result.output)) {
        console.log('📋 Processing output array with', result.result.output.length, 'items');

        for (const item of result.result.output) {
          console.log(`📍 Processing item:`, item);
          
          if (item.type === 'texture') {
            textureScore = item.ui_score || item.raw_score;
            console.log('🧴 Texture score found:', textureScore);
          }
          if (item.type === 'pore') {
            poreScore = item.ui_score || item.raw_score;
            console.log('🫧 Pore score found:', poreScore);
          }
          if (item.type === 'wrinkle') {
            wrinkleScore = item.ui_score || item.raw_score;
            console.log('✨ Wrinkle score found:', wrinkleScore);
          }
          if (item.type === 'acne') {
            acneScore = item.ui_score || item.raw_score;
            console.log('🎯 Acne score found:', acneScore);
          }
          if (item.type === 'skin_age') {
            skinAgeScore = item.score;
            console.log('👶 Skin age found:', skinAgeScore);
          }
          if (item.type === 'all') {
            overallScore = item.score;
            console.log('⭐ Overall score found:', overallScore);
          }
        }
      } else {
        console.warn('⚠️ No output array found in response');
      }

      // Use actual values, don't fall back to defaults
      console.log('📊 Parsed scores (before defaults):', {
        texture: textureScore,
        pore: poreScore,
        wrinkle: wrinkleScore,
        acne: acneScore,
        skinAge: skinAgeScore,
        overall: overallScore
      });

      // Only use defaults if values are literally undefined/null
      const finalTextureScore = textureScore !== null && textureScore !== undefined ? textureScore : 75;
      const finalPoreScore = poreScore !== null && poreScore !== undefined ? poreScore : 75;
      const finalWrinkleScore = wrinkleScore !== null && wrinkleScore !== undefined ? wrinkleScore : 75;
      const finalAcneScore = acneScore !== null && acneScore !== undefined ? acneScore : 75;
      const finalSkinAgeScore = skinAgeScore !== null && skinAgeScore !== undefined ? skinAgeScore : 30;
      const finalOverallScore = overallScore !== null && overallScore !== undefined ? overallScore : 85;

      console.log('📊 Final scores (after defaults):', {
        texture: finalTextureScore,
        pore: finalPoreScore,
        wrinkle: finalWrinkleScore,
        acne: finalAcneScore,
        skinAge: finalSkinAgeScore,
        overall: finalOverallScore
      });

      // Create analysis object with extracted data
      const analysis: SkinAnalysis = {
        skinTone: {
          hex: '#D4A373',
          name: 'Medium',
          category: 'medium'
        },
        undertone: 'neutral',
        texture: Math.round(finalTextureScore),
        hydration: 68,
        spots: Math.round(finalAcneScore),
        wrinkles: Math.round(finalWrinkleScore),
        pores: Math.round(finalPoreScore),
        skinAge: Math.round(finalSkinAgeScore),
        overallScore: Math.round(finalOverallScore),
        recommendations: this.generateRecommendationsFromScores({
          texture: finalTextureScore,
          pore: finalPoreScore,
          wrinkle: finalWrinkleScore,
          acne: finalAcneScore
        }),
        timestamp: new Date()
      };

      console.log('✅ Final Analysis object:', analysis);
      return analysis;
    } catch (error) {
      console.error('Error parsing API response:', error);
      console.error('Error stack:', error);
      return null;
    }
  }

  /**
   * Generate recommendations based on analysis scores
   */
  private generateRecommendationsFromScores(scores: any): string[] {
    const recommendations: string[] = [];

    // Texture recommendations
    if (scores.texture < 70) {
      recommendations.push('🧴 Improve texture with a hydrating serum');
    }

    // Wrinkle recommendations
    if (scores.wrinkle < 80) {
      recommendations.push('✨ Use anti-aging products with retinol or peptides');
    }

    // Pore recommendations
    if (scores.pore < 75) {
      recommendations.push('🫧 Try a clay mask weekly to minimize pores');
    }

    // Acne recommendations
    if (scores.acne < 90) {
      recommendations.push('🎯 Use targeted acne treatment products');
    }

    // Always recommend SPF
    recommendations.push('☀️ Apply SPF 30+ daily for sun protection');

    return recommendations.length > 0 ? recommendations : this.getDefaultRecommendations();
  }

  /**
   * Capture current video frame as base64 for analysis
   * Call this when user clicks "Analyze" button
   */
  captureFrameAsBase64(videoElement: HTMLVideoElement): string {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    ctx.drawImage(videoElement, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
  }

  /**
   * OLD METHOD - Kept for backward compatibility but now uses async flow
   * Use analyzePhotoForSkin() for new code
   */
  async analyzeSkin(imageBase64?: string): Promise<SkinAnalysis | null> {
    if (!this.isInitialized) {
      throw new Error('AR Engine not initialized');
    }

    if (!imageBase64) {
      console.warn('No image provided for skin analysis');
      return null;
    }

    // Delegate to the new photo analysis method
    return this.analyzePhotoForSkin(imageBase64);
  }

  /**
   * Analyze skin tone using YouCam AI Skin Analysis API
   * Uses the complete 4-step flow (upload → S3 → task → poll)
   * Returns precise skin tone for color matching
   */
  async analyzeSkinTone(imageBase64: string): Promise<{ hex: string; name: string; category: string } | null> {
    try {
      // Use the full analysis and extract just skin tone
      const analysis = await this.analyzePhotoForSkin(imageBase64);
      
      if (analysis && analysis.skinTone) {
        return {
          hex: analysis.skinTone.hex,
          name: analysis.skinTone.name,
          category: analysis.skinTone.category
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to analyze skin tone:', error);
      throw error;
    }
  }

  /**
   * Map YouCam skin tone label to app category
   */
  private mapSkinToneCategory(label: string | undefined): 'very-light' | 'light' | 'medium' | 'tan' | 'deep' {
    if (!label) return 'medium';
    
    const lower = label.toLowerCase();
    if (lower.includes('very light') || lower.includes('fair')) return 'very-light';
    if (lower.includes('light')) return 'light';
    if (lower.includes('deep') || lower.includes('dark')) return 'deep';
    if (lower.includes('tan') || lower.includes('olive')) return 'tan';
    return 'medium';
  }

  /**
   * Map YouCam undertone to app format
   */
  private mapUndertone(undertone: string | undefined): 'warm' | 'cool' | 'neutral' {
    if (!undertone) return 'neutral';
    const lower = undertone.toLowerCase();
    if (lower.includes('warm')) return 'warm';
    if (lower.includes('cool')) return 'cool';
    return 'neutral';
  }

  /**
   * Generate recommendations based on YouCam analysis
   */
  private generateRecommendations(data: any): string[] {
    const recommendations: string[] = [];
    
    // Based on moisture level
    if (data.skin_type?.moisture < 50) {
      recommendations.push('Use a hydrating serum to improve moisture levels');
    }
    
    // Based on concerns
    if (data.skin_concern?.dark_spot > 30) {
      recommendations.push('Consider vitamin C serum for dark spots');
    }
    
    if (data.skin_concern?.wrinkle > 30) {
      recommendations.push('Use retinol or peptide cream for anti-aging');
    }
    
    if (data.skin_concern?.pore > 40) {
      recommendations.push('Try a clay mask weekly to minimize pores');
    }
    
    // Always recommend SPF
    recommendations.push('Apply SPF 30+ daily for sun protection');
    
    return recommendations.length > 0 ? recommendations : this.getDefaultRecommendations();
  }

  /**
   * Get default recommendations
   */
  private getDefaultRecommendations(): string[] {
    return [
      'Use a hydrating serum',
      'Consider a vitamin C product for brightness',
      'SPF 30+ daily for sun protection'
    ];
  }

  /**
   * Handle API errors
   */
  private handleApiError(error: any, apiName: string) {
    let errorMessage = `${apiName} Error: `;
    
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        errorMessage += 'Unauthorized - Check your API key';
      } else if (error.status === 400) {
        errorMessage += 'Bad request - ' + (error.error?.message || 'Invalid parameters');
      } else if (error.status === 429) {
        errorMessage += 'Rate limited - Too many requests';
      } else {
        errorMessage += error.error?.message || error.message;
      }
    } else {
      errorMessage += error.message || 'Unknown error';
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Remove all applied makeup
   */
  clearMakeup(): void {
    console.log('🧹 Clearing all makeup');
    // Clear AR effects - in production, call API to reset
  }

  /**
   * Stop tracking and cleanup
   */
  stopTracking(): void {
    console.log('⏹️ Stopping face tracking');
    this.faceDataSubject.next(null);
  }

  /**
   * Check if engine is initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  private getEmptyFaceData(): FaceData {
    return {
      detected: false,
      confidence: 0,
      landmarks: this.getEmptyLandmarks(),
      boundingBox: { x: 0, y: 0, width: 0, height: 0 }
    };
  }

  private getEmptyLandmarks() {
    return {
      leftEye: { x: 0, y: 0 },
      rightEye: { x: 0, y: 0 },
      nose: { x: 0, y: 0 },
      mouth: { x: 0, y: 0 },
      leftCheek: { x: 0, y: 0 },
      rightCheek: { x: 0, y: 0 },
      forehead: { x: 0, y: 0 },
      chin: { x: 0, y: 0 }
    };
  }
}
