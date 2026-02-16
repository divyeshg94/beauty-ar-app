# 400 Bad Request - Troubleshooting Guide

## Common Causes & Solutions

### 1. **Invalid Image URL** ??
The `src_file_url` must be accessible

**Current Default:**
```typescript
src_file_url: 'https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg'
```

**Issue**: This URL might be blocked or inaccessible from your network

**Solution**: Use YouCam's test endpoint or your own image

**File to update**: `src/app/services/perfect-corp-ar.service.ts` line ~700

```typescript
// Option 1: Use YouCam test endpoint
src_file_url: 'https://makeupar.com/assets/test-image.jpg'

// Option 2: Use a public image URL
src_file_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Alberto_Cropped.jpg'

// Option 3: Use base64 data URL (for captured photos)
src_file_url: `data:image/jpeg;base64,${imageBase64}`
```

### 2. **Missing or Invalid API Key**
Your API key might not be set or invalid

**Check in `src/environments/environment.ts`:**
```typescript
export const environment = {
  production: false,
  perfectCorpApiKey: 'YOUR_ACTUAL_API_KEY_HERE',  // ? Must be real key
  perfectCorpApiUrl: 'https://api.perfectcorp.com/v1'
};
```

**Solution**:
1. Get your API key from https://yce.perfectcorp.com
2. Replace `YOUR_ACTUAL_API_KEY_HERE` with real key
3. Rebuild the app

### 3. **Wrong Endpoint URL**
The endpoint might be incorrect

**Current**: `/makeup-vto`
**Might need to be**: `/makeup/vto` or `/makeup-api/vto`

**To check**: Look at the exact error response:
```
POST https://api.perfectcorp.com/v1/makeup-vto
400 Bad Request
```

If URL is wrong, you'll get 404 (not found) instead. If it's 400, the endpoint is likely correct but payload is wrong.

### 4. **Payload Format Issues**

**Check the request format in browser console:**

Press `F12` ? `Network` tab ? Filter by `XHR` ? Click product ? Look for `makeup-vto` request

**Required fields:**
```json
{
  "src_file_url": "https://valid-url/image.jpg",  // ? Must be valid URL
  "effects": [
    {
      "category": "lipstick",                      // ? Must be valid category
      "pattern": {
        "name": "solid"                            // ? Must match category patterns
      },
      "palettes": [
        {
          "color": "#FF1493",                      // ? Must be hex format
          "texture": "matte",                      // ? Must be: matte|shimmer|gloss|satin
          "colorIntensity": 80                     // ? Must be 0-100 (not 0-1)
        }
      ]
    }
  ],
  "version": "1.0"                                 // ? Required
}
```

### 5. **Invalid Category Name**
The category mapping might be wrong

**Valid YouCam categories:**
```
? lipstick
? eye_shadow (with underscore!)
? eye_liner (with underscore!)
? blush
? mascara
? foundation
? highlighter
```

**Check in code** (`src/app/services/perfect-corp-ar.service.ts` line ~685):
```typescript
const categoryMap: { [key: string]: string } = {
  'lipstick': 'lipstick',
  'eyeshadow': 'eye_shadow',      // ? Note: underscore!
  'eyeliner': 'eye_liner',         // ? Note: underscore!
  'blush': 'blush',
  'mascara': 'mascara',
  'foundation': 'foundation',
  'highlighter': 'highlighter'
};
```

### 6. **Invalid Pattern Name**
The pattern might not exist for the category

**Valid patterns by category:**
```
blush:      ['2colors6', '2colors7', '2colors8']
eye_liner:  ['3colors5', '3colors6', 'thin', 'thick']
eye_shadow: ['2colors6', '3colors5', '4colors4', 'shimmer']
lipstick:   ['solid', '2colors3', 'gradient']
mascara:    ['natural', 'volumizing', 'lengthening']
foundation: ['light', 'medium', 'full_coverage']
highlighter:['natural', 'intense', 'shimmer']
```

**Check in code** (`src/app/services/perfect-corp-ar.service.ts` line ~752):
```typescript
private getPatternForCategory(category: string, intensity: number): string {
  const patterns: { [key: string]: string[] } = {
    'blush': ['2colors6', '2colors7', '2colors8'],
    'eye_liner': ['3colors5', '3colors6', 'thin', 'thick'],
    // ... etc
  };
```

### 7. **Invalid Texture Type**
Texture must be one of the supported types

**Valid textures:**
```
? matte
? shimmer
? gloss
? satin
```

**Check in code** (`src/app/services/perfect-corp-ar.service.ts` line ~768):
```typescript
private getTextureFromBlend(blend: string): string {
  const textureMap: { [key: string]: string } = {
    'natural': 'matte',
    'bold': 'shimmer',
    'soft': 'satin'
  };
  return textureMap[blend] || 'matte';
}
```

## Debug Steps

### Step 1: Check Console Logs
```
1. Open DevTools (F12)
2. Go to Console tab
3. Click a product to apply makeup
4. Look for: "?? Sending makeup VTO request:"
5. Expand the log to see the full payload
```

### Step 2: Verify Payload Format
Copy the logged payload and compare with:
```json
{
  "src_file_url": "...",
  "effects": [{
    "category": "...",
    "pattern": { "name": "..." },
    "palettes": [{
      "color": "#...",
      "texture": "...",
      "colorIntensity": ...
    }]
  }],
  "version": "1.0"
}
```

### Step 3: Check Network Tab
```
1. Open DevTools (F12)
2. Go to Network tab
3. Filter: XHR
4. Click a product
5. Find "makeup-vto" request
6. Click it
7. Check:
   - Request Headers: Authorization header present?
   - Request Payload: Format correct?
   - Response: What's the error message?
```

### Step 4: Check API Key
In `src/environments/environment.ts`:
```typescript
// ? Wrong (placeholder)
perfectCorpApiKey: 'YOUR_API_KEY_HERE'

// ? Correct (real key)
perfectCorpApiKey: 'sk_live_xxxxxxxxxxxxxxxxxxxx'
```

### Step 5: Test with Different Image
Change the `src_file_url` to test:
```typescript
// Option 1: YouCam sample
'https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg'

// Option 2: Another test image
'https://www.w3schools.com/css/img_5terre.jpg'

// Option 3: Base64 (if you have captured image)
`data:image/jpeg;base64,${imageBase64}`
```

## Quick Fix Checklist

- [ ] API key is real (not placeholder) in `environment.ts`
- [ ] Image URL is accessible and valid
- [ ] Category is in valid list (with underscores for eye_liner/eye_shadow)
- [ ] Pattern exists for that category
- [ ] Texture is one of: matte, shimmer, gloss, satin
- [ ] colorIntensity is 0-100 (not 0-1)
- [ ] version is '1.0'
- [ ] Endpoint is `/makeup-vto` (not `/file/makeup-vto`)

## If Still Getting 400 Error

**Most Likely Causes:**
1. **Invalid API Key** - 400 response with auth error
2. **Invalid Image URL** - 400 with "invalid src_file_url"
3. **Invalid Pattern** - 400 with "unknown pattern"
4. **Invalid Category** - 400 with "unknown category"
5. **Invalid Texture** - 400 with "unknown texture"

**Check exact error message:**
```
DevTools ? Network ? makeup-vto request ? Response tab
Look for error message like:
- "Invalid API key"
- "Pattern '...' not found"
- "Category '...' not supported"
- "Invalid image URL"
```

## Solution Flow

```
1. Check API Key
   ?? If wrong: Update in environment.ts
   ?? If correct: Move to step 2

2. Check Image URL
   ?? If invalid: Use sample URL
   ?? If valid: Move to step 3

3. Check Payload Format
   ?? If wrong: Review code vs examples
   ?? If correct: Move to step 4

4. Check Category/Pattern/Texture
   ?? If invalid: Update to valid values
   ?? If valid: Contact support with full error
```

## Example Request That Works

```bash
curl -X POST https://api.perfectcorp.com/v1/makeup-vto \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "src_file_url": "https://plugins-media.makeupar.com/strapi/assets/sample_Image_1_202b6bf6e6.jpg",
    "effects": [{
      "category": "lipstick",
      "pattern": { "name": "solid" },
      "palettes": [{
        "color": "#FF1493",
        "texture": "matte",
        "colorIntensity": 80
      }]
    }],
    "version": "1.0"
  }'
```

## Error Response Examples

### 400 - Invalid API Key
```json
{
  "status": 400,
  "error": {
    "code": "AUTH_FAILED",
    "message": "Invalid or expired API key"
  }
}
```
**Fix**: Update API key in environment.ts

### 400 - Invalid URL
```json
{
  "status": 400,
  "error": {
    "code": "INVALID_URL",
    "message": "src_file_url is not accessible"
  }
}
```
**Fix**: Use valid, accessible image URL

### 400 - Invalid Category
```json
{
  "status": 400,
  "error": {
    "code": "INVALID_CATEGORY",
    "message": "Category 'eyeliner' not supported. Use 'eye_liner'"
  }
}
```
**Fix**: Use correct category name with underscore

### 400 - Invalid Pattern
```json
{
  "status": 400,
  "error": {
    "code": "INVALID_PATTERN",
    "message": "Pattern 'thick' not valid for category 'lipstick'"
  }
}
```
**Fix**: Use valid pattern for that category

---

## Next Steps

1. Check your API key in `src/environments/environment.ts`
2. Look at console logs when clicking a product
3. Check Network tab for exact error response
4. Tell me the error message and I'll help fix it!

---

**Need Help?** Share the error message from the Network tab Response, and I'll provide exact fix!
