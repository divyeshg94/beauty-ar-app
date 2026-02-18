# Foundation to Concealer API Fix

## Problem
The YouCam Perfect Corp API returned an `invalid_parameters` error when trying to apply foundation makeup:

```
[Path '/effects/0/category'] Instance value ("foundation") not found in enum
(possible values: [..., "concealer", ...])
```

## Root Cause
The API does **NOT support** a separate `'foundation'` category. The valid categories are:
- `eyelashes`
- `contour`
- `eye_liner`
- `bronzer`
- `eyebrows`
- `skin_smooth`
- `blush`
- **`concealer`** ?
- `lip_liner`
- `highlighter`
- `eye_shadow`
- `lip_color`

Foundation products must use `'concealer'` as the API category.

## Solution Implemented

### 1. Updated Product Types (`src\app\models\index.ts`)
Changed ProductCategory type:
```typescript
export type ProductCategory = 
  | 'lipstick' 
  | 'eyeshadow' 
  | 'blush' 
  | 'concealer'        // ? Changed from 'foundation'
  | 'mascara' 
  | 'eyeliner'
  | 'highlighter';
```

### 2. Updated Product Service (`src\app\services\product.service.ts`)
- **Product data**: All foundation products now use `category: 'concealer'`
- **getCategories()**: Returns `'concealer'` instead of `'foundation'`
- **getCategoryDisplayName()**: Maps `concealer` to `'? Concealer'` display name

### 3. Foundation Products Updated
4 Foundation products now use the `concealer` category:
- `found-001`: Light Ivory
- `found-002`: Medium Beige
- `found-003`: Warm Tan
- `found-004`: Deep Bronze

**UI Display**: Still shows as "? Concealer" to users

## Files Changed
1. ? `src\app\models\index.ts` - ProductCategory type
2. ? `src\app\services\product.service.ts` - Product data and category methods

## Verification
The API will now accept makeup VTO requests with:
```typescript
{
  category: 'concealer',
  pattern: { name: 'light' | 'medium' | 'full' },
  palettes: [{
    color: '#...',
    texture: 'matte' | 'gloss' | 'satin',
    colorIntensity: 0-100,
    coverageIntensity: 0-90,
    coverageLevel: 0-80
  }]
}
```

## Related Categories
- **API**: Foundation is represented as `'concealer'`
- **Product Service**: Internal category name is `'concealer'`
- **User Display**: Shows "? Concealer"
- **Makeup Effect**: Uses the concealer effect handler in Perfect Corp service

## Notes
- The `buildEffectForCategory()` method in `perfect-corp-ar.service.ts` already had the correct handler for foundation/concealer
- No changes needed in the AR service - it already supports 'concealer' category
- Foundation products now work correctly with YouCam API validation
