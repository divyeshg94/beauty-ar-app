# YouCam Makeup VTO API - Correct Request Format

## Actual API Request Structure

The YouCam Makeup VTO API uses a specific format that differs from the initial implementation.

### Correct Request Format

```json
{
  "src_file_url": "https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg",
  "effects": [
    {
      "category": "blush",
      "pattern": { "name": "2colors6" },
      "palettes": [
        { "color": "#FF0000", "texture": "matte", "colorIntensity": 50 },
        { "color": "#F2A53E", "texture": "matte", "colorIntensity": 50 }
      ]
    },
    {
      "category": "eye_liner",
      "pattern": { "name": "3colors5" },
      "palettes": [
        { "color": "#000000", "texture": "matte", "colorIntensity": 50 },
        { "color": "#BA0656", "texture": "matte", "colorIntensity": 50 },
        { "color": "#089085", "texture": "matte", "colorIntensity": 50 }
      ]
    }
  ],
  "version": "1.0"
}
```

## Request Parameters

### Top Level
| Parameter | Type | Description |
|-----------|------|-------------|
| `src_file_url` | string | URL of the source image to apply makeup to |
| `effects` | array | Array of makeup effects to apply |
| `version` | string | API version (e.g., "1.0") |

### Effects Array
Each effect object contains:

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Makeup category (blush, eye_liner, eye_shadow, lipstick, etc.) |
| `pattern` | object | Pattern configuration |
| `palettes` | array | Array of color/texture combinations |

### Pattern Object
| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Pattern name (e.g., "2colors6", "3colors5") |

### Palettes Array (Color Definitions)
Each palette object contains:

| Parameter | Type | Description |
|-----------|------|-------------|
| `color` | string | Hex color code (#RRGGBB) |
| `texture` | string | Texture type: matte, shimmer, gloss, satin |
| `colorIntensity` | number | 0-100 intensity value |

## Makeup Categories

| Category | YouCam Key | Available Patterns |
|----------|-----------|-------------------|
| Blush | `blush` | 2colors6, 2colors7, 2colors8 |
| Eyeliner | `eye_liner` | 3colors5, 3colors6, thin, thick |
| Eyeshadow | `eye_shadow` | 2colors6, 3colors5, 4colors4, shimmer |
| Lipstick | `lipstick` | solid, 2colors3, gradient |
| Mascara | `mascara` | natural, volumizing, lengthening |
| Foundation | `foundation` | light, medium, full_coverage |
| Highlighter | `highlighter` | natural, intense, shimmer |

## Texture Types

```
- matte     : Non-shiny, flat finish
- shimmer   : Light-reflecting, sparkly
- gloss     : Wet, shiny finish
- satin     : Soft, semi-matte finish
```

## Color Intensity

- **0**: No color applied
- **1-30**: Subtle, natural look
- **31-70**: Medium, balanced intensity
- **71-100**: Bold, dramatic look

## Usage in TypeScript

```typescript
const vtoRequest: YouCamMakeupVTORequest = {
  src_file_url: 'https://your-image-url.jpg',
  effects: [
    {
      category: 'lipstick',
      pattern: { name: 'solid' },
      palettes: [
        {
          color: '#FF1493',
          texture: 'matte',
          colorIntensity: 80
        }
      ]
    }
  ],
  version: '1.0'
};

const response = await this.http.post(
  'https://api.perfectcorp.com/v1/makeup-vto',
  vtoRequest,
  {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  }
).toPromise();
```

## Example: Multiple Effects

Apply blush and eyeliner simultaneously:

```json
{
  "src_file_url": "https://example.com/photo.jpg",
  "effects": [
    {
      "category": "blush",
      "pattern": { "name": "2colors6" },
      "palettes": [
        { "color": "#FF7F50", "texture": "matte", "colorIntensity": 60 }
      ]
    },
    {
      "category": "eye_liner",
      "pattern": { "name": "3colors5" },
      "palettes": [
        { "color": "#000000", "texture": "matte", "colorIntensity": 100 }
      ]
    }
  ],
  "version": "1.0"
}
```

## Response Format

```json
{
  "status": 200,
  "data": {
    "task_id": "makeup_123456789",
    "result_url": "https://result-url/image.jpg",
    "image": "base64_encoded_image_data",
    "makeup_applied": true
  }
}
```

## Implementation Updates Needed

1. Update `YouCamMakeupVTORequest` interface
2. Update `applyMakeup()` method to use correct format
3. Add pattern selection logic
4. Add texture mapping
5. Support multiple effects
6. Update tests with correct format

## Key Differences from Initial Implementation

? Uses `src_file_url` instead of `src_file_id`
? Properly structured `effects` array
? Includes `pattern` configuration
? Uses `palettes` for multiple colors
? Proper `texture` type support
? `colorIntensity` as 0-100 value
? `version` field required

## Next Steps

The service has been updated to use this correct format. Make sure to:
1. Test with sample image URL
2. Verify pattern names are correct
3. Check texture support
4. Validate colorIntensity values
5. Test with multiple effects
