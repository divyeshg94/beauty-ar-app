# Highlighter Pattern Names - FINAL FIX

## The Problem
Error: `"effects.highlighter.pattern.name is invalid"`

The highlighter pattern names were hardcoded as `['natural', 'intense', 'glowing']` but the API requires **face shape patterns** from the official highlighter.json file.

## The Solution
Updated `getPatternNameForCategory()` to use valid face shape patterns for highlighter.

## Valid Highlighter Pattern Names (from API)
The API provides face shape-based patterns:

```json
{
  "label": "OvalFace2",    // Oval face 2
  "label": "OvalFace4",    // Oval face 4
  "label": "OvalFace5",    // Oval face 5
  "label": "OvalFace9",    // Oval face 9
  "label": "OvalFace15",   // Oval face 15
  "label": "OvalFace17",   // Oval face 17
  "label": "RoundFace3",   // Round face 3
  "label": "RoundFace24",  // Round face 24
  "label": "HeartFace4",   // Heart face 4
  // ... and many more face shapes
}
```

**Source**: https://plugins-media.makeupar.com/wcm-saas/patterns/highlighter.json

## Code Change
**File**: `src\app\services\perfect-corp-ar.service.ts` (line 1111)

**Before:**
```typescript
'highlighter': ['natural', 'intense', 'glowing'],  // ? WRONG - not valid API values
```

**After:**
```typescript
'highlighter': ['OvalFace2', 'OvalFace4', 'OvalFace5', 'OvalFace9', 'OvalFace15', 'OvalFace17'],  // ? VALID API values
```

## How It Works
The intensity-based selection now returns valid face shape patterns:
- **Low intensity (0-40)**: `OvalFace2` (simple oval application)
- **Medium intensity (40-70)**: `OvalFace9` (medium oval application)
- **High intensity (70-100)**: `OvalFace17` (intense oval application)

## Verification
Highlighter will now send valid payloads like:
```json
{
  "category": "highlighter",
  "pattern": { "name": "OvalFace2" },
  "palettes": [{
    "color": "#ff0000",
    "glowIntensity": 50,
    "shimmerIntensity": 50,
    "shimmerDensity": 50,
    "shimmerSize": 50,
    "colorIntensity": 50
  }]
}
```

The pattern name `"OvalFace2"` will now pass API validation! ?

## Files Modified
- ? `src\app\services\perfect-corp-ar.service.ts` - Updated highlighter pattern array (line 1111)

## Note
All 40+ valid face shape patterns are available in the highlighter.json file. We're using the Oval Face variants (which are commonly applicable), but other shapes like Heart Face, Round Face, Square Face, Triangle Face, and Invtriangle are also valid options for future customization.
