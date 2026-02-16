# YouCam /file/makeup-vto Endpoint - 400 Bad Request Debug

## The Correct Endpoint is `/file/makeup-vto`
The API returns:
- **404**: Wrong endpoint (`/makeup-vto` doesn't exist)
- **400**: `/file/makeup-vto` exists but payload format is wrong

## Debugging Steps

### Step 1: Enable Detailed Logging
Add this to `applyMakeup()` method to see the exact error:

```typescript
} catch (error: any) {
  console.error('? Failed to apply makeup VTO:', error);
  
  // Log detailed error info
  if (error.error) {
    console.error('?? Error Response:', JSON.stringify(error.error, null, 2));
  }
  
  if (error.status) {
    console.error('?? Status:', error.status);
  }
  
  this.handleApiError(error, 'Makeup VTO API');
  throw error;
}
```

### Step 2: Check Network Tab for Exact Error
1. Open DevTools (F12)
2. Go to Network tab
3. Filter: XHR
4. Click a product to apply makeup
5. Find `file/makeup-vto` request
6. Click it
7. Go to **Response** tab
8. **Copy the entire error message**

The error will look something like:
```json
{
  "status": 400,
  "error": {
    "code": "INVALID_PAYLOAD",
    "message": "Field 'X' is required" or "Field 'X' is invalid"
  }
}
```

### Step 3: Possible Payload Format Issues

The `/file/makeup-vto` endpoint might expect a DIFFERENT format than the one we're sending.

**Current payload:**
```json
{
  "src_file_url": "...",
  "effects": [
    {
      "category": "...",
      "pattern": { "name": "..." },
      "palettes": [{ "color": "#...", "texture": "...", "colorIntensity": ... }]
    }
  ],
  "version": "1.0"
}
```

**Possible alternative format 1 (simpler):**
```json
{
  "image_url": "...",
  "makeup": {
    "type": "lipstick",
    "color": "#FF1493",
    "intensity": 80
  }
}
```

**Possible alternative format 2 (multipart):**
```
POST /file/makeup-vto
Content-Type: multipart/form-data

file: <binary image data>
makeup_type: lipstick
color: #FF1493
intensity: 80
```

**Possible alternative format 3 (file upload first):**
```
Step 1: Upload image
POST /file/upload
? Returns file_id

Step 2: Apply makeup
POST /file/makeup-vto
{
  "file_id": "...",
  "effects": [...]
}
```

## Questions to Help Debug

Can you tell me:

1. **What's the exact error message** in the Network Response tab?
   - Look for keywords like: "required", "invalid", "missing", "not found"

2. **Does it mention specific fields?**
   - Example: "Field 'X' is required"

3. **Does it give any hints about format?**
   - Example: "Expected object but got string"

## Most Likely Cause

For a 400 error on `/file/makeup-vto`, the most common issues are:

1. **Missing required field** - The API expects a field we're not sending
2. **Wrong field name** - We're using `src_file_url` but it expects `image_url`
3. **Wrong value type** - We're sending a string where it expects a number
4. **Wrong structure** - We're sending nested objects but it expects flat structure

## Quick Test

Try these alternative payloads:

### Option A: Simpler Payload
Replace the entire payload construction with:

```typescript
const vtoPayload = {
  image_url: 'https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg',
  makeup_type: youCamCategory,
  color: application.color,
  intensity: Math.round((application.intensity || 0.8) * 100)
};
```

### Option B: With file_id (if upload needed first)
```typescript
const vtoPayload = {
  file_id: 'uploaded_file_id_here',
  effects: [{
    category: youCamCategory,
    pattern: { name: this.getPatternForCategory(youCamCategory, intensity) },
    palettes: [{
      color: application.color,
      texture: this.getTextureFromBlend(application.blend || 'natural'),
      colorIntensity: intensity
    }]
  }]
};
```

## Next Steps

1. **Share the error message** from Network Response
2. **I'll provide exact payload format** for `/file/makeup-vto`
3. **Update the code** accordingly
4. **Test again**

## To Share Error Info

Open DevTools (F12) ? Network ? Click `file/makeup-vto` request ? Response tab

Copy everything in the Response and share it, or tell me:
- Error code (if shown)
- Error message
- Any field names mentioned
- Any hints about what's expected

---

**Once you share the exact error, I can fix the payload format immediately!**
