import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectCorpArService } from '../../services/perfect-corp-ar.service';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="action-bar">
      <button (click)="clearMakeup()" class="action-btn" title="Clear All">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
        <span class="text-xs">Clear</span>
      </button>

      <button (click)="saveLook()" class="action-btn" title="Save Look">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
        <span class="text-xs">Save</span>
      </button>

      <button (click)="share()" class="action-btn" title="Share">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
        </svg>
        <span class="text-xs">Share</span>
      </button>
    </div>
  `,
  styles: [`
    .action-bar {
      @apply absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30
             flex items-center gap-4 px-6 py-3 bg-gray-900 bg-opacity-90 backdrop-blur-lg
             rounded-full shadow-xl;
    }

    .action-btn {
      @apply flex flex-col items-center gap-1 px-3 py-2 text-white
             hover:text-primary-400 transition-colors duration-200;
    }
  `]
})
export class ActionBarComponent {
  constructor(private arService: PerfectCorpArService) {}

  clearMakeup() {
    this.arService.clearMakeup();
    console.log('✨ Cleared all makeup');
  }

  saveLook() {
    console.log('💾 Save look functionality');
    // Implement save to favorites
    alert('Look saved to favorites!');
  }

  share() {
    console.log('🔗 Share functionality');
    // Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: 'My Beauty Look',
        text: 'Check out my AI-generated beauty look!',
        url: window.location.href
      });
    } else {
      alert('Share your look on social media!');
    }
  }
}
