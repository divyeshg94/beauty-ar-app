import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { PerfectCorpArService } from '../../services/perfect-corp-ar.service';
import { Product, ProductCategory } from '../../models';

@Component({
  selector: 'app-product-shelf',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-shelf.component.html',
  styleUrls: ['./product-shelf.component.scss']
})
export class ProductShelfComponent implements OnInit {
  categories: ProductCategory[] = [];
  selectedCategory: ProductCategory = 'lipstick';
  products: Product[] = [];
  appliedProducts: Set<string> = new Set();
  isCollapsed = false;
  isApplying = false;
  applyMessage: string | null = null;
  applyError: string | null = null;

  constructor(
    private productService: ProductService,
    private arService: PerfectCorpArService
  ) {}

  ngOnInit() {
    this.categories = this.productService.getCategories();
    this.loadProducts(this.selectedCategory);
  }

  selectCategory(category: ProductCategory) {
    this.selectedCategory = category;
    this.loadProducts(category);
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  private loadProducts(category: ProductCategory) {
    this.products = this.productService.getProductsByCategory(category);
  }

  async applyProduct(product: Product) {
    console.log('Applying product:', product.name);
    
    try {
      this.isApplying = true;
      this.applyError = null;
      this.applyMessage = 'Applying… please wait';

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
      
      // Remove from applied after 100ms (visual feedback)
      setTimeout(() => {
        this.appliedProducts.delete(product.id);
      }, 300);

      this.applyMessage = null;
      
    } catch (error) {
      console.error('Failed to apply product:', error);
      this.applyMessage = null;
      this.applyError = error instanceof Error ? error.message : String(error);
    } finally {
      this.isApplying = false;
    }
  }

  isApplied(productId: string): boolean {
    return this.appliedProducts.has(productId);
  }

  getCategoryDisplayName(category: ProductCategory): string {
    return this.productService.getCategoryDisplayName(category);
  }
}

