# API Schema Reference - All Categories

## Known Schemas (from user)

### Foundation
```json
{
  "category": "foundation",
  "palettes": [{
    "color": "#ff0000",
    "colorIntensity": 0-100,
    "glowIntensity": 0-100,
    "coverageIntensity": 0-100
  }]
}
```
**Pattern**: None

### Highlighter  
```json
{
  "category": "highlighter",
  "pattern": { "name": "" },
  "palettes": [{
    "color": "#ff0000",
    "glowIntensity": 0-100,
    "shimmerIntensity": 0-100,
    "shimmerDensity": 0-100,
    "shimmerSize": 0-100,
    "colorIntensity": 0-100
  }]
}
```
**Pattern property**: `name` (NOT `type`)

---

## Current Implementation Status

### ? FIXED
- ? **Foundation**: Correct schema (no pattern, has glowIntensity, coverageIntensity)
- ? **Highlighter**: Changed pattern to use `name` instead of `type`

### ?? NEEDS VERIFICATION (Using `pattern: { type: ... }`)
These currently use `{ type: ... }` but need to be verified against actual API schemas:
- **Blush** - currently: `pattern: { type: ... }`
- **Bronzer** - currently: `pattern: { type: ... }`
- **Contour** - currently: `pattern: { type: ... }`
- **Eye Shadow** - currently: `pattern: { type: ... }`
- **Eye Liner** - currently: `pattern: { type: ... }`
- **Eyebrows** - currently: `pattern: { type: ... }`
- **Concealer** - currently: `pattern: { type: ... }`
- **Eyelashes** - currently: `pattern: { type: ... }`

### ?? SPECIAL CASES
- **Lip Color** - uses `shape: { name: ... }`, `style: { type: ... }` (custom structure)
- **Skin Smooth** - no pattern or palettes (custom structure)

---

## Action Items

Need user to provide schemas for:
1. [ ] Blush
2. [ ] Bronzer
3. [ ] Contour
4. [ ] Eye Shadow
5. [ ] Eye Liner
6. [ ] Eyebrows
7. [ ] Concealer
8. [ ] Eyelashes
9. [ ] Lip Color
10. [ ] Lip Liner

Once schemas are provided, update the corresponding cases in `buildEffectForCategory()`.
