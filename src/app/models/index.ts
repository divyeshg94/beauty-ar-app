// Product Models
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  shade: string;
  colorHex: string;
  thumbnail: string;
  price: number;
  description?: string;
}

export type ProductCategory = 
| 'lipstick' 
| 'eyeshadow' 
| 'blush' 
| 'foundation'
| 'eyeliner'
| 'highlighter';

// Skin Analysis Models
export interface SkinAnalysis {
  skinTone: SkinTone;
  undertone: 'warm' | 'cool' | 'neutral';
  texture: number; // 0-100
  hydration: number; // 0-100
  spots: number; // 0-100 (acne/blemishes)
  wrinkles: number; // 0-100
  pores: number; // 0-100
  recommendations: string[];
  timestamp: Date;
  skinAge?: number; // Apparent skin age
  overallScore?: number; // 0-100 overall health score
}

export interface SkinTone {
  hex: string;
  name: string;
  category: 'very-light' | 'light' | 'medium' | 'tan' | 'deep';
}

// Face Tracking Models
export interface FaceData {
  detected: boolean;
  confidence: number;
  landmarks: FaceLandmarks;
  boundingBox: BoundingBox;
}

export interface FaceLandmarks {
  leftEye: Point;
  rightEye: Point;
  nose: Point;
  mouth: Point;
  leftCheek: Point;
  rightCheek: Point;
  forehead: Point;
  chin: Point;
}

export interface Point {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// AR Engine Models
export interface ARConfig {
  apiKey: string;
  mode: 'realtime' | 'photo';
  features: ARFeature[];
}

export type ARFeature = 
  | 'face_tracking' 
  | 'skin_analysis' 
  | 'virtual_makeup' 
  | 'color_matching';

export interface MakeupApplication {
  id?: string;
  productId: string;
  category: ProductCategory;
  color: string;
  intensity: number; // 0-1
  blend: 'natural' | 'bold' | 'soft';
  appliedAt?: Date;
  isActive?: boolean;
  transition?: {
    duration: number; // ms
    easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  };
}

// AI Look Generation Models
export interface LookGenerationRequest {
  prompt: string;
  skinTone: string;
  faceShape: string;
  occasion?: string;
  preferences?: string[];
}

export interface GeneratedLook {
  id: string;
  name: string;
  description: string;
  products: Product[];
  steps: LookStep[];
  thumbnail?: string;
}

export interface LookStep {
  order: number;
  product: Product;
  application: string;
  intensity: number;
}

// Camera Models
export interface CameraConfig {
  facingMode: 'user' | 'environment';
  width: { ideal: number };
  height: { ideal: number };
  aspectRatio?: number;
  frameRate?: { ideal: number };
}

// API Response Models
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User Preferences
export interface UserPreferences {
  favoriteProducts: string[];
  savedLooks: string[];
  skinConcerns: string[];
  makeupStyle: 'natural' | 'glam' | 'bold' | 'minimal';
  notifications: boolean;
}

// State Models
export interface AppState {
  cameraActive: boolean;
  faceDetected: boolean;
  currentSkinAnalysis: SkinAnalysis | null;
  appliedProducts: Map<ProductCategory, Product>;
  isLoading: boolean;
  error: string | null;
}
