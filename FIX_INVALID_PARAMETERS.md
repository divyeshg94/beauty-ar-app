# ? /file/makeup-vto - Invalid Parameters Fix

## Error: "Bad request - Invalid parameters"

This means the `/file/makeup-vto` endpoint exists but the payload format is wrong.

## Possible Payload Formats to Try

Let me give you 5 different payload formats to test. We'll try each one until one works.

### **Format 1: Simpler Structure (Most Likely)**
```json
{
  "src_file_url": "https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg",
  "makeup_type": "lipstick",
  "color": "#FF1493",
  "intensity": 80
}
```

### **Format 2: With effects but simpler**
```json
{
  "src_file_url": "https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg",
  "effects": [
    {
      "type": "lipstick",
      "color": "#FF1493",
      "intensity": 80
    }
  ]
}
```

### **Format 3: With makeup object**
```json
{
  "image_url": "https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg",
  "makeup": {
    "category": "lipstick",
    "color": "#FF1493",
    "intensity": 80
  }
}
```

### **Format 4: Flat structure**
```json
{
  "src_file_url": "https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg",
  "category": "lipstick",
  "color": "#FF1493",
  "intensity": 80,
  "texture": "matte"
}
```

### **Format 5: With pattern but no version**
```json
{
  "src_file_url": "https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg",
  "effects": [
    {
      "category": "lipstick",
      "color": "#FF1493",
      "intensity": 80
    }
  ]
}
```

## How to Test Each Format

### Quick Test Code
Add this to `applyMakeup()` method and test each format:

**Test Format 1:**
```typescript
const vtoPayload = {
  src_file_url: 'https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg',
  makeup_type: youCamCategory,
  color: application.color,
  intensity: intensity
};
```

**Test Format 2:**
```typescript
const vtoPayload = {
  src_file_url: 'https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg',
  effects: [
    {
      type: youCamCategory,
      color: application.color,
      intensity: intensity
    }
  ]
};
```

**Test Format 3:**
```typescript
const vtoPayload = {
  image_url: 'https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg',
  makeup: {
    category: youCamCategory,
    color: application.color,
    intensity: intensity
  }
};
```

**Test Format 4:**
```typescript
const vtoPayload = {
  src_file_url: 'https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg',
  category: youCamCategory,
  color: application.color,
  intensity: intensity,
  texture: this.getTextureFromBlend(application.blend || 'natural')
};
```

**Test Format 5 (without version):**
```typescript
const vtoPayload = {
  src_file_url: 'https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg',
  effects: [
    {
      category: youCamCategory,
      color: application.color,
      intensity: intensity
    }
  ]
};
// Remove version: '1.0'
```

## Testing Strategy

1. Try **Format 1** first (simplest)
2. If it fails, try **Format 2**
3. Keep going until one works
4. Share which format works with me

## Which Format to Update Code With

Tell me which number format works (1, 2, 3, 4, or 5) and I'll update the code with that exact format.

---

**Testing Instructions:**
1. Copy one of the test code snippets above
2. Replace the current `vtoPayload` construction in `applyMakeup()`
3. Build: `ng build`
4. Click a product
5. Check console for success or different error
6. If it works (200 OK), tell me which format!
7. If it fails, try the next format

Once you find the working format, I'll update the code permanently!
