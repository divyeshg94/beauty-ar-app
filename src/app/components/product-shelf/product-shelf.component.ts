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
  selectedProducts: Set<string> = new Set();
  isCollapsed = false;
  isApplying = false;
  applyMessage: string | null = null;
  applyError: string | null = null;
  multiSelectMode = false;

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
    // Don't clear selections when switching categories - keep them across categories
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleMultiSelectMode() {
    this.multiSelectMode = !this.multiSelectMode;
    if (!this.multiSelectMode) {
      this.selectedProducts.clear();
    }
  }

  toggleProductSelection(productId: string) {
    // Check if product is already selected
    if (this.selectedProducts.has(productId)) {
      this.selectedProducts.delete(productId);
      return;
    }

    // Get the product to check its category
    const allCategories = this.categories;
    const allProducts = allCategories.flatMap(category => 
      this.productService.getProductsByCategory(category)
    );
    
    const selectedProduct = allProducts.find(p => p.id === productId);
    if (!selectedProduct) return;

    // Check if a product from the same category is already selected
    const categoryAlreadySelected = Array.from(this.selectedProducts).some(selectedId => {
      const selected = allProducts.find(p => p.id === selectedId);
      return selected && selected.category === selectedProduct.category;
    });

    if (categoryAlreadySelected) {
      // Show error message
      this.applyError = `Only one product per category allowed. ${selectedProduct.category} already selected.`;
      setTimeout(() => {
        this.applyError = null;
      }, 3000);
      return;
    }

    // Add to selection
    this.selectedProducts.add(productId);
  }

  isProductSelected(productId: string): boolean {
    return this.selectedProducts.has(productId);
  }

  private loadProducts(category: ProductCategory) {
    this.products = this.productService.getProductsByCategory(category);
  }

  async applyProduct(product: Product) {
    if (this.multiSelectMode) {
      this.toggleProductSelection(product.id);
      return;
    }

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

  async applySelectedProducts() {
    if (this.selectedProducts.size === 0) return;

    console.log('Applying', this.selectedProducts.size, 'selected products from all categories');
    
    try {
      this.isApplying = true;
      this.applyError = null;
      this.applyMessage = `Applying ${this.selectedProducts.size} products… please wait`;

      // Get all products from product service and filter by selected IDs
      const allCategories = this.categories;
      const allCategoryProducts = allCategories.flatMap(category => 
        this.productService.getProductsByCategory(category)
      );

      const selectedProductObjects = allCategoryProducts.filter(p => 
        this.selectedProducts.has(p.id)
      );

      console.log('Selected products to apply:', selectedProductObjects.map(p => p.name));

      await this.arService.applyMakeupBatch(
        selectedProductObjects.map(product => ({
          productId: product.id,
          category: product.category,
          color: product.colorHex,
          intensity: 0.8,
          blend: 'natural'
        }))
      );

      this.applyMessage = null;
      this.selectedProducts.clear();
      this.multiSelectMode = false;
      
    } catch (error) {
      console.error('Failed to apply selected products:', error);
      this.applyMessage = null;
      this.applyError = error instanceof Error ? error.message : String(error);
    } finally {
      this.isApplying = false;
    }
  }

  isApplied(productId: string): boolean {
    return this.appliedProducts.has(productId);
  }

  isProductDisabled(productId: string): boolean {
    if (!this.multiSelectMode) return false;
    
    const allCategories = this.categories;
    const allProducts = allCategories.flatMap(category => 
      this.productService.getProductsByCategory(category)
    );
    
    const product = allProducts.find(p => p.id === productId);
    if (!product) return false;

    // Check if this product is already selected
    if (this.selectedProducts.has(productId)) return false;

    // Check if a different product from the same category is already selected
    return Array.from(this.selectedProducts).some(selectedId => {
      const selected = allProducts.find(p => p.id === selectedId);
      return selected && selected.category === product.category;
    });
  }

  getCategoryDisplayName(category: ProductCategory): string {
    return this.productService.getCategoryDisplayName(category);
  }
}




