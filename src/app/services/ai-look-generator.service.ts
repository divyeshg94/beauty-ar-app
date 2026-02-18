import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { GeneratedLook, LookGenerationRequest, Product } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiLookGeneratorService {
  private apiUrl = environment.perfectCorpApiUrl;
  private apiKey = environment.perfectCorpApiKey;

  constructor(private http: HttpClient) {}

  /**
   * Generate a makeup look using AI
   * Uses skin tone analysis for personalized color recommendations
   */
  generateLook(request: LookGenerationRequest): Observable<GeneratedLook> {
    console.log('🎨 Generating AI look with prompt:', request.prompt);
    
    // For production, this would call Perfect Corp's AI Generation API
    // with personalized colors based on skin tone analysis
    return this.getMockGeneratedLook(request).pipe(delay(1500));
  }

  /**
   * Mock generated look for demo purposes
   */
  private getMockGeneratedLook(request: LookGenerationRequest): Observable<GeneratedLook> {
    const looks = this.getMockLooks();
    
    // Create a dynamic hash of the prompt to select a look
    const prompt = request.prompt.toLowerCase();
    
    // Use hash-based selection for variety across all prompts
    const hashCode = prompt.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0);
    const selectedLookIndex = Math.abs(hashCode) % looks.length;
    
    const selectedLook = looks[selectedLookIndex];
    
    console.log(`📍 Selected look index: ${selectedLookIndex} (${selectedLook.name}) for prompt: "${request.prompt}"`);
    
    return of(selectedLook);
  }

  /**
   * Get predefined looks
   */
  getPredefinedLooks(): Observable<GeneratedLook[]> {
    return of(this.getMockLooks());
  }

  /**
   * Mock AI-generated looks
   * In production, these would be generated based on:
   * - User's skin tone (from skin-tone-analysis API)
   * - User's undertone (warm/cool/neutral from skin-analysis API)
   * - Prompt/preferences
   * - Face shape analysis
   */
  private getMockLooks(): GeneratedLook[] {
    return [
      {
        id: 'look-001',
        name: 'Glamorous Evening',
        description: 'Perfect for a night out with bold lips and smokey eyes',
        products: [
          {
            id: 'lip-002',
            name: 'Velvet Matte',
            brand: 'Perfect Beauty',
            category: 'lipstick',
            shade: 'Classic Red',
            colorHex: '#D42D32',
            thumbnail: 'https://via.placeholder.com/100x100/D42D32/ffffff?text=Red',
            price: 24.99
          },
          {
            id: 'eye-002',
            name: 'Shimmer Shadow',
            brand: 'Perfect Eyes',
            category: 'eyeshadow',
            shade: 'Smokey Grey',
            colorHex: '#708090',
            thumbnail: 'https://via.placeholder.com/100x100/708090/ffffff?text=Grey',
            price: 19.99
          },
          {
            id: 'blush-001',
            name: 'Natural Glow',
            brand: 'Perfect Cheeks',
            category: 'blush',
            shade: 'Peachy Pink',
            colorHex: '#FFB7A8',
            thumbnail: 'https://via.placeholder.com/100x100/FFB7A8/ffffff?text=Peach',
            price: 26.99
          },
          {
            id: 'high-001',
            name: 'Radiant Glow',
            brand: 'Perfect Glow',
            category: 'highlighter',
            shade: 'Champagne',
            colorHex: '#F7E7CE',
            thumbnail: 'https://via.placeholder.com/100x100/F7E7CE/000000?text=Champ',
            price: 28.99
          }
        ],
        steps: [
          {
            order: 1,
            product: {
              id: 'eye-002',
              name: 'Shimmer Shadow',
              brand: 'Perfect Eyes',
              category: 'eyeshadow',
              shade: 'Smokey Grey',
              colorHex: '#708090',
              thumbnail: 'https://via.placeholder.com/100x100/708090/ffffff?text=Grey',
              price: 19.99
            },
            application: 'Apply to eyelids and blend',
            intensity: 0.8
          },
          {
            order: 2,
            product: {
              id: 'lip-002',
              name: 'Velvet Matte',
              brand: 'Perfect Beauty',
              category: 'lipstick',
              shade: 'Classic Red',
              colorHex: '#D42D32',
              thumbnail: 'https://via.placeholder.com/100x100/D42D32/ffffff?text=Red',
              price: 24.99
            },
            application: 'Apply evenly to lips',
            intensity: 1.0
          },
          {
            order: 3,
            product: {
              id: 'blush-001',
              name: 'Natural Glow',
              brand: 'Perfect Cheeks',
              category: 'blush',
              shade: 'Peachy Pink',
              colorHex: '#FFB7A8',
              thumbnail: 'https://via.placeholder.com/100x100/FFB7A8/ffffff?text=Peach',
              price: 26.99
            },
            application: 'Apply to cheek apples and blend',
            intensity: 0.7
          }
        ],
        thumbnail: 'https://via.placeholder.com/200x200/D42D32/ffffff?text=Glamorous'
      },
      {
        id: 'look-002',
        name: 'Natural Day',
        description: 'Fresh and clean look for everyday wear',
        products: [
          {
            id: 'lip-001',
            name: 'Velvet Matte',
            brand: 'Perfect Beauty',
            category: 'lipstick',
            shade: 'Rose Pink',
            colorHex: '#E94B8B',
            thumbnail: 'https://via.placeholder.com/100x100/E94B8B/ffffff?text=Rose',
            price: 24.99
          },
          {
            id: 'eye-001',
            name: 'Shimmer Shadow',
            brand: 'Perfect Eyes',
            category: 'eyeshadow',
            shade: 'Golden Bronze',
            colorHex: '#CD7F32',
            thumbnail: 'https://via.placeholder.com/100x100/CD7F32/ffffff?text=Bronze',
            price: 19.99
          },
          {
            id: 'blush-001',
            name: 'Natural Glow',
            brand: 'Perfect Cheeks',
            category: 'blush',
            shade: 'Peachy Pink',
            colorHex: '#FFB7A8',
            thumbnail: 'https://via.placeholder.com/100x100/FFB7A8/ffffff?text=Peach',
            price: 26.99
          }
        ],
        steps: [
          {
            order: 1,
            product: {
              id: 'eye-001',
              name: 'Shimmer Shadow',
              brand: 'Perfect Eyes',
              category: 'eyeshadow',
              shade: 'Golden Bronze',
              colorHex: '#CD7F32',
              thumbnail: 'https://via.placeholder.com/100x100/CD7F32/ffffff?text=Bronze',
              price: 19.99
            },
            application: 'Apply lightly to lids',
            intensity: 0.5
          },
          {
            order: 2,
            product: {
              id: 'lip-001',
              name: 'Velvet Matte',
              brand: 'Perfect Beauty',
              category: 'lipstick',
              shade: 'Rose Pink',
              colorHex: '#E94B8B',
              thumbnail: 'https://via.placeholder.com/100x100/E94B8B/ffffff?text=Rose',
              price: 24.99
            },
            application: 'Apply to lips',
            intensity: 0.8
          }
        ],
        thumbnail: 'https://via.placeholder.com/200x200/E94B8B/ffffff?text=Natural'
      },
      {
        id: 'look-003',
        name: 'Bold & Dramatic',
        description: 'Make a statement with bold colors and sharp lines',
        products: [
          {
            id: 'lip-002',
            name: 'Velvet Matte',
            brand: 'Perfect Beauty',
            category: 'lipstick',
            shade: 'Classic Red',
            colorHex: '#D42D32',
            thumbnail: 'https://via.placeholder.com/100x100/D42D32/ffffff?text=Red',
            price: 24.99
          },
          {
            id: 'eye-004',
            name: 'Matte Shadow',
            brand: 'Perfect Eyes',
            category: 'eyeshadow',
            shade: 'Deep Purple',
            colorHex: '#663399',
            thumbnail: 'https://via.placeholder.com/100x100/663399/ffffff?text=Purple',
            price: 18.99
          },
          {
            id: 'eyeliner-001',
            name: 'Precision Liner',
            brand: 'Perfect Eyes',
            category: 'eyeliner',
            shade: 'Black',
            colorHex: '#000000',
            thumbnail: 'https://via.placeholder.com/100x100/000000/ffffff?text=Black',
            price: 15.99
          }
        ],
        steps: [
          {
            order: 1,
            product: {
              id: 'eye-004',
              name: 'Matte Shadow',
              brand: 'Perfect Eyes',
              category: 'eyeshadow',
              shade: 'Deep Purple',
              colorHex: '#663399',
              thumbnail: 'https://via.placeholder.com/100x100/663399/ffffff?text=Purple',
              price: 18.99
            },
            application: 'Apply bold on lids',
            intensity: 1.0
          },
          {
            order: 2,
            product: {
              id: 'eyeliner-001',
              name: 'Precision Liner',
              brand: 'Perfect Eyes',
              category: 'eyeliner',
              shade: 'Black',
              colorHex: '#000000',
              thumbnail: 'https://via.placeholder.com/100x100/000000/ffffff?text=Black',
              price: 15.99
            },
            application: 'Draw sharp wing',
            intensity: 1.0
          },
          {
            order: 3,
            product: {
              id: 'lip-002',
              name: 'Velvet Matte',
              brand: 'Perfect Beauty',
              category: 'lipstick',
              shade: 'Classic Red',
              colorHex: '#D42D32',
              thumbnail: 'https://via.placeholder.com/100x100/D42D32/ffffff?text=Red',
              price: 24.99
            },
            application: 'Apply bold lip color',
            intensity: 1.0
          }
        ],
        thumbnail: 'https://via.placeholder.com/200x200/663399/ffffff?text=Bold'
      },
      {
        id: 'look-004',
        name: 'Professional Work',
        description: 'Polished and professional look for the office',
        products: [
          {
            id: 'lip-003',
            name: 'Velvet Matte',
            brand: 'Perfect Beauty',
            category: 'lipstick',
            shade: 'Nude Beige',
            colorHex: '#C9A18A',
            thumbnail: 'https://via.placeholder.com/100x100/C9A18A/ffffff?text=Nude',
            price: 24.99
          },
          {
            id: 'eye-003',
            name: 'Shimmer Shadow',
            brand: 'Perfect Eyes',
            category: 'eyeshadow',
            shade: 'Rose Gold',
            colorHex: '#B76E79',
            thumbnail: 'https://via.placeholder.com/100x100/B76E79/ffffff?text=Rose',
            price: 19.99
          },
          {
            id: 'blush-002',
            name: 'Natural Glow',
            brand: 'Perfect Cheeks',
            category: 'blush',
            shade: 'Rosy Mauve',
            colorHex: '#D8A3B8',
            thumbnail: 'https://via.placeholder.com/100x100/D8A3B8/ffffff?text=Mauve',
            price: 26.99
          }
        ],
        steps: [
          {
            order: 1,
            product: {
              id: 'eye-003',
              name: 'Shimmer Shadow',
              brand: 'Perfect Eyes',
              category: 'eyeshadow',
              shade: 'Rose Gold',
              colorHex: '#B76E79',
              thumbnail: 'https://via.placeholder.com/100x100/B76E79/ffffff?text=Rose',
              price: 19.99
            },
            application: 'Apply subtly',
            intensity: 0.6
          },
          {
            order: 2,
            product: {
              id: 'lip-003',
              name: 'Velvet Matte',
              brand: 'Perfect Beauty',
              category: 'lipstick',
              shade: 'Nude Beige',
              colorHex: '#C9A18A',
              thumbnail: 'https://via.placeholder.com/100x100/C9A18A/ffffff?text=Nude',
              price: 24.99
            },
            application: 'Apply neutral lip',
            intensity: 0.9
          }
        ],
        thumbnail: 'https://via.placeholder.com/200x200/C9A18A/ffffff?text=Professional'
      }
    ];
  }
}
