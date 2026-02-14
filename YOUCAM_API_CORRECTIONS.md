# ? YouCam API Integration - CORRECTED

## ?? **CRITICAL: READ THIS FIRST!**

### The S2S API is NOT for Real-Time AR!

?? **Full explanation:** [`YOUCAM_REALTIME_LIMITATIONS.md`](./YOUCAM_REALTIME_LIMITATIONS.md)

**Quick Facts:**
- ?? Takes **3-5 seconds** per image (4-step async process)
- ?? Video needs **33ms** per frame (30 FPS)
- ?? **900x too slow** for real-time tracking
- ? Great for **photo analysis**
- ? Cannot do **real-time makeup try-on**

**What you need for real-time AR:** YouCam Web SDK (different product)

---

## ?? IMPORTANT CORRECTIONS

The previous documentation had **incorrect endpoint names**. Here's what's actually available:

---

## ? Actual YouCam S2S V2.0 APIs

### Base URL
```
https://yce-api-01.makeupar.com/s2s/v2.0
```

### Authentication
```
X-API-Key: your-api-key-here
```

---

## 1. ? AI Skin Analysis API (CRITICAL)

**Endpoint:** `POST /ai-skin-analysis`  
**Documentation:** https://yce.perfectcorp.com/document/index.html#tag/AI-Skin-Analysis

### What It Does
- Analyzes skin tone (color + label)
- Detects skin type (oily, dry, combination, moisture level, texture)
- Identifies skin concerns (dark spots, wrinkles, pores, acne)

### Request Payload
```json
{
  "img": "base64_encoded_image_string",
  "output": ["skin_tone", "skin_type", "skin_concern"]
}
```

### Response
```json
{
  "result": {
    "skin_tone": {
      "color": "#D4A373",
      "label": "Medium",
      "undertone": "warm"
    },
    "skin_type": {
      "type": "combination",
      "moisture": 68,
      "texture": 75
    },
    "skin_concern": {
      "dark_spot": 25,
      "wrinkle": 15,
      "pore": 40,
      "acne": 10
    }
  }
}
```

### Usage in App
- **Component:** `SkinAnalysisOverlayComponent`
- **Service Method:** `analyzeSkin(imageBase64)`
- **Location:** `perfect-corp-ar.service.ts`

---

## 2. ?? Makeup API

**Endpoint:** `POST /makeup`  
**Documentation:** https://yce.perfectcorp.com/document/index.html#tag/Makeup

### ?? IMPORTANT NOTE
This API **does NOT provide real-time AR**. It:
- Takes an input image
- Applies makeup from YouCam's catalog
- Returns a new image with makeup applied

### What You Need
- **Makeup Style IDs** from YouCam's makeup catalog
- These are NOT color hex codes
- You need to browse their catalog to get valid IDs

### Request Payload
```json
{
  "img": "base64_encoded_image",
  "makeup_style": "makeup_style_id_from_catalog",
  "intensity": 0.8
}
```

### Response
```json
{
  "result": {
    "img": "base64_encoded_image_with_makeup"
  }
}
```

### Current Implementation Status
?? **NOT YET IMPLEMENTED** - Requires makeup style IDs from YouCam catalog

---

## 3. ?? Alternative: YouCam AR SDK (For Real-Time AR)

If you want **real-time makeup try-on**, you need:

### Option A: YouCam AR SDK (JavaScript/WebGL)
- **Purpose:** Real-time face tracking + makeup rendering
- **Platform:** Web browser (WebGL)
- **Download:** https://yce.perfectcorp.com/
- **Integration:** Embed their SDK in your app

### Option B: YouCam Makeup SDK (Mobile)
- **Purpose:** Native AR makeup for iOS/Android
- **Platform:** Mobile apps only
- **Not applicable** for web apps

---

## ?? Comparison: API vs SDK

| Feature | S2S API (`/makeup`) | AR SDK |
|---------|---------------------|--------|
| **Real-time AR** | ? No | ? Yes |
| **Face tracking** | ? No | ? Yes |
| **Returns** | Static image | Live AR overlay |
| **Use case** | Photo editing | Live camera feed |
| **Integration** | HTTP requests | Embed SDK |

---

## ?? What's Actually Integrated

### ? Working Now
1. **AI Skin Analysis** ? Detects skin tone, type, concerns
2. **Skin Tone Detection** ? For color matching
3. **Face Detection** ? Via skin analysis (bounding box + basic landmarks)

### ?? Not Yet Working
1. **Real-time Makeup Try-On** ? Requires AR SDK or makeup style IDs
2. **Live AR Effects** ? Not available via S2S API

### ?? Recommendation
For **real-time makeup try-on**, you need to:
1. Download YouCam AR SDK from https://yce.perfectcorp.com/
2. Integrate their WebGL SDK into your Angular app
3. Use their AR rendering engine for live effects

---

## ?? Updated Documentation Files

I've updated these files with correct information:
- ? `perfect-corp-ar.service.ts` - Now uses `/ai-skin-analysis`
- ? Response parsing - Maps to YouCam's actual response format
- ? Error handling - Proper API error messages

---

## ?? Next Steps

### For Skin Analysis (Already Working)
```typescript
// This works now
const analysis = await arService.analyzeSkin(imageBase64);
console.log(analysis.skinTone.hex);  // "#D4A373"
console.log(analysis.hydration);     // 68
```

### For Real-Time Makeup (Needs SDK)
```typescript
// You'll need to:
1. Download YouCam AR SDK
2. Initialize SDK with your API key
3. Use their AR rendering methods

// Example (pseudo-code):
const arEngine = new YouCamAR({ apiKey: 'your-key' });
await arEngine.initialize();
arEngine.applyMakeup({ lipstick: 'red', intensity: 0.8 });
```

---

## ?? Official Documentation Links

- **API Docs:** https://yce.perfectcorp.com/document/
- **Get API Key:** https://yce.perfectcorp.com/?affiliate=202602DevWeekHackathon
- **AI Skin Analysis:** https://yce.perfectcorp.com/document/index.html#tag/AI-Skin-Analysis
- **Makeup API:** https://yce.perfectcorp.com/document/index.html#tag/Makeup
- **SDK Download:** https://yce.perfectcorp.com/

---

## ?? Summary of Changes

### What Was Wrong
- ? Endpoint `/makeup-vto` doesn't exist
- ? Endpoint `/skin-tone-analysis` doesn't exist  
- ? Payload used `image` instead of `img`
- ? Response parsing expected wrong format

### What's Fixed
- ? Now uses `/ai-skin-analysis` (correct)
- ? Payload uses `img` key (correct)
- ? Response parses `result.skin_tone` (correct)
- ? Maps YouCam's labels to app format

---

**Last Updated:** February 2026  
**API Version:** S2S V2.0  
**Status:** ? Skin Analysis Working | ?? Real-time AR Needs SDK
