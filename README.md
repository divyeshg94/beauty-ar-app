# AI Beauty Assistant - Virtual Try-On App

![AI Beauty Assistant](https://img.shields.io/badge/DeveloperWeek%202026-Hackathon-blueviolet)
![Angular](https://img.shields.io/badge/Angular-18+-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-Latest-blue)

## 🎨 Project Overview

**AI Beauty Assistant** is an innovative augmented reality (AR) virtual try-on application built for the **DeveloperWeek Hackathon 2026**. Powered by **Perfect Corp's AI Makeup VTO API**, this app enables users to visualize makeup looks in real-time through their camera, get personalized AI-generated recommendations, and experiment with different products all at once.

### Key Achievements
- ✨ Real-time AR makeup visualization
- 🤖 AI-powered look generation with customizable prompts
- 📊 Comprehensive skin analysis and tone detection
- 🎯 Batch makeup application (multiple products simultaneously)
- 📸 High-fidelity rendered results with product details
- 🎭 Multi-select product application across categories

---

## 🔗 Perfect Corp APIs Used

This application leverages the following **Perfect Corp YouCam APIs**:

### 1. **Makeup VTO (Virtual Try-On) API**
- **Purpose:** Apply virtual makeup to face images in real-time
- **Endpoint:** `POST /task/makeup-vto`
- **Features:**
  - Apply lipstick, eyeshadow, blush, eyeliner, mascara, foundation, highlighter
  - Batch makeup application (multiple products in single request)
  - High-quality rendered output images
  - Support for custom colors, textures, and intensities
- **Usage in App:** Core feature for visualizing makeup looks

### 2. **Skin Analysis API** (Includes Skin Tone Detection)
- **Purpose:** Analyze skin characteristics and provide beauty insights
- **Endpoints:** 
  - `POST /file/skin-analysis` - Request upload URL
  - `POST /task/skin-analysis` - Create analysis task
  - `GET /task/skin-analysis/{task_id}` - Poll for results
- **Key Features:**
  - **🎨 Skin Tone Detection** - Identifies skin tone with precise hex color values
    - Returns color hex (e.g., #D4A373)
    - Provides undertone classification (Warm/Cool/Neutral)
    - Enables personalized color recommendations
  - Texture analysis (smoothness quality 0-100%)
  - Pore visibility assessment
  - Wrinkle detection
  - Blemish/acne detection
  - Hydration level evaluation
  - Overall skin health scoring
- **Usage in App:** 
  - Skin analysis overlay with detailed metrics
  - Personalized makeup color recommendations based on skin tone
  - Undertone-matched product suggestions

### 3. **File Upload & Management API**
- **Purpose:** Secure image upload and management
- **Endpoints:**
  - `POST /file/skin-analysis` - Upload for skin analysis
  - `POST /file/makeup-vto` - Upload for makeup VTO
- **Features:**
  - S3 pre-signed URL generation
  - Secure file storage
  - File ID tracking for API operations
  - Support for JPEG images
- **Usage in App:** Uploading camera frames for analysis and makeup application

### 4. **Task Management & Polling API**
- **Purpose:** Asynchronous task processing and result retrieval
- **Pattern:**
  1. Create task → Get `task_id`
  2. Poll task status → Check if `running`/`completed`/`failed`
  3. Retrieve results → Get processed image or analysis data
- **Polling Strategy:** 
  - Maximum 60 attempts
  - 1-second intervals between polls
  - Auto-retry with exponential backoff
- **Usage in App:** Both skin analysis and makeup VTO use task polling

---

### Core Features

#### 1. **Real-Time AR Camera**
- Live face detection and tracking
- Landmark visualization for makeup placement
- Smooth real-time rendering
- Support for multiple cameras (front/back)
- High-resolution photo capture

#### 2. **AI Look Generator**
- Natural language prompt-based look generation
- Hash-based variety algorithm ensures different prompts generate different looks
- Predefined makeup looks categorized by style
- Processing indicators and status messages
- Success/error toast notifications

#### 3. **Smart Product Selection**
- Browse makeup products by category (Lipstick, Eyeshadow, Blush, Foundation, Eyeliner, Highlighter)
- **Multi-select mode** for composing custom looks
- **One product per category constraint** - prevents multiple products from the same category
- Visual feedback for selected products
- Cross-category product selection

#### 4. **Batch Makeup Application**
- Apply multiple products in a **single VTO operation** (not sequentially)
- Combined result image with all makeup applied
- All products rendered together for realistic visualization
- Fast processing with beautiful result modal

#### 5. **Skin Analysis & Tone Detection** ⭐
- AI-powered skin tone detection (Perfect Corp YouCam API)
- Precise hex color value for skin tone
- Undertone classification (Warm, Cool, Neutral)
- Skin texture quality assessment
- Pores, wrinkles, and blemish assessment
- Hydration level evaluation
- Overall skin health score (0-100)
- **Personalized recommendations** based on detected skin tone and undertone
- Beautiful results modal with comprehensive metrics

#### 6. **Result Visualization**
- Beautiful modal displaying:
  - High-quality result image
  - List of all applied products
  - Product colors and categories
  - Color hex values
- Result modal only shows for batch operations
- Auto-dismisses after interaction

---

## 🛠 Technology Stack

### Frontend
- **Angular 18+** - Modern web framework with standalone components
- **TypeScript 5.0+** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **RxJS** - Reactive programming for observables
- **Angular Forms** - Reactive and template-driven forms

### APIs & Services
- **Perfect Corp YouCam API**
  - Skin Analysis API
  - Makeup VTO (Virtual Try-On) API
  - File Upload & Task Management
- **S3 Bucket Integration** - Image hosting

### Build & Development
- **Angular CLI** - Build tooling
- **Webpack** - Module bundling
- **TypeScript Compiler** - Type checking
- **SCSS** - Styled component styling

---

## 📋 Installation & Setup

### Prerequisites
- Node.js 18+ and npm 9+
- Angular CLI 18+
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/divyeshg94/beauty-ar-app.git
cd beauty-ar-app
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  perfectCorpApiUrl: 'https://yce.perfectcorp.com/api/v2',
  perfectCorpApiKey: 'YOUR_API_KEY_HERE'
};
```

Create `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  perfectCorpApiUrl: 'https://yce.perfectcorp.com/api/v2',
  perfectCorpApiKey: 'YOUR_API_KEY_HERE'
};
```

### Step 4: Start Development Server
```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser.

### Step 5: Build for Production
```bash
ng build --configuration production
```

---

## 🎮 Usage Guide

### 1. **Initialize Camera**
- Allow camera access when prompted
- Position your face in the frame
- Wait for face detection indicator to appear (green badge)

### 2. **Analyze Your Skin**
- Click "Analyze My Skin" button
- Wait 3-5 seconds for analysis to complete
- View skin tone, texture, pores, wrinkles, and overall score
- Results include personalized color recommendations

### 3. **Apply Single Product**
- Browse products by category using tabs
- Click any product to apply instantly
- See real-time makeup visualization on your face

### 4. **Apply Custom Look (Multi-Select)**
- Click "Multi-Select" button in product sidebar
- Browse across categories freely
- Select products from different categories (one per category)
- Selected products appear highlighted with checkboxes
- Click "Apply X Selected" to apply all at once
- View combined result in modal

### 5. **Generate AI Look**
- Click "AI Looks" button (bottom right)
- Enter a makeup style description (e.g., "glamorous evening look", "bold dramatic makeup")
- Click "Generate" to create a look
- Review suggested products
- Click "Apply This Look" to visualize all products together
- View detailed result with all applied products listed

### 6. **Capture & Share**
- Click "Capture" to save photos to your device
- Download high-resolution screenshots of makeup results

---

## 🏗 Architecture

### Component Structure
```
src/app/
├── components/
│   ├── ai-look-generator/          # AI-powered look generation
│   │   ├── ai-look-generator.component.ts
│   │   ├── ai-look-generator.component.html
│   │   └── ai-look-generator.component.scss
│   ├── ar-camera/                  # Real-time AR visualization
│   │   ├── ar-camera.component.ts
│   │   ├── ar-camera.component.html
│   │   └── ar-camera.component.scss
│   ├── product-shelf/              # Product browser & selector
│   │   ├── product-shelf.component.ts
│   │   ├── product-shelf.component.html
│   │   └── product-shelf.component.scss
│   └── skin-analysis-overlay/      # Skin analysis results
│       ├── skin-analysis-overlay.component.ts
│       └── skin-analysis-overlay.component.html
├── services/
│   ├── ai-look-generator.service.ts    # AI look generation logic
│   ├── perfect-corp-ar.service.ts      # Perfect Corp API integration
│   ├── camera.service.ts               # Camera & video management
│   └── product.service.ts              # Product data management
├── models/
│   └── index.ts                    # TypeScript interfaces
├── app.component.ts                # Root component
└── styles.scss                     # Global styles
```

### Data Flow
```
Camera Stream
    ↓
Face Detection (AR Engine)
    ↓
Skin Analysis (YouCam API)
    ↓
Makeup Selection (UI)
    ↓
Batch Apply (applyMakeupBatch)
    ↓
VTO Processing (Perfect Corp API)
    ↓
Result Image Display (Modal)
```

---

## 🔌 API Integration: Perfect Corp

### Authentication
All requests require:
```
Authorization: Bearer {YOUR_API_KEY}
Content-Type: application/json
```

### Key Endpoints

#### 1. Skin Analysis
**Endpoint:** `POST /file/skin-analysis`
- Upload image for analysis
- Returns: `file_id` and S3 upload URL

**Task Creation:** `POST /task/skin-analysis`
- Create analysis task with file_id
- Returns: `task_id`

**Poll Results:** `GET /task/skin-analysis/{task_id}`
- Get analysis results (texture, pores, wrinkles, skin tone)

#### 2. Makeup VTO
**Endpoint:** `POST /task/makeup-vto`
```typescript
{
  version: '1.0',
  effects: [
    {
      category: 'lip_color',
      palettes: [{
        color: '#D42D32',
        texture: 'matte',
        colorIntensity: 80
      }]
    }
  ],
  src_file_url: 'https://...'
}
```

**Poll Results:** `GET /task/makeup-vto/{task_id}`
- Returns: `url` with rendered image

---

## 🎯 Key Implementation Details

### AI Look Generation
```typescript
// Hash-based variety algorithm
const hashCode = prompt.split('').reduce(
  (acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0
);
const selectedLookIndex = Math.abs(hashCode) % looks.length;
```
- Different prompts generate different looks
- Keyword overrides for specific styles

### Batch Makeup Application
```typescript
await this.arService.applyMakeupBatch(
  selectedProducts.map(product => ({
    productId: product.id,
    category: product.category,
    color: product.colorHex,
    intensity: 0.8,
    blend: 'natural'
  }))
);
```
- All products applied in single VTO operation
- Combined result image with all makeup

### Multi-Select Constraint
```typescript
// Only one product per category
const categoryAlreadySelected = Array.from(this.selectedProducts)
  .some(selectedId => {
    const selected = allProducts.find(p => p.id === selectedId);
    return selected?.category === selectedProduct.category;
  });
```

---

## 🧪 Testing

### Run Unit Tests
```bash
ng test
```

### Run E2E Tests
```bash
ng e2e
```

### Build & Serve Production
```bash
ng build --configuration production
ng serve --configuration production
```

---

## 🚀 Deployment

### Deploy to Firebase
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag & drop dist/ folder to Netlify
```

---

## 🎓 Learning Resources

### Perfect Corp Documentation
- [YouCam API Docs](https://yce.perfectcorp.com/document)
- [Makeup VTO Guide](https://yce.perfectcorp.com/document/index.html#tag/AI-Makeup-Vto)
- [API Examples](https://yce.perfectcorp.com/document/index.html)

### Angular Resources
- [Angular Official Docs](https://angular.io)
- [Angular Components](https://angular.io/guide/component-overview)
- [RxJS Guide](https://rxjs.dev)

### Web APIs
- [Media Devices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use TypeScript strict mode
- Follow Angular style guide
- Add meaningful commit messages
- Include tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏆 DeveloperWeek Hackathon 2026

This project was created for the **DeveloperWeek Hackathon 2026** as a demonstration of:
- Modern web technologies (Angular 18+, TypeScript)
- Real-time AR capabilities
- AI-powered personalization
- API integration best practices
- User experience design

### Project Highlights
- ✅ Real-time face detection and tracking
- ✅ AI-generated makeup recommendations
- ✅ Batch product application (multiple at once)
- ✅ Skin analysis and tone detection
- ✅ Beautiful result visualization
- ✅ Responsive design
- ✅ Comprehensive error handling
- ✅ Toast notifications & user feedback

---

## 👥 Team

**Developed by:** Divyesh Govaerdhanan  
**Project:** AI Beauty Assistant  
**Event:** DeveloperWeek Hackathon 2026  
**API Partner:** Perfect Corp (YouCam)

---

## 📞 Support

For issues, questions, or suggestions:
- 📧 Email: [divyeshgovardhanan@gmail.com]
- 🐙 GitHub Issues: [Create an issue](https://github.com/divyeshg94/beauty-ar-app/issues)
- 💬 Discussions: [Start a discussion](https://github.com/divyeshg94/beauty-ar-app/discussions)

---

## 🎉 Acknowledgments

- **Perfect Corp** - For the amazing YouCam API
- **Angular Team** - For the excellent framework
- **DeveloperWeek** - For hosting the hackathon
- **All Contributors** - For their support and feedback

---

## 📈 Roadmap

### Upcoming Features
- [ ] User authentication & profiles
- [ ] Save favorite looks
- [ ] Share looks with friends
- [ ] Advanced skin analysis
- [ ] Color matching recommendations
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations
- [ ] Makeup tutorials
- [ ] Video recording with makeup
- [ ] AR filters marketplace

### Performance Optimizations
- [ ] Image compression
- [ ] Lazy loading
- [ ] Caching strategies
- [ ] Service worker
- [ ] Progressive Web App (PWA)

---

**Made with ❤️ for the DeveloperWeek Hackathon 2026**
