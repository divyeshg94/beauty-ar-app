# Foundation Schema Correction - CRITICAL FIX

## The Issue
The foundation category had the WRONG payload structure. It was trying to use `pattern`, `texture`, and `coverageLevel` properties that the API does NOT support.

## Correct Schema for Foundation

The API expects this exact structure:

```json
{
  "category": "foundation",
  "palettes": [
    {
      "color": "#ff0000",
      "colorIntensity": 0-100,
      "glowIntensity": 0-100,
      "coverageIntensity": 0-100
    }
  ]
}
```

## Key Differences

### ? WRONG (Old Implementation)
```typescript
case 'foundation':
case 'concealer':
  return {
    category,
    pattern: { type: '...' },        // ? NO PATTERN for foundation!
    palettes: [{
      color,
      texture: '...',                // ? NO TEXTURE for foundation!
      colorIntensity: intensity,
      coverageIntensity: ...,
      coverageLevel: ...             // ? NO COVERAGE LEVEL for foundation!
    }]
  };
```

### ? CORRECT (New Implementation)
```typescript
case 'foundation':
  return {
    category: 'foundation',
    palettes: [{
      color,
      colorIntensity: intensity,
      glowIntensity: Math.round(intensity * 0.5),      // ? REQUIRED
      coverageIntensity: Math.round(intensity * 0.9)   // ? REQUIRED
    }]
  };

case 'concealer':
  return {
    category: 'concealer',
    pattern: { type: '...' },        // ? Concealer DOES have pattern
    palettes: [{
      color,
      texture: '...',                // ? Concealer DOES have texture
      colorIntensity: intensity,
      coverageIntensity: ...,
      coverageLevel: ...             // ? Concealer DOES have coverage level
    }]
  };
```

## Foundation vs Concealer

| Property | Foundation | Concealer |
|----------|-----------|-----------|
| `category` | "foundation" | "concealer" |
| `pattern` | ? NO | ? YES |
| `texture` | ? NO | ? YES |
| `colorIntensity` | ? YES | ? YES |
| `glowIntensity` | ? YES | ? NO |
| `coverageIntensity` | ? YES | ? YES |
| `coverageLevel` | ? NO | ? YES |

## Files Modified
- ? `src\app\services\perfect-corp-ar.service.ts`
  - Split foundation and concealer into separate cases
  - Foundation: Only `color`, `colorIntensity`, `glowIntensity`, `coverageIntensity`
  - Concealer: Has `pattern`, `texture`, `coverageLevel`

## Impact
- ? Foundation products will now send the correct payload
- ? Concealer products still work correctly
- ? No more "missing required properties" errors for foundation
- ? API schema validation will pass

## Test
Apply a foundation product - should now work without schema validation errors!
