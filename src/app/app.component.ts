import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArCameraComponent } from './components/ar-camera/ar-camera.component';
import { ProductShelfComponent } from './components/product-shelf/product-shelf.component';
import { SkinAnalysisOverlayComponent } from './components/skin-analysis-overlay/skin-analysis-overlay.component';
import { AiLookGeneratorComponent } from './components/ai-look-generator/ai-look-generator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ArCameraComponent,
    ProductShelfComponent,
    SkinAnalysisOverlayComponent,
    AiLookGeneratorComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AI Beauty Assistant';
  showWelcome = true;

  ngOnInit() {
    // Hide welcome screen after 2 seconds
    setTimeout(() => {
      this.showWelcome = false;
    }, 2000);
  }

  dismissWelcome() {
    this.showWelcome = false;
  }
}
