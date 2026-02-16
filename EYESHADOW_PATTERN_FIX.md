# Eye Shadow Pattern Fix

## Problem
The API was rejecting eye shadow requests with the error:
```
"error": "invalid_parameter",
"error_message": "effects.eye_shadow.pattern.name is invalid",
```

## Root Cause
The `eye_shadow` pattern names were invalid. The original pattern names were:
- `'matte'`
- `'shimmer'`
- `'metallic'`

These pattern names don't match the YouCam API's expected enum values.

## Solution
Updated the eye_shadow pattern names to match the valid format used by other categories:

### Before:
```typescript
'eye_shadow': ['matte', 'shimmer', 'metallic']
```

### After:
```typescript
'eye_shadow': ['2colors1', '2colors2', '2colors3']
```

## Additional Fix
Simplified the eye_shadow palette to only include required fields:

### Before:
```typescript
palettes: [{
  color,
  texture: this.getTextureFromBlend(blend),
  colorIntensity: intensity,
  shimmerIntensity: Math.round(intensity * 0.7),    // Extra fields removed
  shimmerSize: Math.round(intensity * 0.5),
  shimmerDensity: Math.round(intensity * 0.8),
  glowIntensity: Math.round(intensity * 0.6)
}]
```

### After:
```typescript
palettes: [{
  color,
  colorIntensity: intensity,
  texture: this.getTextureFromBlend(blend)
}]
```

## Files Changed
- `src/app/services/perfect-corp-ar.service.ts`
  - Line 989: Updated eye_shadow pattern names
  - Lines 880-889: Simplified eye_shadow palette structure

## Result
The eye_shadow category now sends valid pattern names and only the required palette fields, which should resolve the API validation error.
