# 🎌 Manga Translation App

A web application that translates English manga to Thai using OCR and Google Translate API.

## 🚀 Features

- **MangaDx Integration**: Fetch manga chapters directly from MangaDx URLs
- **OCR Text Recognition**: Extract text from manga images using Tesseract.js
- **Translation**: Translate English text to Thai using Google Translate API
- **Modern UI**: Beautiful, responsive Vue.js interface
- **Real-time Processing**: Live OCR and translation as images load

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3, HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **OCR**: Tesseract.js
- **Translation**: Google Translate API
- **HTTP Client**: Axios
- **CORS**: Cross-origin resource sharing enabled

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd readcatoon
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Google Translate API key.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3001`

## 🔧 Configuration

### Google Translate API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Translate API
4. Create credentials (API Key)
5. Add your API key to the `.env` file:
   ```
   GOOGLE_TRANSLATE_API_KEY=your_api_key_here
   ```

### Environment Variables

- `PORT`: Server port (default: 3001)
- `GOOGLE_TRANSLATE_API_KEY`: Your Google Translate API key

## 🎯 Usage

1. **Enter MangaDx URL**: Paste a MangaDx chapter URL (e.g., `https://mangadx.org/chapter/12345`)
2. **Load Chapter**: Click "โหลดตอน" to fetch manga images
3. **Automatic Processing**: The app will:
   - Load each manga page
   - Perform OCR to extract English text
   - Translate text to Thai
   - Display results below each image

## 📁 Project Structure

```
readcatoon/
├── backend/
│   └── server.js          # Express.js server
├── frontend/
│   ├── index.html         # Main HTML file
│   └── app.js            # Vue.js application
├── .env.example          # Environment variables template
├── package.json          # Node.js dependencies
└── README.md            # This file
```

## 🔍 API Endpoints

- `POST /api/manga/chapter`: Fetch chapter data and images from MangaDx
- `POST /api/translate`: Translate text using Google Translate API
- `GET /api/health`: Health check endpoint

## 🚨 Known Limitations

1. **CORS**: Some manga images may have CORS restrictions
2. **OCR Accuracy**: Text recognition depends on image quality
3. **Rate Limits**: Google Translate API has rate limits
4. **MangaDx API**: Subject to MangaDx API changes and limits

## 🛡️ Error Handling

The application includes comprehensive error handling for:
- Invalid MangaDx URLs
- Network connectivity issues
- OCR processing errors
- Translation API failures
- Image loading problems

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop browsers
- Mobile devices
- Tablets

## 🔄 Development

### Running in Development Mode

```bash
npm run dev
```

This starts the server with nodemon for automatic restarts.

### Production Deployment

```bash
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- [MangaDx](https://mangadx.org/) for manga content
- [Tesseract.js](https://tesseract.projectnaptha.com/) for OCR
- [Google Translate](https://cloud.google.com/translate) for translation
- [Vue.js](https://vuejs.org/) for the frontend framework
#   r e a d c a t o o n  
 