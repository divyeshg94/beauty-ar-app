# Component-to-API Mapping

## Complete Integration Map

```
User Interface Layer
        ?
    Components
        ?
    Services (PerfectCorpArService)
        ?
    YouCam APIs
```

---

## 1. ArCameraComponent

### Purpose
Display live video stream with face detection overlay

### How It Works
```
????????????????????????????????????
?    ArCameraComponent             ?
?  ??????????????????????????????  ?
?  ? ngOnInit()                 ?  ?
?  ?  ? initializeCamera()      ?  ?
?  ?    ? arService.initialize()?  ?
?  ?    ? cameraService.start() ?  ?
?  ?    ? arService.startTracking()
?  ?       ? calls detectFaceFromVideo()
?  ?          in tracking loop  ?  ?
?  ??????????????????????????????  ?
????????????????????????????????????
        ?
   PerfectCorpArService
        ?
   YouCam skin-analysis API
   (for face detection)
        ?
Returns faceData$ observable
        ?
Display face indicator badge
```

### API Called
**YouCam `/skin-analysis` API**
- Triggered: Continuously in trackingLoop (30fps)
- Purpose: Detect face landmarks
- Response: FaceData with landmarks and confidence

### User Sees
- ? "Face Detected" badge at top (when face found)
- ? "Position your face" message (when no face)
- ? Face landmarks drawn on canvas
- ? Animated pulse ring when face detected

### Code Location
```typescript
// src/app/components/ar-camera/ar-camera.component.ts

async ngOnInit() {
  await this.initializeCamera();  // ? Starts tracking
}

async initializeCamera() {
  await this.arService.startTracking(video, canvas);
  // ? Subscribes to face detection
  this.arService.faceData$.subscribe(faceData => {
    this.faceDetected = faceData?.detected || false;
  });
}
```

---

## 2. ProductShelfComponent

### Purpose
Display products by category with try-on functionality

### How It Works
```
????????????????????????????????????
?  ProductShelfComponent           ?
?  ????????????????????????????????
?  ? User clicks on product       ?
?  ?  ? applyProduct()            ?
?  ?    ? arService.applyMakeup() ?
?  ?       (sends product details)?
?  ????????????????????????????????
?                                  ?
?  ????????????????????????????????
?  ? applyMakeup parameters:      ?
?  ? • productId                  ?
?  ? • category (lipstick, etc)   ?
?  ? • color (hex)                ?
?  ? • intensity (0-1)            ?
?  ? • blend mode                 ?
?  ????????????????????????????????
????????????????????????????????????
        ?
   PerfectCorpArService
        ?
   YouCam makeup-vto API
   Maps category ? effect type
        ?
Returns success/error
        ?
Show checkmark animation
```

### API Called
**YouCam `/makeup-vto` API**
- Triggered: When user clicks a product
- Purpose: Apply makeup effect in real-time
- Parameters:
  - effect_type: Mapped from product category
  - color_hex: Product color
  - intensity: 0.0 to 1.0
  - blend_mode: natural, bold, soft

### Effect Type Mapping
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

### User Sees
- ?? Product grid by category
- ?? Click product to try it
- ? Makeup applied in real-time on video
- ? Green checkmark shows product applied
- ? Auto-removes checkmark after 300ms

### Code Location
```typescript
// src/app/components/product-shelf/product-shelf.component.ts

async applyProduct(product: Product) {
  await this.arService.applyMakeup({
    productId: product.id,
    category: product.category,
    color: product.colorHex,
    intensity: 0.8,
    blend: 'natural'
  });
  
  this.appliedProducts.add(product.id);
  setTimeout(() => this.appliedProducts.delete(product.id), 300);
}
```

---

## 3. SkinAnalysisOverlayComponent

### Purpose
Display skin analysis metrics and recommendations

### How It Works
```
??????????????????????????????????
? SkinAnalysisOverlayComponent   ?
? ????????????????????????????????
? ? ngOnInit()                   ?
? ?  ? Subscribe to skinAnalysis$?
? ?    (from PerfectCorpArService)
? ?  ? setTimeout 2 seconds      ?
? ?    ? refresh()               ?
? ?      ? arService.analyzeSkin()
? ????????????????????????????????
?                                ?
? ????????????????????????????????
? ? async refresh()              ?
? ?  ? calls analyzeSkin()       ?
? ?     captures video frame     ?
? ?     ? sends to API           ?
? ????????????????????????????????
??????????????????????????????????
        ?
   PerfectCorpArService
        ?
   YouCam skin-analysis API
   (with optional video frame)
        ?
Returns SkinAnalysis object
        ?
Display metrics & recommendations
```

### API Called
**YouCam `/skin-analysis` API**
- Triggered: Auto after 2 seconds, or manual refresh
- Purpose: Analyze skin conditions
- Parameters:
  - image (optional): base64 video frame
  - return_landmarks: true

### Returns
```json
{
  "skin_tone_hex": "#D4A373",
  "skin_tone_name": "Medium Warm",
  "skin_tone_category": "medium",
  "undertone": "warm",
  "texture_score": 75,
  "hydration_score": 68,
  "spots_score": 25,
  "wrinkles_score": 15,
  "pores_score": 40,
  "recommendations": [
    "Use a hydrating serum",
    "Consider a vitamin C product",
    "SPF 30+ daily"
  ]
}
```

### User Sees
- ?? Skin tone color with name
- ?? Hydration percentage (progress bar)
- ?? Texture quality (progress bar)
- ?? Personalized recommendations
- ?? Refresh button to re-analyze

### Code Location
```typescript
// src/app/components/skin-analysis-overlay/skin-analysis-overlay.component.ts

ngOnInit() {
  this.arService.skinAnalysis$.subscribe(analysis => {
    this.skinAnalysis = analysis;
  });
  
  setTimeout(() => this.refresh(), 2000);
}

async refresh() {
  await this.arService.analyzeSkin();
}
```

---

## 4. AiLookGeneratorComponent

### Purpose
Generate AI-powered makeup looks matched to user's skin tone

### How It Works
```
???????????????????????????????????????
?  AiLookGeneratorComponent           ?
?  ????????????????????????????????????
?  ? User enters prompt              ??
?  ?  ? generateLook()               ??
?  ?    ? aiService.generateLook()   ??
?  ?       (calls skin tone analysis)??
?  ?    ? analyzeSkinTone()          ??
?  ?       ? gets skin tone          ??
?  ?    ? matches colors from DB     ??
?  ?    ? returns GeneratedLook      ??
?  ????????????????????????????????????
?                                     ?
?  ????????????????????????????????????
?  ? User sees products in look      ??
?  ?  ? clicks "Apply This Look"     ??
?  ?    ? applyLook()                ??
?  ?      ? loops through products   ??
?  ?      ? for each:                ??
?  ?        ? arService.applyMakeup()??
?  ?        ? wait 200ms             ??
?  ????????????????????????????????????
???????????????????????????????????????
        ?
   PerfectCorpArService
        ?
   YouCam skin-tone-analysis API
   (to get user's undertone/tone)
        ?
   Returns tone info
        ?
   AI service uses it for
   color matching
        ?
   YouCam makeup-vto API
   (applies each product)
```

### APIs Called

#### 1. Skin Tone Analysis (for color matching)
**YouCam `/skin-tone-analysis` API**
- Purpose: Get user's skin tone
- Returns: Hex color + undertone
- Used for: Color matching recommendations

#### 2. Makeup VTO (for applying look)
**YouCam `/makeup-vto` API** (multiple calls)
- Called once per product in the look
- Sequential with 200ms delay between each
- Builds up the complete look

### User Sees
- ? "AI Looks" button (bottom right)
- ?? Text input for look description
- ? "Generating..." animation
- ?? Generated look with color swatches
- ?? "Apply This Look" button
- ?? Each product applies sequentially

### Example Flow
```
User: "glamorous evening"
  ?
App: Analyzes skin tone ? "Medium Warm"
  ?
App: Generates look with warm-undertone colors:
     - Red lipstick (warm red)
     - Smokey eyeshadow
     - Peachy blush
     - Champagne highlight
  ?
User: Clicks "Apply"
  ?
App: Applies eyeshadow ? wait 200ms
     Applies lipstick ? wait 200ms
     Applies blush ? wait 200ms
     Applies highlight
  ?
User: Sees full glamorous makeup applied!
```

### Code Location
```typescript
// src/app/components/ai-look-generator/ai-look-generator.component.ts

async generateLook() {
  this.generatedLook = await this.aiService.generateLook({
    prompt: this.prompt,
    skinTone: '#D4A373',  // Would use actual skin tone
    faceShape: 'oval'
  }).toPromise();
}

async applyLook() {
  for (const product of this.generatedLook.products) {
    await this.arService.applyMakeup({
      productId: product.id,
      category: product.category,
      color: product.colorHex,
      intensity: 0.8,
      blend: 'natural'
    });
    await this.delay(200);  // Sequential application
  }
}
```

---

## 5. ActionBarComponent

### Purpose
Utility buttons for clearing makeup, saving, sharing

### How It Works
```
??????????????????????????????
?  ActionBarComponent        ?
?  ???????????????????????????
?  ? Clear button clicked   ??
?  ?  ? clearMakeup()       ??
?  ?    ? arService.clearMakeup()
?  ?                        ??
?  ? Save button clicked    ??
?  ?  ? saveLook()          ??
?  ?    ? localStorage.save()
?  ?                        ??
?  ? Share button clicked   ??
?  ?  ? share()             ??
?  ?    ? navigator.share() ??
?  ???????????????????????????
??????????????????????????????
```

### API Called
**YouCam `/makeup-vto` with reset**
- Purpose: Clear all applied effects
- Called: When user clicks "Clear" button
- Result: Resets face to natural state

### User Sees
- ??? Clear button - removes all makeup
- ?? Save button - saves look to favorites
- ?? Share button - shares look on social media

### Code Location
```typescript
// src/app/components/action-bar/action-bar.component.ts

clearMakeup() {
  this.arService.clearMakeup();
}

saveLook() {
  // Save to localStorage or database
  alert('Look saved to favorites!');
}

share() {
  if (navigator.share) {
    navigator.share({
      title: 'My Beauty Look',
      text: 'Check out my AI-generated beauty look!',
      url: window.location.href
    });
  }
}
```

---

## API Call Frequency

| Component | API | Call Frequency | Reason |
|-----------|-----|---|---|
| ArCamera | `/skin-analysis` | 30 fps | Real-time face tracking |
| ProductShelf | `/makeup-vto` | On-demand (user click) | Try-on |
| SkinAnalysis | `/skin-analysis` | Every 2-5 seconds | Periodic analysis |
| AiLookGenerator | `/skin-tone-analysis` | Once per lookup | Color matching |
| AiLookGenerator | `/makeup-vto` | Once per product | Applying looks |

---

## Rate Limiting Strategy

To avoid hitting the 100 req/min limit:

```typescript
// ArCamera: Skip frames
const skipFrames = 5;  // Analyze every 5th frame instead of each

// SkinAnalysis: Debounce
debounce(analyzeSkin, 3000);  // Max once every 3 seconds

// ProductShelf: Throttle
throttle(applyProduct, 500);  // Max once every 500ms

// AiLookGenerator: Cache results
cacheResults(lookId, 3600);  // Cache for 1 hour
```

---

## Data Flow Summary

```
Video Stream
    ?
Frame Capture (30fps)
    ?
[Optional: Skip frames for rate limiting]
    ?
Convert to Base64 JPEG
    ?
Send to YouCam API
    ?
Get Response (Face/Skin Data)
    ?
Parse & Map to Models
    ?
Update Component Observables
    ?
User Sees Updated UI
```

---

## Error Handling per Component

### ArCamera
- Show error overlay if camera unavailable
- Display "Position your face" if no detection
- Log errors to console

### ProductShelf
- Show toast on apply failure
- Retry failed requests
- Log API errors

### SkinAnalysis
- Show loading spinner
- Display "Analysis failed" message
- Use cached results as fallback

### AiLookGenerator
- Show error message in generator panel
- Disable generate button on failure
- Provide manual retry option

---

## Observable Connections

```typescript
// In PerfectCorpArService
faceData$: Observable<FaceData | null>
skinAnalysis$: Observable<SkinAnalysis | null>

// Subscribed by:
// - ArCamera: faceData$ ? shows indicator
// - SkinAnalysis: skinAnalysis$ ? shows metrics
// - (Future) ProductShelf could subscribe for context
```

---

**Integration Complete! ?**

All components are wired to YouCam APIs and ready to use with your API key.
