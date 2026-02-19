import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
    statistics = [
        {
            value: '60%',
            label: 'Beauty returns',
            description: 'Products returned due to wrong shade/color match'
        },
        {
            value: '$500B',
            label: 'Beauty market',
            description: 'Global beauty industry size in 2024'
        },
        {
            value: '3-5',
            label: 'Store visits',
            description: 'Average visits needed before purchase'
        },
        {
            value: '85%',
            label: 'Frustration',
            description: 'Shoppers frustrated with online beauty shopping'
        }
    ];

    problems = [
        {
            icon: '🎨',
            title: 'Color Mismatch',
            description: 'Product colors look different online vs real life'
        },
        {
            icon: '⏱️',
            title: 'Time Consuming',
            description: 'Multiple store visits to test products wastes time'
        },
        {
            icon: '💸',
            title: 'Costly Returns',
            description: 'Buying wrong products leads to expensive returns'
        },
        {
            icon: '🤷',
            title: 'No Confidence',
            description: 'Uncertain how makeup will look on your unique features'
        }
    ];

    features = [
        {
            icon: '📷',
            title: 'Real-Time AR Try-On',
            description: 'See makeup on your face instantly with live camera',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: '🧬',
            title: 'AI Skin Analysis',
            description: 'Get personalized recommendations based on your skin',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: '✨',
            title: 'AI Look Generator',
            description: 'Generate complete makeup looks with AI in seconds',
            color: 'from-pink-500 to-rose-500'
        },
        {
            icon: '🎯',
            title: 'Smart Color Matching',
            description: 'Find products that perfectly match your skin tone',
            color: 'from-orange-500 to-yellow-500'
        }
    ];

    howItWorks = [
        {
            step: '1',
            title: 'Open Camera',
            description: 'Grant camera access and position your face',
            icon: '📸'
        },
        {
            step: '2',
            title: 'Browse Products',
            description: 'Swipe through lipsticks, eyeshadow, blush, and more',
            icon: '💄'
        },
        {
            step: '3',
            title: 'Try Instantly',
            description: 'Tap any product to see it on your face in real-time',
            icon: '✨'
        },
        {
            step: '4',
            title: 'Shop Confidently',
            description: 'Buy products you know will look perfect on you',
            icon: '🛍️'
        }
    ];

    scrollToDemo() {
        // This will be handled by parent component
        window.dispatchEvent(new CustomEvent('startDemo'));
    }

    scrollToSection(sectionId: string) {
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
}
