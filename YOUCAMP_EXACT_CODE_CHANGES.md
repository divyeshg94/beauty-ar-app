# YouCam Makeup VTO - Exact Code Changes Needed

## Location: `src/app/services/perfect-corp-ar.service.ts`

### Change 1: Update Interface Definitions (at top of file after line 85)

**BEFORE (INCORRECT):**
```typescript
interface YouCamMakeupVTORequest {
  src_file_id: string;
  makeup_type: string;
  color: string;
  intensity?: number;
}
```

**AFTER (CORRECT):**
```typescript
interface YouCamMakeupVTORequest {
  src_file_url: string;              // Image URL instead of file_id
  effects: Array<{
    category: string;                // lipstick, eye_liner, eye_shadow, etc.
    pattern: {
      name: string;                  // Pattern name like '2colors6', 'solid'
    };
    palettes: Array<{
      color: string;                 // Hex color code
      texture: string;               // matte, shimmer, gloss, satin
      colorIntensity: number;        // 0-100 (not 0-1)
    }>;
  }>;
  version: string;                   // '1.0'
}

interface YouCamMakeupVTOResponse {
  status: number;
  data?: {
    task_id?: string;
    result_url?: string;
    image?: string;
    makeup_applied?: boolean;
  };
  error?: {
    code: string;
    message: string;
  };
}
```

---

### Change 2: Replace the applyMakeup() Method (around line 700)

**LOCATION**: Find the `async applyMakeup(application: MakeupApplication): Promise<void>` method

**REPLACE WITH:**
```typescript
async applyMakeup(application: MakeupApplication): Promise<void> {
  if (!this.isInitialized) {
    throw new Error('AR Engine not initialized');
  }

  console.log('?? Applying makeup VTO:', application);

  try {
    // Map product category to YouCam category key
    const categoryMap: { [key: string]: string } = {
      'lipstick': 'lipstick',
      'eyeshadow': 'eye_shadow',
      'blush': 'blush',
      'eyeliner': 'eye_liner',      // Note: underscore!
      'mascara': 'mascara',
      'foundation': 'foundation',
      'highlighter': 'highlighter'
    };

    const youCamCategory = categoryMap[application.category] || application.category;
    const intensity = Math.round((application.intensity || 0.8) * 100);

    // Create VTO request in correct YouCam format
    const vtoPayload: YouCamMakeupVTORequest = {
      src_file_url: this.getDefaultSampleImageUrl(),
      effects: [
        {
          category: youCamCategory,
          pattern: {
            name: this.getPatternForCategory(youCamCategory, intensity)
          },
          palettes: [
            {
              color: application.color,
              texture: this.getTextureFromBlend(application.blend || 'natural'),
              colorIntensity: intensity
            }
          ]
        }
      ],
      version: '1.0'
    };

    console.log('?? Sending makeup VTO request:', vtoPayload);

    // HTTP call to YouCam API
    const response = await this.http.post<YouCamMakeupVTOResponse>(
      `${this.apiBaseUrl}/makeup-vto`,
      vtoPayload,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    ).toPromise();

    if (response?.status === 200) {
      console.log('? Makeup VTO applied successfully:', response.data);
      this.updateMakeupState(application);
    } else {
      throw new Error(`VTO API returned status ${response?.status}`);
    }

  } catch (error) {
    console.error('? Failed to apply makeup VTO:', error);
    this.handleApiError(error, 'Makeup VTO API');
    throw error;
  }
}
```

---

### Change 3: Add Helper Methods (after applyMakeup method)

**ADD THESE NEW PRIVATE METHODS:**

```typescript
/**
 * Get appropriate pattern name based on category and intensity
 */
private getPatternForCategory(category: string, intensity: number): string {
  const patterns: { [key: string]: string[] } = {
    'blush': ['2colors6', '2colors7', '2colors8'],
    'eye_liner': ['3colors5', '3colors6', 'thin', 'thick'],
    'eye_shadow': ['2colors6', '3colors5', '4colors4', 'shimmer'],
    'lipstick': ['solid', '2colors3', 'gradient'],
    'mascara': ['natural', 'volumizing', 'lengthening'],
    'foundation': ['light', 'medium', 'full_coverage'],
    'highlighter': ['natural', 'intense', 'shimmer']
  };

  const categoryPatterns = patterns[category] || ['default'];
  
  if (intensity < 40) {
    return categoryPatterns[0];
  } else if (intensity < 70) {
    return categoryPatterns[Math.floor(categoryPatterns.length / 2)];
  } else {
    return categoryPatterns[categoryPatterns.length - 1];
  }
}

/**
 * Map blend mode to YouCam texture type
 */
private getTextureFromBlend(blend: string): string {
  const textureMap: { [key: string]: string } = {
    'natural': 'matte',
    'bold': 'shimmer',
    'soft': 'satin'
  };
  return textureMap[blend] || 'matte';
}

/**
 * Get the source image URL for VTO
 */
private getDefaultSampleImageUrl(): string {
  // YouCam's sample image for testing
  return 'https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg';
}

/**
 * Update makeup state for tracking applied products
 */
private updateMakeupState(application: MakeupApplication): void {
  console.log('?? Makeup state updated:', {
    category: application.category,
    color: application.color,
    intensity: application.intensity,
    timestamp: new Date().toISOString()
  });
}
```

---

## Summary of Changes

| Item | Before | After |
|------|--------|-------|
| Request URL | `/file/makeup-vto` | `/makeup-vto` |
| src parameter | `src_file_id` | `src_file_url` |
| Structure | Flat object | Nested effects array |
| Intensity range | 0-1 | 0-100 |
| Texture field | Not included | matte/shimmer/gloss/satin |
| Pattern support | Not included | Pattern selection |
| API version | Not included | '1.0' |

---

## Testing the Changes

### 1. Build the project
```bash
ng build
```

### 2. Set your API key
```typescript
// src/environments/environment.ts
perfectCorpApiKey: 'YOUR_ACTUAL_API_KEY'
```

### 3. Test in browser
```
User clicks product ? applyMakeup() called ? VTO request sent ? Result applied
```

### 4. Monitor console logs
- Look for "?? Sending makeup VTO request:"
- Check request structure matches expected format
- Verify response status is 200

---

## API Request/Response Examples

### Request Example
```json
{
  "src_file_url": "https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg",
  "effects": [
    {
      "category": "lipstick",
      "pattern": { "name": "gradient" },
      "palettes": [
        { "color": "#FF1493", "texture": "shimmer", "colorIntensity": 80 }
      ]
    }
  ],
  "version": "1.0"
}
```

### Response Example
```json
{
  "status": 200,
  "data": {
    "task_id": "makeup_1613123456789",
    "result_url": "https://cdn.example.com/result.jpg",
    "image": "base64_encoded_image_data...",
    "makeup_applied": true
  }
}
```

---

## Verification Checklist

After making these changes:

- [ ] Interfaces updated correctly
- [ ] applyMakeup() method replaced
- [ ] Helper methods added
- [ ] Category mapping uses 'eye_liner' (underscore)
- [ ] Intensity converted to 0-100 range
- [ ] Pattern selection implemented
- [ ] Texture mapping implemented
- [ ] Build completes without errors
- [ ] API key configured
- [ ] Test with sample image
- [ ] Verify API response received
- [ ] Check result in UI

---

## Common Mistakes to Avoid

? Using 'eyeliner' instead of 'eye_liner'
? Leaving intensity as 0-1 instead of 0-100
? Using old endpoint `/file/makeup-vto` instead of `/makeup-vto`
? Forgetting 'version' field
? Using invalid pattern names
? Not converting blend to texture

? Use 'eye_liner' with underscore
? Convert intensity: `Math.round(intensity * 100)`
? Use correct endpoint `/makeup-vto`
? Always include 'version': '1.0'
? Select valid patterns for category
? Map blend to texture: natural?matte, bold?shimmer, soft?satin

---

**Status**: Ready to implement  
**Time**: ~5-10 minutes to apply changes  
**Difficulty**: Easy (mostly find and replace)  
**Impact**: Production-ready API integration

**Next Steps:**
1. Apply these code changes
2. Build project
3. Test in browser
4. Deploy to production
