import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectCorpArService } from '../../services/perfect-corp-ar.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="action-bar-container">
      <div class="result-image-container" *ngIf="makeupResultUrl">
        <div class="result-image-wrapper">
          <img [src]="makeupResultUrl" alt="Makeup Result" class="result-image">
          <button (click)="closeResult()" class="close-btn">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <div class="result-success">
            <span>? Makeup Applied!</span>
          </div>
        </div>
      </div>
      <div class="action-bar">
        <button (click)="clearMakeup()" class="action-btn">Clear</button>
        <button (click)="saveLook()" class="action-btn">Save</button>
        <button (click)="share()" class="action-btn">Share</button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: contents; }
    .action-bar-container { position: absolute; inset: 0; z-index: 40; pointer-events: none; }
    .result-image-container { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; background-color: rgba(0, 0, 0, 0.85); backdrop-filter: blur(6px); pointer-events: auto; }
    .result-image-wrapper { position: relative; max-width: 95vw; max-height: 95vh; }
    .result-image { width: 100%; height: 100%; object-fit: contain; }
    .close-btn { position: fixed; top: 2rem; right: 2rem; z-index: 10001; width: 3rem; height: 3rem; background: rgba(0, 0, 0, 0.7); border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50%; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 200ms; }
    .close-btn:hover { background-color: rgba(0, 0, 0, 0.9); transform: scale(1.15); }
    .result-success { position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); padding: 0.75rem 1.5rem; background: rgb(34, 197, 94); border-radius: 50px; color: white; font-weight: bold; }
    .action-bar { position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); z-index: 30; display: flex; gap: 1rem; padding: 0.75rem 1.5rem; background: rgba(17, 24, 39, 0.95); backdrop-filter: blur(12px); border-radius: 50px; pointer-events: auto; }
    .action-btn { padding: 0.5rem 1rem; color: white; background: transparent; border: 1px solid rgba(255, 255, 255, 0.2); cursor: pointer; border-radius: 0.25rem; transition: all 200ms; }
    .action-btn:hover { background: rgba(139, 92, 246, 0.2); border-color: rgb(139, 92, 246); }
  `]
})
export class ActionBarComponent implements OnInit, OnDestroy {
  makeupResultUrl: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private arService: PerfectCorpArService) {}

  ngOnInit() {
    this.arService.makeupResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.makeupResultUrl = result?.url || null;
        console.log('Image URL received:', this.makeupResultUrl);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeResult() {
    this.makeupResultUrl = null;
  }

  clearMakeup() {
    this.arService.clearMakeup();
    this.closeResult();
  }

  saveLook() {
    if (this.makeupResultUrl) {
      const link = document.createElement('a');
      link.href = this.makeupResultUrl;
      link.download = `beauty-look-${Date.now()}.jpg`;
      link.click();
    }
  }

  share() {
    if (navigator.share) {
      navigator.share({
        title: 'My Beauty Look',
        text: 'Check out my makeup!',
        url: window.location.href
      });
    }
  }
}
