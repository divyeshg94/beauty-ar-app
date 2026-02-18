import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectCorpArService } from '../../services/perfect-corp-ar.service';
import { SkinAnalysis } from '../../models';

@Component({
  selector: 'app-skin-analysis-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="skinAnalysis" class="skin-analysis-overlay">
      <div class="analysis-card">
        <h3 class="text-lg font-bold mb-3">Skin Analysis</h3>
        
        <div class="metric">
          <span class="metric-label">Skin Tone:</span>
          <div class="flex items-center gap-2">
            <div class="color-dot" [style.background-color]="skinAnalysis.skinTone.hex"></div>
            <span class="metric-value">{{ skinAnalysis.skinTone.name }}</span>
          </div>
        </div>

        <div class="metric">
          <span class="metric-label">Tone Category:</span>
          <span class="metric-value">{{ skinAnalysis.skinTone.category }}</span>
        </div>

        <div class="metric">
          <span class="metric-label">Undertone:</span>
          <span class="metric-value">{{ skinAnalysis.undertone }}</span>
        </div>

        <div class="metric">
          <span class="metric-label">Hydration:</span>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="skinAnalysis.hydration"></div>
          </div>
          <span class="metric-value">{{ skinAnalysis.hydration }}%</span>
        </div>

        <div class="metric">
          <span class="metric-label">Texture:</span>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="skinAnalysis.texture"></div>
          </div>
          <span class="metric-value">{{ skinAnalysis.texture }}%</span>
        </div>

        <button (click)="refresh()" class="refresh-btn">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </button>
      </div>
    </div>
  `,
  styles: [`
    .skin-analysis-overlay {
      @apply absolute top-20 right-4 z-20;
      max-width: 280px;
    }

    .analysis-card {
      @apply bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-4 text-white;
    }

    .metric {
      @apply flex flex-col gap-1 mb-3;
    }

    .metric-label {
      @apply text-sm text-gray-300 font-medium;
    }

    .metric-value {
      @apply text-sm font-semibold;
    }

    .color-dot {
      @apply w-4 h-4 rounded-full border-2 border-white shadow;
    }

    .progress-bar {
      @apply w-full h-2 bg-gray-700 rounded-full overflow-hidden;
    }

    .progress-fill {
      @apply h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500;
    }

    .refresh-btn {
      @apply mt-2 flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors;
    }
  `]
})
export class SkinAnalysisOverlayComponent implements OnInit {
  skinAnalysis: SkinAnalysis | null = null;

  constructor(private arService: PerfectCorpArService) {}

  ngOnInit() {
    this.arService.skinAnalysis$.subscribe(analysis => {
      this.skinAnalysis = analysis;
    });

    // Initial analysis after 2 seconds
    setTimeout(() => this.refresh(), 2000);
  }

  async refresh() {
    await this.arService.analyzeSkin();
  }
}
