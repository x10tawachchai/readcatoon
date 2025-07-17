# Technology Stack

## Frontend
- **Framework**: Vue.js 3 (CDN version)
- **Styling**: Vanilla CSS with responsive design
- **Icons**: Font Awesome 6.0.0
- **Architecture**: Single-page application with reactive data binding

## Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **CORS**: Enabled for cross-origin requests
- **Static serving**: Frontend files served from `/frontend`

## Key Dependencies
- **OCR**: Tesseract.js 6.0.1 (fallback OCR)
- **Translation**: Google Cloud Translate API 9.1.0
- **HTTP Client**: Axios 1.10.0
- **File Upload**: Multer 2.0.1
- **Environment**: dotenv 17.1.0

## External APIs
- **Primary OCR**: OCR-GPT Vision API (configurable endpoint)
- **Fallback Translation**: MyMemory API (free service)
- **Manga Sources**: MangaDx API, J-Novel Club, Rawkuma

## Development Tools
- **Dev Server**: nodemon 3.1.10 for auto-restart
- **Package Manager**: npm with package-lock.json

## Common Commands

### Development
```bash
npm run dev          # Start development server with auto-restart
npm start           # Start production server
npm install         # Install dependencies
```

### Testing
```bash
node test-api.js           # Test basic API endpoints
node test-japanese-ocr.js  # Test Japanese OCR functionality
node test-rawkuma.js       # Test Rawkuma manga source
```

### Environment Setup
```bash
cp .env.example .env       # Copy environment template
# Edit .env with your API keys
```

## Configuration Requirements
- **OCR_GPT_API_URL**: Primary OCR service endpoint
- **OCR_GPT_API_KEY**: API key for OCR-GPT Vision
- **GOOGLE_TRANSLATE_API_KEY**: Optional for better translation quality
- **PORT**: Server port (default: 3001)