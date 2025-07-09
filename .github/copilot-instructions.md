# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a manga translation web application project with the following structure:

## Project Overview
- **Frontend**: Vue.js application for user interface
- **Backend**: Node.js/Express.js API server
- **OCR**: Tesseract.js for text recognition from manga images
- **Translation**: Google Translate API for English to Thai translation
- **Data Source**: MangaDex API for fetching manga images

## Key Features
1. Accept MangaDex chapter URLs
2. Fetch images from MangaDx API
3. Perform OCR on manga images to extract text
4. Translate extracted English text to Thai
5. Display original image with OCR text and Thai translation

## Tech Stack
- Frontend: Vue.js 3, HTML5, CSS3, JavaScript
- Backend: Node.js, Express.js, Axios
- OCR: Tesseract.js
- Translation: Google Translate API
- CORS handling for cross-origin requests

## Development Guidelines
- Use modern JavaScript (ES6+) features
- Implement proper error handling for API calls
- Ensure responsive design for mobile and desktop
- Follow Vue.js 3 composition API patterns
- Use async/await for asynchronous operations
- Implement proper validation for MangaDex URLs
