# YouCam API Request/Response Examples

## 1. Makeup Virtual Try-On API

### Endpoint
```
POST /makeup-vto
```

### Request Headers
```http
X-API-Key: your-perfect-corp-api-key
Content-Type: application/json
```

### Request Body Examples

#### Apply Lipstick
```json
{
  "effect_type": "LipColorEffect",
  "color_hex": "#D42D32",
  "intensity": 0.8,
  "blend_mode": "natural"
}
```

#### Apply Eyeshadow
```json
{
  "effect_type": "EyeshadowEffect",
  "color_hex": "#708090",
  "intensity": 0.7,
  "blend_mode": "soft"
}
```

#### Apply Blush
```json
{
  "effect_type": "BlushEffect",
  "color_hex": "#FFB7A8",
  "intensity": 0.6,
  "blend_mode": "natural"
}
```

#### Apply Foundation
```json
{
  "effect_type": "FoundationEffect",
  "color_hex": "#C9A18A",
  "intensity": 0.9,
  "blend_mode": "natural"
}
```

### Success Response (200)
```json
{
  "success": true,
  "message": "Makeup applied successfully",
  "effect_applied": "LipColorEffect"
}
```

### Error Response (400)
```json
{
  "success": false,
  "error": "Invalid color_hex format",
  "message": "Color hex must be in format #RRGGBB"
}
```

### Error Response (401)
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or missing API key"
}
```

---

## 2. Skin Analysis API

### Endpoint
```
POST /skin-analysis
```

### Request Headers
```http
X-API-Key: your-perfect-corp-api-key
Content-Type: application/json
```

### Request Body
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...",
  "return_landmarks": true,
  "analyze_concerns": true
}
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "face_detected": true,
    "confidence": 0.9547,
    "skin_tone_hex": "#D4A373",
    "skin_tone_name": "Medium Warm",
    "skin_tone_category": "medium",
    "undertone": "warm",
    "texture_score": 75,
    "hydration_score": 68,
    "spots_score": 25,
    "wrinkles_score": 15,
    "pores_score": 40,
    "dark_circles": 30,
    "face_box_x": 120,
    "face_box_y": 100,
    "face_box_width": 400,
    "face_box_height": 500,
    "landmarks": {
      "left_eye_x": 220,
      "left_eye_y": 200,
      "right_eye_x": 420,
      "right_eye_y": 200,
      "nose_x": 320,
      "nose_y": 280,
      "mouth_x": 320,
      "mouth_y": 380,
      "left_cheek_x": 180,
      "left_cheek_y": 300,
      "right_cheek_x": 460,
      "right_cheek_y": 300,
      "forehead_x": 320,
      "forehead_y": 120,
      "chin_x": 320,
      "chin_y": 440,
      "left_ear_x": 100,
      "left_ear_y": 250,
      "right_ear_x": 540,
      "right_ear_y": 250,
      "left_eyebrow_x": 210,
      "left_eyebrow_y": 160,
      "right_eyebrow_x": 430,
      "right_eyebrow_y": 160
    },
    "recommendations": [
      "Use a hydrating serum to improve skin hydration levels",
      "Apply vitamin C product for brightness and antioxidant protection",
      "Use SPF 30+ daily for sun protection",
      "Consider a gentle exfoliant 2x per week for texture",
      "Stay hydrated by drinking plenty of water"
    ]
  }
}
```

### Error Response - No Face Detected (200)
```json
{
  "success": true,
  "data": {
    "face_detected": false,
    "confidence": 0.0,
    "message": "No face detected in image"
  }
}
```

### Error Response - Invalid Image (400)
```json
{
  "success": false,
  "error": "Invalid image format",
  "message": "Image must be in base64 JPEG or PNG format"
}
```

---

## 3. Skin Tone Analysis API

### Endpoint
```
POST /skin-tone-analysis
```

### Request Headers
```http
X-API-Key: your-perfect-corp-api-key
Content-Type: application/json
```

### Request Body
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA...",
  "region": "face"  // Optional: "face", "arm", "torso"
}
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "skin_tone_hex": "#D4A373",
    "skin_tone_name": "Medium Warm",
    "skin_tone_category": "medium",
    "undertone": "warm",
    "undertone_confidence": 0.87,
    "closest_shades": [
      {
        "hex": "#C9A18A",
        "name": "Nude Beige",
        "match_percentage": 95
      },
      {
        "hex": "#D8A3B8",
        "name": "Rosy Mauve",
        "match_percentage": 88
      },
      {
        "hex": "#FFB7A8",
        "name": "Peachy Pink",
        "match_percentage": 85
      }
    ]
  }
}
```

### Error Response (401)
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "API key is invalid or expired"
}
```

---

## Real-World Example: Complete Flow

### 1. User opens app
```
Request: POST /skin-analysis
Body: { image: "base64...", return_landmarks: true }
Response: Face detected, landmarks returned
?
Display face indicator at top
```

### 2. User waits 2 seconds
```
Request: POST /skin-analysis (auto-triggered)
Response: Skin metrics (hydration: 68, texture: 75, etc.)
?
Display skin analysis overlay
```

### 3. User clicks on a product (Red Lipstick)
```
Request: POST /makeup-vto
Body: { effect_type: "LipColorEffect", color_hex: "#D42D32", intensity: 0.8, blend_mode: "natural" }
Response: { success: true }
?
Show lipstick applied with animation
```

### 4. User clicks "AI Looks"
```
Request: POST /skin-tone-analysis
Body: { image: "base64..." }
Response: skin_tone_hex: "#D4A373"
?
Generate look with complementary colors for warm skin tone
```

---

## cURL Examples for Testing

### Test Makeup VTO
```bash
curl -X POST https://api.perfectcorp.com/v1/makeup-vto \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "effect_type": "LipColorEffect",
    "color_hex": "#D42D32",
    "intensity": 0.8,
    "blend_mode": "natural"
  }'
```

### Test Skin Analysis
```bash
curl -X POST https://api.perfectcorp.com/v1/skin-analysis \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "return_landmarks": true
  }'
```

### Test Skin Tone Analysis
```bash
curl -X POST https://api.perfectcorp.com/v1/skin-tone-analysis \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }'
```

---

## TypeScript Integration Examples

### How the App Makes Requests

```typescript
// In perfect-corp-ar.service.ts

// Example 1: Apply makeup
async applyMakeup(application: MakeupApplication): Promise<void> {
  const payload = {
    effect_type: 'LipColorEffect',
    color_hex: '#D42D32',
    intensity: 0.8,
    blend_mode: 'natural'
  };

  await this.http.post(
    `${this.apiBaseUrl}/makeup-vto`,
    payload,
    {
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      }
    }
  ).toPromise();
}

// Example 2: Analyze skin
async analyzeSkin(): Promise<SkinAnalysis | null> {
  const response = await this.http.post(
    `${this.apiBaseUrl}/skin-analysis`,
    { image: base64String },
    {
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      }
    }
  ).toPromise() as ApiResponse;

  // Map API response to app model
  return {
    skinTone: {
      hex: response.data.skin_tone_hex,
      name: response.data.skin_tone_name,
      category: response.data.skin_tone_category
    },
    undertone: response.data.undertone,
    texture: response.data.texture_score,
    hydration: response.data.hydration_score,
    // ... other fields
  };
}
```

---

## Response Time Expectations

| Endpoint | Average Time | Max Time |
|----------|--------------|----------|
| `/makeup-vto` | 200ms | 500ms |
| `/skin-analysis` | 500ms | 2s |
| `/skin-tone-analysis` | 300ms | 1s |

---

## Rate Limiting

### Current Limits (Per API Key)
- **Requests/Minute:** 100
- **Requests/Hour:** 5,000
- **Requests/Day:** 50,000

### Response Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1613097600
```

### 429 Response (Rate Limited)
```json
{
  "success": false,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Retry after 60 seconds"
}
```

---

## Common Issues & Solutions

### Issue: 400 Bad Request - Invalid Base64
```
Symptoms: "Invalid image format"
Solution: Ensure base64 string is properly formatted:
- Include "data:image/jpeg;base64," prefix (optional)
- No newlines in the base64 string
- Valid JPEG or PNG format
```

### Issue: 401 Unauthorized
```
Symptoms: "Invalid or missing API key"
Solution:
1. Verify API key in environment.ts
2. Check that X-API-Key header is included
3. Ensure key hasn't expired
4. Get new key from: https://yce.perfectcorp.com/
```

### Issue: 500 Server Error
```
Symptoms: Random failures intermittently
Solution:
1. Implement exponential backoff retry
2. Check YouCam API status page
3. Contact YouCam support
4. Add error logging for debugging
```

---

## Data Format Requirements

### Base64 Image
- **Format:** JPEG or PNG
- **Size:** < 10MB recommended
- **Dimensions:** Min 200x200px, Max 4000x4000px
- **Quality:** JPEG quality 80+ recommended
- **Conversion in App:**
  ```typescript
  // Video frame to base64
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(videoElement, 0, 0);
  const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
  ```

### Hex Color Format
- **Format:** #RRGGBB (6 hex characters)
- **Valid:** #D42D32, #000000, #FFFFFF
- **Invalid:** #D4, D42D32, rgb(212, 45, 50)

---

**API Version:** v1
**Last Updated:** Feb 2026
**Status:** ? Production Ready
