# API Schema Validation Fix - pattern.type Property

## Problem
The YouCam API validation error showed:
```
[Path '/effects/0/pattern'] Object has missing required properties (["type"])
```

The API payload structure had `pattern: { name: '...' }` but the API schema requires `pattern: { type: '...' }`.

## Root Cause
All effect categories were using the wrong property name for the pattern object:
- **Wrong**: `pattern: { name: 'light' }`
- **Correct**: `pattern: { type: 'light' }`

## Solution Applied

### File: `src\app\services\perfect-corp-ar.service.ts`

Updated the `buildEffectForCategory()` method to use `type` instead of `name` in all pattern objects:

**Before:**
```typescript
case 'blush':
  return {
    category: 'blush',
    pattern: { name: this.getPatternNameForCategory('blush', intensity) },
    // ...
  };
```

**After:**
```typescript
case 'blush':
  return {
    category: 'blush',
    pattern: { type: this.getPatternNameForCategory('blush', intensity) },
    // ...
  };
```

### Categories Fixed
All categories that use `pattern` now use `{ type: ... }`:
- ? `blush`
- ? `bronzer`
- ? `contour`
- ? `eye_shadow`
- ? `eye_liner`
- ? `eyebrows`
- ? `foundation`
- ? `concealer`
- ? `highlighter`
- ? `eyelashes`
- ? `lip_liner`

### Also Reverted
Changed foundation products back to use `category: 'foundation'` (not concealer) since the API DOES support foundation as a valid category.

## Files Modified
1. ? `src\app\services\perfect-corp-ar.service.ts` - Changed all `pattern: { name: ... }` to `pattern: { type: ... }`
2. ? `src\app\services\product.service.ts` - Reverted products back to use `category: 'foundation'`
3. ? `src\app\models\index.ts` - Reverted ProductCategory type to include `'foundation'` (not `'concealer'`)

## Valid API Categories (from error message)
The API supports these effect categories:
- `skin_smooth`
- `foundation` ?
- `lip_liner`
- `lip_color`
- `contour`
- `eye_shadow`
- `eyebrows`
- `eyelashes`
- `highlighter`
- `bronzer`
- `blush`
- `eye_liner`

## Example Corrected Payload
```typescript
{
  category: 'foundation',
  pattern: { type: 'light' },  // ? Changed from { name: 'light' }
  palettes: [{
    color: '#FFF5E1',
    texture: 'matte',
    colorIntensity: 75,
    coverageIntensity: 67,
    coverageLevel: 60
  }]
}
```

## Testing
Try applying a foundation product now - it should pass schema validation with the correct `pattern.type` property.
