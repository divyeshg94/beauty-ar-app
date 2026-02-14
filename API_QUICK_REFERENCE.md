# Quick API Integration Checklist

## ? What Was Implemented

### 1. **Makeup Virtual Try-On (makeup-vto)**
- ? Maps product categories to effect types
- ? Sends color hex and intensity
- ? Supports all effect types
- **Location:** `applyMakeup()` in `perfect-corp-ar.service.ts`
- **Used By:** `ProductShelfComponent`

### 2. **Skin Analysis API (skin-analysis)**
- ? Captures video frames as base64
- ? Sends to API with landmarks request
- ? Maps response to SkinAnalysis model
- ? Returns hydration, texture, spots, wrinkles, pores scores
- **Location:** `analyzeSkin()` in `perfect-corp-ar.service.ts`
- **Used By:** `SkinAnalysisOverlayComponent`

### 3. **Skin Tone Analysis API (skin-tone-analysis)**
- ? Converts video frame to base64
- ? Detects precise skin tone
- ? Returns hex color + category
- **Location:** `analyzeSkinTone()` in `perfect-corp-ar.service.ts`
- **Used By:** `AiLookGeneratorService` for color matching

### 4. **Face Detection (via Skin Analysis)**
- ? Integrated into tracking loop
- ? Returns face landmarks
- ? Provides bounding box
- ? Updates faceData$ observable
- **Location:** `detectFaceFromVideo()` in `perfect-corp-ar.service.ts`
- **Used By:** `ArCameraComponent`

---

## ?? Setup Steps

### Step 1: Get API Key
```
?? https://yce.perfectcorp.com/?affiliate=202602DevWeekHackathon
```

### Step 2: Update Environment
Replace in `src/environments/environment.ts`:
```typescript
perfectCorpApiKey: 'YOUR_ACTUAL_API_KEY_HERE'
```

### Step 3: Run the App
```bash
npm install
ng serve
```

---

## ?? API Endpoints Summary

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/makeup-vto` | POST | Apply makeup effect | Success/Error |
| `/skin-analysis` | POST | Analyze skin + detect face | Metrics + Landmarks |
| `/skin-tone-analysis` | POST | Detect skin tone | Hex + Category |

---

## ?? Response Models

### Skin Analysis Response
```json
{
  "skin_tone_hex": "#D4A373",
  "undertone": "warm",
  "texture_score": 75,
  "hydration_score": 68,
  "recommendations": ["Use hydrating serum", ...]
}
```

### Face Detection Response (via Skin Analysis)
```json
{
  "face_detected": true,
  "confidence": 0.95,
  "landmarks": {
    "left_eye_x": 100,
    "left_eye_y": 150,
    ...
  }
}
```

---

## ?? How Each Component Uses APIs

### ArCameraComponent
```
Video Stream ? detectFaceFromVideo() ? Skin Analysis API
                                    ?
                          Face Detection Results
                                    ?
                        Display "Face Detected" Badge
```

### ProductShelfComponent
```
User clicks product ? applyMakeup() ? Makeup VTO API
                                  ?
                        Real-time makeup preview
```

### SkinAnalysisOverlayComponent
```
Component loads ? refresh() ? analyzeSkin() ? Skin Analysis API
                                          ?
                            Display metrics & recommendations
```

### AiLookGeneratorComponent
```
User enters prompt ? generateLook() ? analyzeSkinTone() ? Skin Tone API
                                  ?
                   Get color-matched products for user's skin tone
```

---

## ?? Important Notes

### API Key Format
- Located in: `src/environments/environment.ts`
- Default (update this): `'YOUR_PERFECT_CORP_API_KEY_HERE'`
- Header sent as: `'X-API-Key': your-api-key`

### Base64 Image Conversion
The service automatically:
1. Captures video frame to canvas
2. Converts to JPEG (not PNG - smaller file)
3. Extracts base64 string after comma
4. Sends to API

### Error Handling
All API calls have try-catch with specific error messages:
- **401**: Check your API key
- **400**: Bad request parameters
- **429**: Rate limited
- **5xx**: Server error

---

## ?? Testing Checklist

- [ ] API key is configured in environment.ts
- [ ] Camera permission is granted
- [ ] Face is detected (see indicator at top)
- [ ] Skin analysis appears after 2 seconds
- [ ] Clicking products applies makeup effect
- [ ] AI Look generator shows recommendations
- [ ] Browser console shows successful API calls

---

## ?? Example API Calls in Code

### Apply Lipstick
```typescript
await arService.applyMakeup({
  productId: 'lip-001',
  category: 'lipstick',
  color: '#D42D32',
  intensity: 0.8,
  blend: 'natural'
});
```

### Get Skin Analysis
```typescript
const analysis = await arService.analyzeSkin();
console.log(analysis.skinTone.name);      // "Medium Warm"
console.log(analysis.hydration);          // 68
console.log(analysis.recommendations[0]); // "Use hydrating serum"
```

### Detect Skin Tone
```typescript
const tone = await arService.analyzeSkinTone(base64Image);
console.log(tone.hex);      // "#D4A373"
console.log(tone.name);     // "Medium Warm"
console.log(tone.category); // "medium"
```

---

## ?? Key Files Modified

| File | Purpose | Method |
|------|---------|--------|
| `perfect-corp-ar.service.ts` | Main API integration | `applyMakeup()`, `analyzeSkin()`, `analyzeSkinTone()` |
| `ai-look-generator.service.ts` | AI looks with color matching | Uses `analyzeSkinTone()` |
| `environment.ts` | Configuration | `perfectCorpApiKey`, `perfectCorpApiUrl` |
| `environment.prod.ts` | Production config | Same as dev |

---

## ?? Effect Type Mapping

```typescript
{
  'lipstick'     ? 'LipColorEffect',
  'eyeshadow'    ? 'EyeshadowEffect',
  'blush'        ? 'BlushEffect',
  'foundation'   ? 'FoundationEffect',
  'highlighter'  ? 'HighlighterEffect',
  'eyeliner'     ? 'EyelinerEffect',
  'mascara'      ? 'EyelashesEffect'
}
```

---

## ?? Support

If APIs fail:
1. Check console for error message
2. Verify API key in environment.ts
3. Ensure image is valid base64
4. Check network tab in DevTools
5. Verify YouCam API status

---

**Last Updated:** February 2026
**API Version:** YouCam V1
**Integration Status:** ? Complete
