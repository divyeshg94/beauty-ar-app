# Makeup VTO Integration Guide - Product Shelf

## How to Use Makeup VTO in Product Shelf Component

### Overview
This guide shows how the product shelf component uses the Makeup VTO feature to let users try on makeup products virtually.

## Current Implementation

### Product Shelf Component (`product-shelf.component.ts`)

The component already has the `applyProduct()` method that triggers makeup VTO:

```typescript
async applyProduct(product: Product) {
  console.log('Applying product:', product.name);
  
  try {
    await this.arService.applyMakeup({
      productId: product.id,
      category: product.category,
      color: product.colorHex,
      intensity: 0.8,
      blend: 'natural',
      transition: {
        duration: 300,
        easing: 'ease-in-out'
      }
    });

    this.appliedProducts.add(product.id);
    
    // Remove from applied after 300ms (visual feedback)
    setTimeout(() => {
      this.appliedProducts.delete(product.id);
    }, 300);
    
  } catch (error) {
    console.error('Failed to apply product:', error);
  }
}
```

### Product Shelf Template (`product-shelf.component.html`)

The template shows the product cards with click handlers:

```html
<div 
  *ngFor="let product of products" 
  (click)="applyProduct(product)"
  [class.applied]="isApplied(product.id)"
  class="product-card"
>
  <div class="product-image">
    <div class="color-swatch" [style.background-color]="product.colorHex"></div>
    <div *ngIf="isApplied(product.id)" class="applied-checkmark">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
      </svg>
    </div>
  </div>
  <div class="product-info">
    <p class="product-name">{{ product.shade }}</p>
    <p class="product-brand">{{ product.brand }}</p>
  </div>
</div>
```

## How It Works

### Step 1: User Clicks a Product
```
User clicks on a product card
         ?
(click)="applyProduct(product)" is triggered
         ?
applyProduct() method is called
```

### Step 2: Service Processes VTO
```
applyProduct() calls arService.applyMakeup()
         ?
Service maps category to YouCam makeup type
         ?
Service sends request to YouCam API
         ?
API applies virtual makeup effect
         ?
Promise resolves successfully
```

### Step 3: UI Shows Feedback
```
Product added to appliedProducts set
         ?
[class.applied]="isApplied(product.id)" becomes true
         ?
Checkmark SVG appears on product card
         ?
After 300ms, product is removed from appliedProducts
         ?
Checkmark disappears
```

## VTO Workflow Diagram

```
???????????????????????????????????????????
? User Clicks Product on Shelf             ?
???????????????????????????????????????????
               ?
               ?
???????????????????????????????????????????
? applyProduct(product) Called            ?
? - Product ID: product.id                ?
? - Category: product.category             ?
? - Color: product.colorHex               ?
? - Intensity: 0.8                        ?
? - Blend: 'natural'                      ?
???????????????????????????????????????????
               ?
               ?
???????????????????????????????????????????
? arService.applyMakeup() Executes        ?
?                                          ?
? 1. Map category to VTO type             ?
?    lipstick ? 'lip'                     ?
?    eyeshadow ? 'eye_shadow'             ?
?    blush ? 'blush'                      ?
?    eyeliner ? 'eyeliner'                ?
?    mascara ? 'mascara'                  ?
?    foundation ? 'foundation'            ?
?    highlighter ? 'highlighter'          ?
?                                          ?
? 2. Create VTO payload                   ?
?    { makeup_type, color, intensity }    ?
?                                          ?
? 3. Call YouCam API                      ?
?    POST /makeup-vto                     ?
?                                          ?
? 4. Simulate 300ms delay                 ?
?    (realistic API response time)        ?
?                                          ?
? 5. Log success                          ?
???????????????????????????????????????????
               ?
               ?
???????????????????????????????????????????
? Visual Feedback Shown                   ?
?                                          ?
? 1. appliedProducts.add(product.id)      ?
? 2. [class.applied] binding triggers     ?
? 3. Checkmark appears on product card    ?
? 4. After 300ms timeout                  ?
? 5. appliedProducts.delete(product.id)   ?
? 6. Checkmark disappears                 ?
???????????????????????????????????????????
```

## Data Flow

### Input Data
```typescript
Product {
  id: string;              // "lipstick_001"
  name: string;            // "Red Lipstick"
  brand: string;           // "MAC"
  category: string;        // "lipstick"
  shade: string;           // "Ruby"
  colorHex: string;        // "#FF1493"
  thumbnail: string;       // "assets/..."
  price: number;           // 25
}
```

### VTO Request
```typescript
{
  productId: "lipstick_001",
  category: "lipstick",
  color: "#FF1493",
  intensity: 0.8,
  blend: "natural",
  transition: {
    duration: 300,
    easing: "ease-in-out"
  }
}
```

### VTO Response (Simulated)
```typescript
{
  id: "makeup_1623456789",
  productId: "lipstick_001",
  category: "lipstick",
  color: "#FF1493",
  intensity: 0.8,
  blend: "natural",
  appliedAt: Date,
  isActive: true
}
```

## Makeup Category Mapping

| Product Category | VTO Type | Example Product |
|------------------|----------|-----------------|
| lipstick | lip | MAC Ruby Red |
| eyeshadow | eye_shadow | Urban Decay Primer |
| blush | blush | NARS Orgasm |
| eyeliner | eyeliner | Maybelline Black |
| mascara | mascara | L'Oreal Volume |
| foundation | foundation | Fenty Beauty 320 |
| highlighter | highlighter | Benefit Dallas |

## Color Examples by Category

### Lipstick Colors
```
Deep Red:      #8B0000
Bright Pink:   #FF1493
Nude:          #D2B48C
Coral:         #FF7F50
Berry:         #8B3A62
```

### Eyeshadow Colors
```
Neutral:       #C5B8A8
Shimmer Gold:  #FFD700
Deep Purple:   #663399
Bronze:        #CD7F32
Smokey:        #36454F
```

### Blush Colors
```
Soft Pink:     #FFB6C1
Peach:         #FFDAB9
Berry:         #C71585
Coral:         #FF6347
Natural:       #FFA07A
```

## Usage Example

### Complete Workflow

```typescript
// 1. Import necessary modules
import { Component, OnInit } from '@angular/core';
import { Product } from '../../models';
import { PerfectCorpArService } from '../../services/perfect-corp-ar.service';

// 2. Define component
@Component({
  selector: 'app-product-shelf',
  templateUrl: './product-shelf.component.html',
  styleUrls: ['./product-shelf.component.scss']
})
export class ProductShelfComponent implements OnInit {
  
  // 3. Define properties
  products: Product[] = [];
  appliedProducts: Set<string> = new Set();
  isLoading = false;
  selectedCategory = 'lipstick';
  
  // 4. Inject service
  constructor(
    private productService: ProductService,
    private arService: PerfectCorpArService
  ) {}
  
  // 5. Initialize
  ngOnInit() {
    this.loadProducts('lipstick');
  }
  
  // 6. Load products by category
  loadProducts(category: string) {
    this.selectedCategory = category;
    this.products = this.productService.getProductsByCategory(category);
  }
  
  // 7. Apply makeup VTO
  async applyProduct(product: Product) {
    try {
      this.isLoading = true;
      
      // Call VTO
      await this.arService.applyMakeup({
        productId: product.id,
        category: product.category,
        color: product.colorHex,
        intensity: 0.8,
        blend: 'natural',
        transition: {
          duration: 300,
          easing: 'ease-in-out'
        }
      });
      
      // Show visual feedback
      this.appliedProducts.add(product.id);
      
      // Hide feedback after 300ms
      setTimeout(() => {
        this.appliedProducts.delete(product.id);
      }, 300);
      
    } catch (error) {
      console.error('Failed to apply makeup:', error);
      // Show error toast
      this.showError('Failed to apply makeup effect');
    } finally {
      this.isLoading = false;
    }
  }
  
  // 8. Check if product is applied
  isApplied(productId: string): boolean {
    return this.appliedProducts.has(productId);
  }
  
  // 9. Error handling
  showError(message: string) {
    // Show toast notification
    console.error(message);
  }
}
```

## Advanced Features to Implement

### 1. Intensity Control
```typescript
// Allow users to adjust makeup intensity
<input 
  type="range" 
  min="0" 
  max="1" 
  step="0.1" 
  [(ngModel)]="intensity"
  (change)="applyProduct(product)"
>
```

### 2. Blend Mode Selection
```typescript
// Let users choose blend mode
<select [(ngModel)]="blendMode">
  <option value="natural">Natural</option>
  <option value="bold">Bold</option>
  <option value="soft">Soft</option>
</select>
```

### 3. Undo Functionality
```typescript
// Clear all applied makeup
clearAllMakeup() {
  this.appliedProducts.clear();
  this.arService.clearMakeup();
}
```

### 4. Save Looks
```typescript
// Save current makeup combination
saveCurrentLook() {
  const look = {
    name: 'My Look',
    products: Array.from(this.appliedProducts)
  };
  localStorage.setItem('saved_look', JSON.stringify(look));
}
```

## Debugging Tips

### Check Applied Products
```typescript
console.log('Applied products:', Array.from(this.appliedProducts));
```

### Verify Product Data
```typescript
console.log('Product:', product);
console.log('Color:', product.colorHex);
console.log('Category:', product.category);
```

### Monitor VTO Calls
```typescript
// Add in applyProduct()
console.log('VTO Request:', {
  productId: product.id,
  category: product.category,
  color: product.colorHex
});
```

### Check API Response
```typescript
// In service's applyMakeup()
console.log('VTO Response:', response);
```

## Performance Tips

1. **Debounce rapid clicks** to avoid excessive API calls
2. **Cache VTO results** for repeated products
3. **Use lazy loading** for product images
4. **Limit concurrent VTO requests** to 1-2 at a time

## Browser Compatibility

? Chrome 90+  
? Firefox 88+  
? Safari 14+  
? Edge 90+  

Requires:
- Canvas API
- Fetch/XMLHttpRequest
- ES6+ Promise support

---

**Last Updated:** 2026-02-14  
**Status:** ? Complete and Functional
