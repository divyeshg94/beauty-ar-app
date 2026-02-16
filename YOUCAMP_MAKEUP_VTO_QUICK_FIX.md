# ?? YouCam Makeup VTO - Quick Implementation Fix

## The Correct API Format

```json
POST /makeup-vto
{
  "src_file_url": "https://image-url.jpg",
  "effects": [
    {
      "category": "lipstick",
      "pattern": { "name": "solid" },
      "palettes": [
        { "color": "#FF1493", "texture": "matte", "colorIntensity": 80 }
      ]
    }
  ],
  "version": "1.0"
}
```

## Key Parameters

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `src_file_url` | string | https://example.com/photo.jpg | Source image URL |
| `category` | string | lipstick | Makeup type |
| `pattern.name` | string | solid | Pattern style |
| `color` | string | #FF1493 | Hex color |
| `texture` | string | matte | matte/shimmer/gloss/satin |
| `colorIntensity` | number | 80 | 0-100 value |
| `version` | string | 1.0 | API version |

## Category & Pattern Mapping

```
lipstick        ? solid, 2colors3, gradient
eye_shadow      ? 2colors6, 3colors5, 4colors4, shimmer
eye_liner       ? 3colors5, 3colors6, thin, thick
blush           ? 2colors6, 2colors7, 2colors8
mascara         ? natural, volumizing, lengthening
foundation      ? light, medium, full_coverage
highlighter     ? natural, intense, shimmer
```

## Blend to Texture Mapping

```
natural  ? matte    (non-shiny)
bold     ? shimmer  (sparkly, reflective)
soft     ? satin    (semi-matte)
```

## Intensity Conversion

```
0.0-1.0 (internal)  ? 0-100 (API)
0.5 intensity        ? 50 colorIntensity
0.8 intensity        ? 80 colorIntensity
```

## Implementation Steps

1. **Update Interfaces**
```typescript
interface YouCamMakeupVTORequest {
  src_file_url: string;
  effects: Array<{
    category: string;
    pattern: { name: string };
    palettes: Array<{
      color: string;
      texture: string;
      colorIntensity: number;
    }>;
  }>;
  version: string;
}
```

2. **Create Helper Methods**
```typescript
private getPatternForCategory(category: string, intensity: number): string
private getTextureFromBlend(blend: string): string
private getDefaultSampleImageUrl(): string
```

3. **Build Request Payload**
```typescript
const vtoPayload: YouCamMakeupVTORequest = {
  src_file_url: imageUrl,
  effects: [{
    category: youCamCategory,
    pattern: { name: this.getPatternForCategory(...) },
    palettes: [{
      color: application.color,
      texture: this.getTextureFromBlend(...),
      colorIntensity: Math.round(intensity * 100)
    }]
  }],
  version: '1.0'
};
```

4. **Send API Request**
```typescript
const response = await this.http.post<YouCamMakeupVTOResponse>(
  `${this.apiBaseUrl}/makeup-vto`,
  vtoPayload,
  { headers: {...} }
).toPromise();
```

## Files to Update

1. `src/app/services/perfect-corp-ar.service.ts`
   - Update interfaces (YouCamMakeupVTORequest, YouCamMakeupVTOResponse)
   - Replace applyMakeup() method
   - Add helper methods

2. Keep integration the same
   - Product shelf component works as-is
   - UI already calls applyMakeup()
   - Visual feedback unchanged

## Complete Working Example

```typescript
// User clicks product
async applyProduct(product: Product) {
  await this.arService.applyMakeup({
    productId: product.id,
    category: 'lipstick',        // 'lipstick'
    color: '#FF1493',             // Hex color
    intensity: 0.8,               // 0-1, converted to 80
    blend: 'bold'                 // 'bold' ? shimmer texture
  });
}

// Service creates request
{
  src_file_url: 'https://sample.jpg',
  effects: [{
    category: 'lipstick',         // From mapping
    pattern: { name: 'gradient' }, // Bold intensity ? gradient
    palettes: [{
      color: '#FF1493',
      texture: 'shimmer',          // Bold blend ? shimmer
      colorIntensity: 80
    }]
  }],
  version: '1.0'
}

// API returns
{
  status: 200,
  data: {
    task_id: 'makeup_...',
    result_url: 'https://result.jpg',
    makeup_applied: true
  }
}
```

## Testing Checklist

- [ ] Update YouCamMakeupVTORequest interface
- [ ] Update YouCamMakeupVTOResponse interface
- [ ] Implement applyMakeup() with new format
- [ ] Add getPatternForCategory() helper
- [ ] Add getTextureFromBlend() helper
- [ ] Add getDefaultSampleImageUrl() helper
- [ ] Update category mapping (use 'eye_liner' not 'eyeliner')
- [ ] Verify intensity conversion (0-1 ? 0-100)
- [ ] Test with sample image URL
- [ ] Verify pattern names are correct
- [ ] Check texture support
- [ ] Test error handling
- [ ] Verify response parsing

## Documentation References

- **API Format**: See YOUCAMP_MAKEUP_VTO_API_FORMAT.md
- **Implementation**: See YOUCAMP_MAKEUP_VTO_UPDATED_IMPLEMENTATION.md
- **Integration**: See MAKEUP_VTO_INTEGRATION_GUIDE.md

## API Endpoint

```
POST https://api.perfectcorp.com/v1/makeup-vto
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

## Common Issues & Fixes

**Issue**: `category: 'eyeliner'` not working
**Fix**: Use `category: 'eye_liner'` (underscore!)

**Issue**: `colorIntensity: 0.8` returns error
**Fix**: Use `colorIntensity: 80` (0-100 range, not 0-1)

**Issue**: Pattern 'default' doesn't work
**Fix**: Use valid patterns like 'solid', '2colors6', '3colors5'

**Issue**: `texture: 'gloss'` not applied
**Fix**: Use valid textures: matte, shimmer, gloss, satin

**Issue**: Image not processing
**Fix**: Ensure `src_file_url` is accessible URL or valid data URL

---

**Status**: ? Ready to implement
**Time to implement**: ~15 minutes
**Complexity**: Low
**Impact**: High - enables production API integration
