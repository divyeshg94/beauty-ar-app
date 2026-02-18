import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiLookGeneratorService } from '../../services/ai-look-generator.service';
import { PerfectCorpArService, MakeupVTOResult } from '../../services/perfect-corp-ar.service';
import { GeneratedLook } from '../../models';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-ai-look-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ai-generator-container" [class.open]="isOpen">
      <button (click)="toggle()" class="toggle-btn">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.477.859h4z"></path>
        </svg>
        AI Looks
      </button>

      <div *ngIf="isOpen" class="generator-panel">
        <h3 class="text-lg font-bold mb-4">Generate AI Look</h3>
        
        <div class="input-group">
          <input 
            [(ngModel)]="prompt"
            (keyup.enter)="generateLook()"
            type="text" 
            placeholder="e.g., 'glamorous evening look'"
            class="prompt-input">
          <button (click)="generateLook()" [disabled]="isGenerating" class="generate-btn">
            <span *ngIf="!isGenerating">Generate</span>
            <span *ngIf="isGenerating" class="flex items-center gap-2">
              <div class="spinner-sm"></div>
              Generating...
            </span>
          </button>
        </div>

        <div *ngIf="generatedLook" class="generated-look">
          <h4 class="font-semibold mb-2">{{ generatedLook.name }}</h4>
          <p class="text-sm text-gray-400 mb-3">{{ generatedLook.description }}</p>
          
          <div class="products-grid">
            <div *ngFor="let product of generatedLook.products" class="mini-product">
              <div class="color-swatch-sm" [style.background-color]="product.colorHex"></div>
              <span class="text-xs">{{ product.shade }}</span>
            </div>
          </div>

          <button (click)="applyLook()" [disabled]="isApplying" class="apply-btn">
            <span *ngIf="!isApplying">Apply This Look</span>
            <span *ngIf="isApplying" class="flex items-center justify-center gap-2">
              <div class="spinner-sm"></div>
              Applying...
            </span>
          </button>
        </div>
      </div>

      <!-- Toast Notifications -->
      <div class="toast-container">
        <div *ngFor="let toast of toasts" [class]="'toast toast-' + toast.type">
          <div class="toast-content">
            <svg *ngIf="toast.type === 'success'" class="w-5 h-5 toast-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <svg *ngIf="toast.type === 'error'" class="w-5 h-5 toast-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <svg *ngIf="toast.type === 'info'" class="w-5 h-5 toast-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
            <span>{{ toast.message }}</span>
          </div>
        </div>
      </div>

      <!-- Makeup Result Modal -->
      <div *ngIf="makeupResult" class="result-modal-overlay" (click)="closeResultModal()">
        <div class="result-modal" (click)="$event.stopPropagation()">
          <div class="result-header">
            <h3>✓ Makeup Applied Successfully</h3>
            <button class="close-btn" (click)="closeResultModal()">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="result-content">
            <!-- Result Image -->
            <div class="result-image-container">
              <img #resultImage [src]="makeupResult.url" alt="Makeup result" class="result-image">
            </div>

            <!-- Applied Products List -->
            <div class="applied-products-section">
              <h4 *ngIf="makeupResult.appliedProducts && makeupResult.appliedProducts.length > 0">
                {{ makeupResult.appliedProducts.length }} Products Applied
              </h4>
              <h4 *ngIf="!makeupResult.appliedProducts || makeupResult.appliedProducts.length === 0">
                Product Applied
              </h4>
              <div class="products-list" *ngIf="makeupResult.appliedProducts && makeupResult.appliedProducts.length > 0">
                <div *ngFor="let product of makeupResult.appliedProducts" class="product-item">
                  <div class="product-color" [style.background-color]="product.color"></div>
                  <div class="product-details">
                    <div class="product-category">{{ product.category }}</div>
                    <div class="product-shade">{{ product.color }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="result-actions">
            <button class="download-btn" (click)="downloadResultImage()">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download
            </button>
            <button class="result-close-btn" (click)="closeResultModal()">Done</button>
          </div>
        </div>
      </div>
  `,
  styles: [`
    .ai-generator-container {
      @apply absolute bottom-28 right-4 z-30;
    }

    .toggle-btn {
      @apply flex items-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-full shadow-lg
             hover:bg-primary-600 transition-all duration-200 transform hover:scale-105;
    }

    .generator-panel {
      @apply absolute bottom-full right-0 mb-2 w-80 max-w-[calc(100vw-2rem)] bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-4 text-white;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .input-group {
      @apply flex flex-col gap-2 mb-4;
    }

    .prompt-input {
      @apply w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500;
    }

    .generate-btn {
      @apply w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed;
    }

    .spinner-sm {
      @apply w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin;
    }

    .generated-look {
      @apply pt-4 border-t border-gray-700;
    }

    .products-grid {
      @apply grid grid-cols-4 gap-2 mb-3;
    }

    .mini-product {
      @apply flex flex-col items-center gap-1;
    }

    .color-swatch-sm {
      @apply w-12 h-12 rounded-lg shadow;
    }

    .apply-btn {
      @apply w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed;
    }

    .toast-container {
      @apply fixed bottom-4 right-4 z-50 flex flex-col gap-2;
    }

    .toast {
      @apply min-w-80 px-4 py-3 rounded-lg shadow-lg;
      animation: slideIn 0.3s ease-out;
    }

    .toast-success {
      @apply bg-green-500 text-white;
    }

    .toast-error {
      @apply bg-red-500 text-white;
    }

    .toast-info {
      @apply bg-blue-500 text-white;
    }

    .toast-content {
      @apply flex items-center gap-2;
    }

    .toast-icon {
      @apply font-bold text-lg;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .result-modal-overlay {
      @apply fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center;
    }

    .result-modal {
      @apply bg-gray-900 rounded-lg shadow-2xl border border-gray-700 max-w-xl w-full mx-4 overflow-hidden max-h-[90vh];
      animation: slideUp 0.3s ease-out;
      display: flex;
      flex-direction: column;
    }

    .result-header {
      @apply flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800;
      flex-shrink: 0;
    }

    .result-header h3 {
      @apply text-lg font-bold text-white m-0;
    }

    .close-btn {
      @apply text-gray-400 hover:text-white transition-colors duration-200 bg-none border-none cursor-pointer p-0;
    }

    .result-content {
      @apply p-6 space-y-4 overflow-y-auto;
      flex: 1;
    }

    .result-image-container {
      @apply rounded-lg overflow-hidden bg-gray-800 flex-shrink-0;
      max-height: 500px;
    }

    .result-image {
      @apply w-full h-auto object-cover;
    }

    .applied-products-section {
      @apply border-t border-gray-700 pt-4;
    }

    .applied-products-section h4 {
      @apply text-sm font-semibold text-gray-300 mb-3 m-0;
    }

    .products-list {
      @apply space-y-2 max-h-[300px] overflow-y-auto;
    }

    .product-item {
      @apply flex items-center gap-3 p-2 bg-gray-800 rounded-lg;
    }

    .product-color {
      @apply w-10 h-10 rounded-lg shadow border border-gray-600;
    }

    .product-details {
      @apply flex-1;
    }

    .product-category {
      @apply text-xs font-semibold text-gray-400 uppercase;
    }

    .product-shade {
      @apply text-xs text-gray-500;
    }

    .result-close-btn {
      @apply w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold border-t border-gray-700 transition-all duration-300;
    }

    .result-actions {
      @apply flex gap-2 border-t border-gray-700 p-4 bg-gray-800;
      flex-shrink: 0;
    }

    .download-btn {
      @apply flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300;
      @apply transform hover:scale-105 active:scale-95;

      svg {
        @apply w-5 h-5;
      }
    }

    .result-close-btn {
      @apply flex-1 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-300;
      @apply transform hover:scale-105 active:scale-95 border-none;
    }
  `]
})
export class AiLookGeneratorComponent {
isOpen = false;
prompt = '';
isGenerating = false;
isApplying = false;
generatedLook: GeneratedLook | null = null;
toasts: Toast[] = [];
makeupResult: MakeupVTOResult | null = null;

  constructor(
    private aiService: AiLookGeneratorService,
    private arService: PerfectCorpArService
  ) {
    // Subscribe to makeup results to display in modal
    // Show modal for both batch operations and single products
    this.arService.makeupResult$.subscribe(result => {
      if (result?.url) {
        this.makeupResult = result;
        console.log('✓ Makeup result received with', result.appliedProducts?.length || 1, 'product(s)');
      }
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  async generateLook() {
    if (!this.prompt.trim() || this.isGenerating) return;

    this.isGenerating = true;
    this.showToast('Generating AI look...', 'info');
    
    try {
      this.generatedLook = await this.aiService.generateLook({
        prompt: this.prompt,
        skinTone: '#D4A373',
        faceShape: 'oval'
      }).toPromise() || null;
      
      if (this.generatedLook) {
        this.showToast(`Generated "${this.generatedLook.name}" look successfully!`, 'success');
      }
    } catch (error) {
      console.error('Failed to generate look:', error);
      this.showToast('Failed to generate look. Please try again.', 'error');
    } finally {
      this.isGenerating = false;
    }
  }

  async applyLook() {
    if (!this.generatedLook || this.isApplying) return;

    this.isApplying = true;
    this.showToast('Applying makeup look...', 'info');

    try {
      // Apply all makeup products in a single AR operation
      await this.arService.applyMakeupBatch(
        this.generatedLook.products.map(product => ({
          productId: product.id,
          category: product.category,
          color: product.colorHex,
          intensity: 0.8,
          blend: 'natural'
        }))
      );
      
      this.showToast(`${this.generatedLook.name} applied successfully!`, 'success');
      this.isOpen = false;
    } catch (error) {
      console.error('Failed to apply makeup:', error);
      this.showToast('Failed to apply makeup. Please try again.', 'error');
    } finally {
      this.isApplying = false;
    }
  }

  closeResultModal() {
    this.makeupResult = null;
  }

  downloadResultImage() {
    if (!this.makeupResult?.url) return;

    try {
      const link = document.createElement('a');
      link.href = this.makeupResult.url;
      link.download = `makeup-look-${new Date().getTime()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.showToast('Image downloaded successfully!', 'success');
    } catch (error) {
      console.error('Failed to download image:', error);
      this.showToast('Failed to download image. Please try again.', 'error');
    }
  }



  private showToast(message: string, type: 'success' | 'error' | 'info') {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type };
    
    this.toasts.push(toast);
    
    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== id);
    }, 3000);
  }
}
