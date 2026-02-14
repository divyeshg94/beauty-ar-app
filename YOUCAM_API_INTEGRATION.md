# YouCam API Integration Guide

## Overview
This document explains how the AI Beauty Assistant app integrates with the YouCam (Perfect Corp) API Platform for real-time makeup try-on and skin analysis.

## API Configuration

### 1. Get Your API Key
1. Visit: https://yce.perfectcorp.com/?affiliate=202602DevWeekHackathon
2. Register and get your free API key
3. Note your API endpoint URL

### 2. Update Environment Files

**`src/environments/environment.ts`** (Development):
```typescript
export const environment = {
  production: false,
  perfectCorpApiKey: 'YOUR_ACTUAL_API_KEY_HERE',
  perfectCorpApiUrl: 'https://api.perfectcorp.com/v1',
  youComApiKey: 'YOUR_YOU_COM_API_KEY_HERE',
  deepgramApiKey: 'YOUR_DEEPGRAM_API_KEY_HERE'
};
```

**`src/environments/environment.prod.ts`** (Production):
```typescript
export const environment = {
  production: true,
  perfectCorpApiKey: 'YOUR_ACTUAL_API_KEY_HERE',
  perfectCorpApiUrl: 'https://api.perfectcorp.com/v1',
  youComApiKey: 'YOUR_YOU_COM_API_KEY_HERE',
  deepgramApiKey: 'YOUR_DEEPGRAM_API_KEY_HERE'
};
```

## Integrated APIs

### 1. ? AI Makeup Virtual Try-On API
**Endpoint:** `/makeup-vto`
**Location:** `src/app/services/perfect-corp-ar.service.ts` - `applyMakeup()` method

**What it does:**
- Applies makeup effects in real-time to detected faces
- Supports multiple makeup categories

**Available Effects:**
```typescript
{
  'lipstick': 'LipColorEffect',
  'eyeshadow': 'EyeshadowEffect',
  'blush': 'BlushEffect',
  'foundation': 'FoundationEffect',
  'highlighter': 'HighlighterEffect',
  'eyeliner': 'EyelinerEffect',
  'mascara': 'EyelashesEffect',
  'eyebrows': 'EyebrowsEffect',
  'contour': 'ContourEffect',
  'bronzer': 'BronzerEffect',
  'concealer': 'ConcealerEffect',
  'lip_liner': 'LipLinerEffect'
}
```

**Request Payload:**
```json
{
  "effect_type": "LipColorEffect",
  "color_hex": "#D42D32",
  "intensity": 0.8,
  "blend_mode": "natural"
}
```

**Usage in App:**
- **Component:** `ProductShelfComponent`
- **Trigger:** When user clicks on a product to try it on
- **Feature:** Real-time virtual makeup preview

---

### 2. ? Skin Analysis API
**Endpoint:** `/skin-analysis`
**Location:** `src/app/services/perfect-corp-ar.service.ts` - `analyzeSkin()` method

**What it does:**
- Analyzes skin conditions and characteristics
- Returns comprehensive skin metrics
- Provides personalized recommendations

**Request Payload:**
```json
{
  "image": "base64_encoded_image",
  "return_landmarks": true
}
```

**Returns:**
```json
{
  "face_detected": true,
  "confidence": 0.95,
  "skin_tone_hex": "#D4A373",
  "skin_tone_name": "Medium Warm",
  "skin_tone_category": "medium",
  "undertone": "warm",
  "texture_score": 75,
  "hydration_score": 68,
  "spots_score": 25,
  "wrinkles_score": 15,
  "pores_score": 40,
  "landmarks": {
    "left_eye_x": 100,
    "left_eye_y": 150,
    "right_eye_x": 200,
    "right_eye_y": 150,
    "nose_x": 150,
    "nose_y": 180,
    "mouth_x": 150,
    "mouth_y": 220,
    "left_cheek_x": 80,
    "left_cheek_y": 190,
    "right_cheek_x": 220,
    "right_cheek_y": 190,
    "forehead_x": 150,
    "forehead_y": 100,
    "chin_x": 150,
    "chin_y": 260
  },
  "recommendations": [
    "Use a hydrating serum",
    "Consider a vitamin C product for brightness",
    "SPF 30+ daily for sun protection"
  ]
}
```

**Usage in App:**
- **Component:** `SkinAnalysisOverlayComponent`
- **Triggered:** Auto-runs after 2 seconds of face detection
- **Display:** Shows skin tone, hydration, texture metrics and recommendations

---

### 3. Skin Tone Analysis API
**Endpoint:** `/skin-tone-analysis`
**Location:** `src/app/services/perfect-corp-ar.service.ts` - `analyzeSkinTone()` method

**What it does:**
- Precise skin tone detection
- Returns hex color and category
- Used for product color matching

**Request Payload:**
```json
{
  "image": "base64_encoded_image"
}
```

**Returns:**
```json
{
  "skin_tone_hex": "#D4A373",
  "skin_tone_name": "Medium Warm",
  "skin_tone_category": "medium"
}
```

**Usage in App:**
- **Service:** `AiLookGeneratorService`
- **Purpose:** Color-match products to user's skin tone for AI-generated looks

---

## Service Integration

### PerfectCorpArService
**File:** `src/app/services/perfect-corp-ar.service.ts`

**Key Methods:**
```typescript
// Initialize AR engine
async initialize(config?: Partial<ARConfig>): Promise<boolean>

// Start face tracking
async startTracking(videoElement, canvasElement): Promise<void>

// Apply makeup effect
async applyMakeup(application: MakeupApplication): Promise<void>

// Analyze skin
async analyzeSkin(imageBase64?: string): Promise<SkinAnalysis | null>

// Analyze skin tone
async analyzeSkinTone(imageBase64: string): Promise<{hex, name, category}>

// Clear makeup
clearMakeup(): void

// Stop tracking
stopTracking(): void
```

**Observables:**
```typescript
// Subscribe to face detection
this.arService.faceData$: Observable<FaceData | null>

// Subscribe to skin analysis results
this.arService.skinAnalysis$: Observable<SkinAnalysis | null>
```

---

## Error Handling

The service includes comprehensive error handling:

### HTTP Status Code Handling:
- **401 Unauthorized:** Check API key configuration
- **400 Bad Request:** Invalid parameters or image format
- **429 Rate Limited:** Too many requests - implement retry logic
- **5xx Server Error:** YouCam service issue

### Example Error Response:
```typescript
try {
  await this.arService.analyzeSkin(imageBase64);
} catch (error) {
  // Error message will include specific failure reason
  console.error(error.message);
  // 'Skin Analysis API Error: Unauthorized - Check your API key'
}
```

---

## Video Frame Capture

The service automatically:
1. Captures frames from the video stream
2. Converts to base64 JPEG
3. Sends to API for analysis
4. Updates UI with results

```typescript
// Happens in the tracking loop
const tempCanvas = document.createElement('canvas');
tempCanvas.width = videoElement.videoWidth;
tempCanvas.height = videoElement.videoHeight;

const ctx = tempCanvas.getContext('2d');
ctx.drawImage(videoElement, 0, 0);
const imageBase64 = tempCanvas.toDataURL('image/jpeg').split(',')[1];

// Send to API
await this.callSkinAnalysisApi(imageBase64);
```

---

## Response Mapping

API responses are automatically mapped to app models:

### FaceData Mapping:
```typescript
// API Response ? FaceData Model
{
  face_detected: true        ? detected: boolean
  confidence: 0.95           ? confidence: number
  landmarks: {...}           ? landmarks: FaceLandmarks
  face_box_x/y/width/height ? boundingBox: BoundingBox
}
```

### SkinAnalysis Mapping:
```typescript
// API Response ? SkinAnalysis Model
{
  skin_tone_hex             ? skinTone.hex
  skin_tone_name            ? skinTone.name
  skin_tone_category        ? skinTone.category
  undertone                 ? undertone
  texture_score             ? texture (0-100)
  hydration_score           ? hydration (0-100)
  spots_score               ? spots (0-100)
  wrinkles_score            ? wrinkles (0-100)
  pores_score               ? pores (0-100)
  recommendations: [...]    ? recommendations: string[]
}
```

---

## Usage Examples

### Example 1: Applying Lipstick
```typescript
// In ProductShelfComponent
async applyProduct(product: Product) {
  await this.arService.applyMakeup({
    productId: product.id,
    category: 'lipstick',
    color: '#D42D32',  // Red lipstick
    intensity: 0.8,
    blend: 'natural'
  });
}
```

### Example 2: Getting Skin Analysis
```typescript
// In SkinAnalysisOverlayComponent
async refresh() {
  const analysis = await this.arService.analyzeSkin();
  if (analysis) {
    console.log(`Skin Tone: ${analysis.skinTone.name}`);
    console.log(`Hydration: ${analysis.hydration}%`);
    console.log(`Recommendations:`, analysis.recommendations);
  }
}
```

### Example 3: Color Matching for AI Looks
```typescript
// In AiLookGeneratorService
async generateLook(request: LookGenerationRequest) {
  // Get user's skin tone for color matching
  const skinTone = await this.arService.analyzeSkinTone(imageBase64);
  
  // Generate look with colors matched to their skin tone
  // Colors from skinTone are used to filter/adjust product recommendations
  return this.generatePersonalizedLook(request, skinTone);
}
```

---

## Testing the Integration

### Test Case 1: Face Detection
1. Start app with camera access enabled
2. Position face in front of camera
3. Should see "Face Detected" indicator at top
4. Face landmarks should draw on canvas

### Test Case 2: Product Try-On
1. Wait for skin analysis to complete
2. Click on a product in the shelf
3. Should see makeup effect applied in real-time
4. Color should update on preview

### Test Case 3: Skin Analysis
1. App should automatically analyze skin after 2 seconds
2. Check overlay for metrics (hydration, texture, etc.)
3. Should show personalized recommendations

---

## API Rate Limits & Best Practices

- **Rate Limit:** Typically 100 requests/minute (verify with YouCam)
- **Batch Requests:** Don't send multiple frames per second
- **Image Size:** Use reasonable image sizes (not >10MB)
- **Error Retry:** Implement exponential backoff for retries
- **Caching:** Cache skin tone analysis for session

---

## Troubleshooting

### "API key not configured" Error
**Solution:** Update environment files with actual API key

### "Unauthorized" (401) Response
**Solution:** Verify API key is correct and hasn't expired

### "Bad Request" (400) Response
**Solution:** Check image format/size or endpoint parameters

### Face Detection Not Working
**Solution:** 
- Ensure good lighting
- Position face centered in frame
- Check camera permissions

---

## Production Deployment

Before deploying to production:

1. ? Replace placeholder API keys
2. ? Update API URLs to production endpoints
3. ? Implement rate limiting/caching
4. ? Add error reporting/monitoring
5. ? Test all APIs with real data
6. ? Add loading spinners for API calls
7. ? Implement offline fallbacks
8. ? Add analytics tracking

---

## References

- YouCam API Documentation: https://yce.perfectcorp.com/
- DeveloperWeek Hackathon: https://yce.perfectcorp.com/?affiliate=202602DevWeekHackathon
- API Response Formats: Check YouCam API docs for latest schema
