# Quick Payload Format Testing

## Current Implementation (Format 1)
```typescript
const vtoPayload = {
  src_file_url: 'https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg',
  makeup_type: youCamCategory,
  color: application.color,
  intensity: intensity
};
```

**If this fails**, quickly replace with one of these:

---

## If Still Getting Error - Try Format 2

Replace the payload in `applyMakeup()` with:
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

---

## If Still Getting Error - Try Format 3

Replace with:
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

---

## If Still Getting Error - Try Format 4

Replace with:
```typescript
const vtoPayload = {
  src_file_url: 'https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg',
  category: youCamCategory,
  color: application.color,
  intensity: intensity,
  texture: this.getTextureFromBlend(application.blend || 'natural')
};
```

---

## Testing Steps for Each Format

1. Update the payload in `src/app/services/perfect-corp-ar.service.ts` line ~697
2. Save the file
3. Run: `ng build`
4. Click a product
5. Check console for:
   - `? Makeup VTO applied successfully:` ? Format works!
   - New error message ? Try next format

---

## Which Format Works?

Once one of these formats works (shows success in console), reply with:
- **"Format 1 works!"** or
- **"Format 2 works!"** etc.

Then I'll update the code permanently with that format!

---

**Current Status**: Testing Format 1 (simplest)
