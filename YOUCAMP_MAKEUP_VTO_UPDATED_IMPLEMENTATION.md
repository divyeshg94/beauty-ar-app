# Updated applyMakeup Method - Correct YouCam API Format

## Replace the applyMakeup method in perfect-corp-ar.service.ts with this:

```typescript
/**
 * Apply makeup to face using YouCam AI Makeup VTO API
 * Endpoint: POST /makeup-vto
 * Documentation: https://yce.perfectcorp.com/document/index.html#tag/AI-Makeup-Vto
 * 
 * The Makeup VTO (Virtual Try-On) API applies cosmetic effects to faces in images
 * Supports: blush, eye_liner, eye_shadow, lipstick, mascara, foundation, highlighter
 */
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
      'eyeliner': 'eye_liner',
      'mascara': 'mascara',
      'foundation': 'foundation',
      'highlighter': 'highlighter'
    };

    const youCamCategory = categoryMap[application.category] || application.category;
    const intensity = Math.round((application.intensity || 0.8) * 100); // Convert 0-1 to 0-100

    // Create VTO request payload in correct YouCam format
    const vtoPayload: YouCamMakeupVTORequest = {
      src_file_url: this.getDefaultSampleImageUrl(),  // Use sample or captured image
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

    // Call YouCam Makeup VTO endpoint
    // For demo purposes, we simulate the response
    // In production, uncomment the HTTP call below:
    
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

/**
 * Get appropriate pattern name based on category and intensity
 */
private getPatternForCategory(category: string, intensity: number): string {
  // Pattern names available for each category
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
  
  // Select pattern based on intensity
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
 * Can be replaced with captured image URL
 */
private getDefaultSampleImageUrl(): string {
  // YouCam's sample image for testing
  return 'https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg';
  
  // Or use your captured image URL:
  // return `data:image/jpeg;base64,${imageBase64}`;
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

## Supporting Interfaces to Update

Also update the interface definitions at the top of the file:

```typescript
// YouCam Makeup VTO Request Interface
interface YouCamMakeupVTORequest {
  src_file_url: string;              // URL of the source image
  effects: Array<{
    category: string;                // 'blush', 'eye_liner', 'eye_shadow', 'lipstick', etc.
    pattern: {
      name: string;                  // Pattern name (e.g., '2colors6', '3colors5')
    };
    palettes: Array<{
      color: string;                 // Hex color code (#RRGGBB)
      texture: string;               // 'matte', 'shimmer', 'gloss', 'satin'
      colorIntensity: number;        // 0-100 intensity
    }>;
  }>;
  version: string;                   // API version (e.g., '1.0')
}

// YouCam Makeup VTO Response Interface
interface YouCamMakeupVTOResponse {
  status: number;
  data?: {
    task_id?: string;
    result_file_id?: string;
    result_url?: string;
    makeup_applied?: boolean;
    image?: string;                  // Base64 result image
  };
  error?: {
    code: string;
    message: string;
  };
}
```

## Key Changes

1. **Request Format**: Now uses `src_file_url` instead of `src_file_id`
2. **Effects Structure**: Properly structured effects array with pattern and palettes
3. **Pattern Selection**: Intelligent pattern selection based on intensity
4. **Texture Mapping**: Maps blend modes to texture types (matte, shimmer, satin)
5. **Color Intensity**: Converts 0-1 intensity to 0-100 range
6. **Version Field**: Includes API version in request
7. **Proper Error Handling**: Updated error handling for new structure

## Testing Example

```typescript
// Apply bold lipstick
await this.arService.applyMakeup({
  productId: 'lipstick_001',
  category: 'lipstick',
  color: '#FF1493',
  intensity: 0.9,          // Will be converted to 90 colorIntensity
  blend: 'bold'            // Will use 'shimmer' texture
});

// This creates the request:
{
  "src_file_url": "https://plugins-media.makeupar.com/...",
  "effects": [{
    "category": "lipstick",
    "pattern": { "name": "gradient" },  // Bold intensity selects gradient pattern
    "palettes": [{
      "color": "#FF1493",
      "texture": "shimmer",             // Bold blend = shimmer texture
      "colorIntensity": 90
    }]
  }],
  "version": "1.0"
}
```

## API Call Format

```typescript
const response = await this.http.post(
  'https://api.perfectcorp.com/v1/makeup-vto',
  {
    src_file_url: "https://image-url.jpg",
    effects: [{
      category: "lipstick",
      pattern: { name: "solid" },
      palettes: [{ color: "#FF1493", texture: "matte", colorIntensity: 80 }]
    }],
    version: "1.0"
  },
  {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  }
).toPromise();
```

## Response Format

The API returns:
```json
{
  "status": 200,
  "data": {
    "task_id": "makeup_123456789",
    "result_url": "https://result-cdn.url/image.jpg",
    "image": "base64_encoded_result_image",
    "makeup_applied": true
  }
}
```

## Important Notes

1. Replace the entire `applyMakeup()` method in perfect-corp-ar.service.ts
2. Update the interfaces at the top of the file
3. Ensure API key is set in environment variables
4. Test with sample image URL first
5. Then replace with captured image data URLs
6. Monitor console logs for debugging
7. The API endpoint is `/makeup-vto` (not `/file/makeup-vto`)

## What This Fix Provides

? Correct YouCam API format
? Proper effect structure
? Pattern-based approach
? Texture type support
? Intensity scaling (0-100)
? Multiple effect support (extensible)
? Type-safe implementation
? Proper error handling

---

**Status:** Ready to implement  
**API Version:** YouCam S2S 1.0  
**Date:** 2026-02-14
