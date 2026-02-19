import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArCameraComponent } from './components/ar-camera/ar-camera.component';
import { ProductShelfComponent } from './components/product-shelf/product-shelf.component';
import { SkinAnalysisOverlayComponent } from './components/skin-analysis-overlay/skin-analysis-overlay.component';
import { AiLookGeneratorComponent } from './components/ai-look-generator/ai-look-generator.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        ArCameraComponent,
        ProductShelfComponent,
        SkinAnalysisOverlayComponent,
        AiLookGeneratorComponent,
        LandingPageComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'AI Beauty Assistant';
    showLanding = true;

    ngOnInit() {
        window.addEventListener('startDemo', () => {
            this.startDemo();
        });

        // Check if user previously started demo (optional)
        const hasSeenLanding = sessionStorage.getItem('hasSeenLanding');
        if (hasSeenLanding === 'true') {
            this.showLanding = false;
        }
    }

    startDemo() {
        this.showLanding = false;
        sessionStorage.setItem('hasSeenLanding', 'true');
    }

    backToLanding() {
        this.showLanding = true;
        sessionStorage.setItem('hasSeenLanding', 'false');
    }

    get containerClass() {
        return this.showLanding ? 'show-landing' : '';
    }
}
