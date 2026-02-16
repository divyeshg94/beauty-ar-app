# ? Correct YouCam Makeup VTO API Payload

## Error Analysis

The API error shows us the **EXACT** requirements:

### Valid Categories
```
lip_color        ? NOT "lipstick"!
lip_liner
concealer
foundation
skin_smooth
bronzer
contour
blush
highlighter
eye_shadow
eye_liner
eyebrows
eyelashes
```

### Pattern Structure
```
WRONG: "pattern": { "name": "solid" }
CORRECT: "pattern": { "type": "..." }
```

### Palette Requirements by Category

#### **lip_color**
```json
{
  "color": "#FF1493",
  "colorIntensity": 80
}
```

#### **eye_shadow**
```json
{
  "color": "#9932CC",
  "colorIntensity": 80,
  "glowIntensity": 50,
  "shimmerIntensity": 60,
  "shimmerSize": 50,
  "shimmerDensity": 70
}
```

#### **eye_liner**
```json
{
  "color": "#000000",
  "colorIntensity": 100,
  "colorUnderEyeIntensity": 50,
  "coverageLevel": 80
}
```

#### **eyebrows**
```json
{
  "color": "#8B4513",
  "colorIntensity": 80,
  "smoothness": 60,
  "thickness": 70
}
```

#### **blush, bronzer, highlighter, contour**
```json
{
  "color": "#FF7F50",
  "colorIntensity": 60,
  "coverageIntensity": 70,
  "glowIntensity": 50
}
```

#### **foundation, concealer, skin_smooth**
```json
{
  "color": "#FFD4A3",
  "colorIntensity": 100,
  "coverageIntensity": 90,
  "coverageLevel": 85
}
```

#### **eyelashes**
```json
{
  "colorIntensity": 100,
  "thickness": 80,
  "curl": 70
}
```

### Complete Payload Examples

#### Lip Color
```json
{
  "src_file_url": "https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg",
  "effects": [
    {
      "category": "lip_color",
      "pattern": { "type": "solid" },
      "palettes": [
        {
          "color": "#FF1493",
          "colorIntensity": 80
        }
      ]
    }
  ],
  "version": "1.0"
}
```

#### Eye Shadow
```json
{
  "src_file_url": "https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg",
  "effects": [
    {
      "category": "eye_shadow",
      "pattern": { "type": "shimmer" },
      "palettes": [
        {
          "color": "#9932CC",
          "colorIntensity": 80,
          "glowIntensity": 50,
          "shimmerIntensity": 60,
          "shimmerSize": 50,
          "shimmerDensity": 70
        }
      ]
    }
  ],
  "version": "1.0"
}
```

#### Blush
```json
{
  "src_file_url": "https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg",
  "effects": [
    {
      "category": "blush",
      "pattern": { "type": "natural" },
      "palettes": [
        {
          "color": "#FF7F50",
          "colorIntensity": 60,
          "coverageIntensity": 70,
          "glowIntensity": 50
        }
      ]
    }
  ],
  "version": "1.0"
}
```

## Category Mapping Required

```typescript
const categoryMap: { [key: string]: string } = {
  'lipstick': 'lip_color',              // ? CHANGED!
  'lip_liner': 'lip_liner',
  'eyeshadow': 'eye_shadow',
  'eyeliner': 'eye_liner',
  'eyebrows': 'eyebrows',
  'eyelashes': 'eyelashes',
  'blush': 'blush',
  'bronzer': 'bronzer',
  'contour': 'contour',
  'highlighter': 'highlighter',
  'foundation': 'foundation',
  'concealer': 'concealer',
  'skin_smooth': 'skin_smooth'
};
```

## Pattern Type Mapping

```typescript
const patternTypeMap: { [key: string]: string[] } = {
  'lip_color': ['solid', 'glossy', 'matte', 'satin'],
  'blush': ['natural', 'shimmer', 'matte'],
  'eye_shadow': ['matte', 'shimmer', 'metallic', 'glitter'],
  'eye_liner': ['thin', 'medium', 'thick', 'winged'],
  'eyebrows': ['thin', 'medium', 'thick', 'bold'],
  'foundation': ['light', 'medium', 'full'],
  'highlighter': ['natural', 'intense', 'glowing'],
  'bronzer': ['light', 'medium', 'deep']
};
```

## Palette Builder

```typescript
private buildPalette(category: string, color: string, intensity: number, texture?: string): any {
  const baseIntensity = Math.round(intensity);
  
  switch(category) {
    case 'lip_color':
      return {
        color,
        colorIntensity: baseIntensity
      };
    
    case 'eye_shadow':
      return {
        color,
        colorIntensity: baseIntensity,
        glowIntensity: Math.round(intensity * 0.6),
        shimmerIntensity: Math.round(intensity * 0.7),
        shimmerSize: Math.round(intensity * 0.5),
        shimmerDensity: Math.round(intensity * 0.8)
      };
    
    case 'eye_liner':
      return {
        color,
        colorIntensity: baseIntensity,
        colorUnderEyeIntensity: Math.round(intensity * 0.5),
        coverageLevel: Math.round(intensity * 0.8)
      };
    
    case 'eyebrows':
      return {
        color,
        colorIntensity: baseIntensity,
        smoothness: Math.round(intensity * 0.6),
        thickness: Math.round(intensity * 0.7)
      };
    
    case 'blush':
    case 'bronzer':
    case 'contour':
    case 'highlighter':
      return {
        color,
        colorIntensity: baseIntensity,
        coverageIntensity: Math.round(intensity * 0.7),
        glowIntensity: Math.round(intensity * 0.5)
      };
    
    case 'foundation':
    case 'concealer':
    case 'skin_smooth':
      return {
        color,
        colorIntensity: baseIntensity,
        coverageIntensity: Math.round(intensity * 0.9),
        coverageLevel: Math.round(intensity * 0.8)
      };
    
    case 'eyelashes':
      return {
        colorIntensity: baseIntensity,
        thickness: Math.round(intensity * 0.8),
        curl: Math.round(intensity * 0.7)
      };
    
    default:
      return {
        color,
        colorIntensity: baseIntensity
      };
  }
}
```

## Key Changes

1. ? `lipstick` ? `lip_color`
2. ? `pattern.name` ? `pattern.type`
3. ? Add category-specific palette fields
4. ? Dynamic palette builder
5. ? All 13 categories supported

## Next Step

Update the code with correct category mapping and dynamic palette building!
