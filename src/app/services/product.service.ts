import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, ProductCategory } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>(this.getMockProducts());
  private selectedCategorySubject = new BehaviorSubject<ProductCategory>('lipstick');

  public products$: Observable<Product[]> = this.productsSubject.asObservable();
  public selectedCategory$: Observable<ProductCategory> = this.selectedCategorySubject.asObservable();

  constructor() {}

  /**
   * Get all products
   */
  getAllProducts(): Product[] {
    return this.productsSubject.value;
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: ProductCategory): Product[] {
    return this.getAllProducts().filter(p => p.category === category);
  }

  /**
   * Get product by ID
   */
  getProductById(id: string): Product | undefined {
    return this.getAllProducts().find(p => p.id === id);
  }

  /**
   * Set selected category
   */
  setSelectedCategory(category: ProductCategory): void {
    this.selectedCategorySubject.next(category);
  }

  /**
   * Get current selected category
   */
  getSelectedCategory(): ProductCategory {
    return this.selectedCategorySubject.value;
  }

  /**
   * Mock products data
   * In production, this would fetch from Perfect Corp API or your backend
   */
  private getMockProducts(): Product[] {
    return [
      // Lipsticks
      {
        id: 'lip-001',
        name: 'Velvet Matte',
        brand: 'Perfect Beauty',
        category: 'lipstick',
        shade: 'Rose Pink',
        colorHex: '#E94B8B',
        thumbnail: 'https://via.placeholder.com/100x100/E94B8B/ffffff?text=Rose',
        price: 24.99,
        description: 'Long-lasting matte finish'
      },
      {
        id: 'lip-002',
        name: 'Velvet Matte',
        brand: 'Perfect Beauty',
        category: 'lipstick',
        shade: 'Classic Red',
        colorHex: '#D42D32',
        thumbnail: 'https://via.placeholder.com/100x100/D42D32/ffffff?text=Red',
        price: 24.99
      },
      {
        id: 'lip-003',
        name: 'Velvet Matte',
        brand: 'Perfect Beauty',
        category: 'lipstick',
        shade: 'Nude Beige',
        colorHex: '#C9A18A',
        thumbnail: 'https://via.placeholder.com/100x100/C9A18A/ffffff?text=Nude',
        price: 24.99
      },
      {
        id: 'lip-004',
        name: 'Glossy Shine',
        brand: 'Perfect Beauty',
        category: 'lipstick',
        shade: 'Berry Wine',
        colorHex: '#8B2E5F',
        thumbnail: 'https://via.placeholder.com/100x100/8B2E5F/ffffff?text=Berry',
        price: 22.99
      },
      {
        id: 'lip-005',
        name: 'Glossy Shine',
        brand: 'Perfect Beauty',
        category: 'lipstick',
        shade: 'Coral Sunset',
        colorHex: '#FF6F61',
        thumbnail: 'https://via.placeholder.com/100x100/FF6F61/ffffff?text=Coral',
        price: 22.99
      },

      // Eyeshadows
      {
        id: 'eye-001',
        name: 'Shimmer Shadow',
        brand: 'Perfect Eyes',
        category: 'eyeshadow',
        shade: 'Golden Bronze',
        colorHex: '#CD7F32',
        thumbnail: 'https://via.placeholder.com/100x100/CD7F32/ffffff?text=Bronze',
        price: 19.99
      },
      {
        id: 'eye-002',
        name: 'Shimmer Shadow',
        brand: 'Perfect Eyes',
        category: 'eyeshadow',
        shade: 'Smokey Grey',
        colorHex: '#708090',
        thumbnail: 'https://via.placeholder.com/100x100/708090/ffffff?text=Grey',
        price: 19.99
      },
      {
        id: 'eye-003',
        name: 'Shimmer Shadow',
        brand: 'Perfect Eyes',
        category: 'eyeshadow',
        shade: 'Rose Gold',
        colorHex: '#B76E79',
        thumbnail: 'https://via.placeholder.com/100x100/B76E79/ffffff?text=Rose',
        price: 19.99
      },
      {
        id: 'eye-004',
        name: 'Matte Shadow',
        brand: 'Perfect Eyes',
        category: 'eyeshadow',
        shade: 'Deep Purple',
        colorHex: '#663399',
        thumbnail: 'https://via.placeholder.com/100x100/663399/ffffff?text=Purple',
        price: 18.99
      },

      // Blush
      {
        id: 'blush-001',
        name: 'Natural Glow',
        brand: 'Perfect Cheeks',
        category: 'blush',
        shade: 'Peachy Pink',
        colorHex: '#FFB7A8',
        thumbnail: 'https://via.placeholder.com/100x100/FFB7A8/ffffff?text=Peach',
        price: 26.99
      },
      {
        id: 'blush-002',
        name: 'Natural Glow',
        brand: 'Perfect Cheeks',
        category: 'blush',
        shade: 'Rosy Mauve',
        colorHex: '#D8A3B8',
        thumbnail: 'https://via.placeholder.com/100x100/D8A3B8/ffffff?text=Mauve',
        price: 26.99
      },
      {
        id: 'blush-003',
        name: 'Natural Glow',
        brand: 'Perfect Cheeks',
        category: 'blush',
        shade: 'Coral Flush',
        colorHex: '#FF7F50',
        thumbnail: 'https://via.placeholder.com/100x100/FF7F50/ffffff?text=Coral',
        price: 26.99
      },

      // Highlighters
      {
        id: 'high-001',
        name: 'Radiant Glow',
        brand: 'Perfect Glow',
        category: 'highlighter',
        shade: 'Champagne',
        colorHex: '#F7E7CE',
        thumbnail: 'https://via.placeholder.com/100x100/F7E7CE/000000?text=Champ',
        price: 28.99
      },
      {
        id: 'high-002',
        name: 'Radiant Glow',
        brand: 'Perfect Glow',
        category: 'highlighter',
        shade: 'Moonlight',
        colorHex: '#E8E8E8',
        thumbnail: 'https://via.placeholder.com/100x100/E8E8E8/000000?text=Moon',
        price: 28.99
      }
    ];
  }

  /**
   * Get product categories
   */
  getCategories(): ProductCategory[] {
    return ['lipstick', 'eyeshadow', 'blush', 'foundation', 'mascara', 'eyeliner', 'highlighter'];
  }

  /**
   * Get category display name
   */
  getCategoryDisplayName(category: ProductCategory): string {
    const names: Record<ProductCategory, string> = {
      lipstick: '💄 Lipstick',
      eyeshadow: '👁️ Eyeshadow',
      blush: '🌸 Blush',
      foundation: '✨ Foundation',
      mascara: '👀 Mascara',
      eyeliner: '✏️ Eyeliner',
      highlighter: '💫 Highlighter'
    };
    
    return names[category];
  }
}
