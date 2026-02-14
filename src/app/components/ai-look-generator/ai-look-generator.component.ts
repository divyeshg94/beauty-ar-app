import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiLookGeneratorService } from '../../services/ai-look-generator.service';
import { PerfectCorpArService } from '../../services/perfect-corp-ar.service';
import { GeneratedLook } from '../../models';

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

          <button (click)="applyLook()" class="apply-btn">
            Apply This Look
          </button>
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
      @apply absolute bottom-full right-0 mb-2 w-80 max-w-[calc(100vw-2rem)] floating-overlay text-white;
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
      @apply w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed;
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
      @apply w-full btn-primary;
    }
  `]
})
export class AiLookGeneratorComponent {
  isOpen = false;
  prompt = '';
  isGenerating = false;
  generatedLook: GeneratedLook | null = null;

  constructor(
    private aiService: AiLookGeneratorService,
    private arService: PerfectCorpArService
  ) {}

  toggle() {
    this.isOpen = !this.isOpen;
  }

  async generateLook() {
    if (!this.prompt.trim() || this.isGenerating) return;

    this.isGenerating = true;
    
    try {
      this.generatedLook = await this.aiService.generateLook({
        prompt: this.prompt,
        skinTone: '#D4A373',
        faceShape: 'oval'
      }).toPromise() || null;
    } catch (error) {
      console.error('Failed to generate look:', error);
    } finally {
      this.isGenerating = false;
    }
  }

  async applyLook() {
    if (!this.generatedLook) return;

    for (const product of this.generatedLook.products) {
      await this.arService.applyMakeup({
        productId: product.id,
        category: product.category,
        color: product.colorHex,
        intensity: 0.8,
        blend: 'natural'
      });
      await this.delay(200);
    }

    this.isOpen = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
