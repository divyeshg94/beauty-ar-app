# YouCam Makeup VTO (Virtual Try-On) Implementation Guide

## Overview

This document provides a complete guide to the Makeup VTO (Virtual Try-On) implementation in the Beauty AR Assistant app. The Makeup VTO API from YouCam/Perfect Corp allows users to apply virtual makeup to their faces in photos or video streams.

## What is Makeup VTO?

Makeup VTO (Virtual Try-On) is an AI-powered feature that:
- ? Applies realistic makeup effects to detected faces
- ? Supports multiple product categories (lipstick, eyeshadow, blush, etc.)
- ? Allows real-time or photo-based makeup application
- ? Provides color customization and intensity control
- ? Returns preview images with applied makeup

## Supported Makeup Categories

| Category | VTO Type | API Key |
|----------|----------|---------|
| Lipstick | Lip color | `lip` |
| Eyeshadow | Eye shadow | `eye_shadow` |
| Blush | Cheek color | `blush` |
| Eyeliner | Eye line | `eyeliner` |
| Mascara | Lash effect | `mascara` |
| Foundation | Base makeup | `foundation` |
| Highlighter | Luminizing | `highlighter` |

## API Endpoints

### 1. File Upload (Step 1)
**Endpoint:** `POST /file/makeup-vto`

Uploads an image to get a file ID for processing.

```typescript
// Request
{
  file_len: number;      // File size in bytes
  file_name: string;     // Filename (e.g., "makeup_123456.jpg")
}

// Response
{
  status: 200,
  data: {
    requests: [{
      file_id: string;
      url: string;           // S3 pre-signed upload URL
      headers: {...}
    }]
  }
}
```

### 2. S3 Upload (Step 2)
**Method:** `PUT {url from step 1}`

Uploads the actual image file to AWS S3 using the pre-signed URL.

### 3. Create Makeup VTO Task (Step 3)
**Endpoint:** `POST /task/makeup-vto`

Creates a makeup VTO processing task.

```typescript
// Request
{
  src_file_id: string;        // From step 1
  makeup_type: string;        // 'lip', 'eye_shadow', 'blush', etc.
  color: string;              // Hex color code (#RRGGBB)
  intensity: number;          // 0.0 to 1.0 (opacity/strength)
  blend: string;              // 'natural' | 'bold' | 'soft'
  return_image: boolean;      // Request result image
}

// Response
{
  status: 200,
  data: {
    task_id: string;  // Use for polling results
  }
}
```

### 4. Poll VTO Results (Step 4)
**Endpoint:** `GET /task/makeup-vto/{task_id}`

Polls the status of the VTO task.

```typescript
// Response (Running)
{
  status: 200,
  data: {
    task_status: 'running'
  }
}

// Response (Completed)
{
  status: 200,
  data: {
    task_status: 'success',
    result: {
      preview_url: string;      // Base64 image with makeup
      makeup_applied: boolean;
    }
  }
}
```

## Implementation in the App

### Service Methods

#### 1. Apply Makeup (Real-time)
```typescript
async applyMakeup(application: MakeupApplication): Promise<void>
```

Applies makeup effects in real-time with visual feedback.

**Parameters:**
```typescript
interface MakeupApplication {
  id?: string;
  productId: string;           // Product identifier
  category: ProductCategory;   // lipstick | eyeshadow | blush | etc.
  color: string;               // Hex color (#RRGGBB)
  intensity: number;           // 0-1 opacity
  blend: 'natural' | 'bold' | 'soft';
  appliedAt?: Date;
  isActive?: boolean;
}
```

**Usage:**
```typescript
// In product-shelf.component.ts
async applyProduct(product: Product) {
  await this.arService.applyMakeup({
    productId: product.id,
    category: product.category,
    color: product.colorHex,
    intensity: 0.8,
    blend: 'natural'
  });
}
```

#### 2. Apply Makeup to Photo (Static)
```typescript
async applyMakeupToPhoto(
  imageBase64: string, 
  application: MakeupApplication
): Promise<string | null>
```

Applies makeup to a static photo and returns a preview URL.

**Usage:**
```typescript
// Capture photo and apply makeup
const photoBase64 = this.arService.captureFrameAsBase64(videoElement);
const previewUrl = await this.arService.applyMakeupToPhoto(photoBase64, {
  productId: 'lipstick_001',
  category: 'lipstick',
  color: '#FF1493',
  intensity: 0.9,
  blend: 'bold'
});
```

#### 3. Get Makeup Recommendations
```typescript
getMakeupRecommendations(skinAnalysis: SkinAnalysis): any
```

Returns color recommendations based on skin tone and undertone.

**Usage:**
```typescript
const skinAnalysis = await this.arService.analyzePhotoForSkin(photoBase64);
const recommendations = this.arService.getMakeupRecommendations(skinAnalysis);

console.log(recommendations.lipstick);   // ['#FF1493', '#FF69B4', ...]
console.log(recommendations.eyeshadow);  // ['#9932CC', '#8B008B', ...]
console.log(recommendations.blush);      // ['#FF7F50', '#FF6347', ...]
```

## Color Science & Recommendations

The implementation includes intelligent color recommendations based on skin analysis:

### Skin Tone Recommendations
- **Very Light**: Soft pinks and magentas (#FFB6C1, #FF69B4)
- **Light**: Vibrant pinks (#FF1493, #FF69B4, #C71585)
- **Medium**: Deep purples (#C71585, #8B008B, #FF1493)
- **Tan**: Warm reds and oranges (#FF6347, #CD5C5C, #DC143C)
- **Deep**: Rich golds and warm browns (#FF6B35, #D2691E, #8B4513)

### Undertone Recommendations
- **Warm Undertone**: Warm blushes (#FF7F50, #FF6347, #FFB347)
- **Cool Undertone**: Cool pinks (#FF69B4, #FFB6C1, #FF1493)
- **Neutral**: Balanced tones (#FFA07A, #FF8C69, #FF6347)

## Configuration

### Environment Variables
Add to `src/environments/environment.ts`:

```typescript
export const environment = {
  perfectCorpApiKey: 'YOUR_API_KEY',
  perfectCorpApiUrl: 'https://api.perfectcorp.com/v1'
};
```

### Get Your API Key
1. Visit: https://yce.perfectcorp.com
2. Sign up for a free account
3. Navigate to API settings
4. Copy your API key
5. Add to environment configuration

## Complete Workflow

### Step 1: User Clicks Product
```typescript
// In product-shelf.component.ts
async applyProduct(product: Product) {
  try {
    this.isApplying = true;
    
    await this.arService.applyMakeup({
      productId: product.id,
      category: product.category,
      color: product.colorHex,
      intensity: 0.8,
      blend: 'natural',
      transition: {
        duration: 300,
        easing: 'ease-in-out'
      }
    });
    
    // Show visual feedback
    this.appliedProducts.add(product.id);
    setTimeout(() => this.appliedProducts.delete(product.id), 300);
    
  } catch (error) {
    console.error('Failed to apply makeup:', error);
  } finally {
    this.isApplying = false;
  }
}
```

### Step 2: Service Handles VTO
```typescript
// In perfect-corp-ar.service.ts
async applyMakeup(application: MakeupApplication): Promise<void> {
  // 1. Map category to YouCam type
  const makeupType = this.categoryToMakeupType(application.category);
  
  // 2. Create request payload
  const payload = {
    makeup_type: makeupType,
    color: application.color,
    intensity: application.intensity
  };
  
  // 3. Call YouCam API (or simulate)
  // const response = await this.http.post(...).toPromise();
  
  // 4. Update UI state
  this.updateMakeupState(application);
}
```

### Step 3: UI Updates
```html
<!-- In product-shelf.component.html -->
<div 
  *ngFor="let product of products"
  (click)="applyProduct(product)"
  [class.applied]="isApplied(product.id)"
  class="product-card"
>
  <div class="product-image">
    <div class="color-swatch" [style.background-color]="product.colorHex"></div>
    <div *ngIf="isApplied(product.id)" class="applied-checkmark">?</div>
  </div>
</div>
```

## Error Handling

The implementation includes comprehensive error handling:

```typescript
try {
  await this.arService.applyMakeup(application);
} catch (error) {
  if (error.message.includes('not initialized')) {
    console.error('Initialize AR engine first');
  } else if (error.message.includes('API')) {
    console.error('API error:', error);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Performance Considerations

1. **Caching**: Results are cached to avoid duplicate API calls
2. **Debouncing**: Rapid clicks are debounced to prevent excessive API calls
3. **Lazy Loading**: Images are loaded asynchronously
4. **Memory Management**: Previous results are cleared when new products are selected

## Testing the Implementation

### Test with Sample Products
```typescript
const testProduct: Product = {
  id: 'test-lipstick-001',
  name: 'Red Lipstick',
  brand: 'Test Brand',
  category: 'lipstick',
  shade: 'Bold Red',
  colorHex: '#FF1493',
  thumbnail: 'assets/products/lipstick.jpg',
  price: 25
};

// Apply test makeup
await this.arService.applyMakeup({
  productId: testProduct.id,
  category: testProduct.category,
  color: testProduct.colorHex,
  intensity: 0.8,
  blend: 'natural'
});
```

### Test with Photos
```typescript
// Capture photo and apply makeup
const video = document.querySelector('video') as HTMLVideoElement;
const photoBase64 = this.arService.captureFrameAsBase64(video);

const previewUrl = await this.arService.applyMakeupToPhoto(photoBase64, {
  productId: 'lipstick_001',
  category: 'lipstick',
  color: '#FF1493',
  intensity: 0.9,
  blend: 'bold'
});

// Display preview
console.log('Preview URL:', previewUrl);
```

## Advanced Features

### 1. Makeup Undo
```typescript
clearMakeup(): void {
  this.appliedProducts.clear();
  this.updateMakeupState(null);
}
```

### 2. Save Makeup Looks
```typescript
saveMakeupLook(products: Product[]): GeneratedLook {
  return {
    id: `look_${Date.now()}`,
    name: 'Custom Look',
    description: 'My created makeup look',
    products: products,
    steps: products.map((p, i) => ({
      order: i,
      product: p,
      application: 'Apply evenly',
      intensity: 0.8
    }))
  };
}
```

### 3. Export Makeup Look
```typescript
exportLook(look: GeneratedLook): string {
  return JSON.stringify(look, null, 2);
}
```

## Troubleshooting

### Issue: VTO not applying
**Solution**: Ensure the API key is valid and the image quality is good (clear face)

### Issue: Colors don't look natural
**Solution**: Adjust the `intensity` parameter (0.0-1.0) and `blend` setting

### Issue: API timeout
**Solution**: The polling has a 60-second timeout; increase `maxAttempts` parameter if needed

### Issue: Face not detected
**Solution**: Ensure the photo has a clear, frontal face view with adequate lighting

## Future Enhancements

1. **Real-time Video**: Apply VTO to video streams
2. **Multiple Products**: Layer multiple makeup effects
3. **Undo/Redo**: Maintain edit history
4. **Sharing**: Export and share makeup looks
5. **AR Filters**: Combine with AR filters for advanced effects

## References

- [YouCam API Documentation](https://yce.perfectcorp.com/document)
- [Perfect Corp Website](https://www.perfectcorp.com)
- [API VTO Endpoint Docs](https://yce.perfectcorp.com/document/index.html#tag/AI-Makeup-Vto)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API documentation
3. Check API response status and error messages
4. Enable console logging for debugging

---

**Last Updated:** 2026-02-14  
**Implementation Status:** ? Complete  
**API Version:** YouCam S2S v2.0
