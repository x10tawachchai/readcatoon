const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Translate } = require('@google-cloud/translate').v2;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static('frontend'));

// Proxy endpoint for manga images to handle CORS
app.get('/api/proxy-image', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const response = await axios.get(url, {
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://mangadx.org/'
      }
    });

    // Set appropriate headers
    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Pipe the image stream to response
    response.data.pipe(res);

  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ error: 'Failed to load image' });
  }
});

// Initialize Google Translate (you'll need to set up credentials)
const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY
});

// MangaDx API base URL
const MANGADX_API_BASE = 'https://api.mangadex.org';

// Helper function to extract chapter ID from MangaDx URL
function extractChapterId(url) {
  const match = url.match(/\/chapter\/([a-f0-9-]+)/);
  return match ? match[1] : null;
}

// Route to get chapter images from MangaDx
app.post('/api/manga/chapter', async (req, res) => {
  try {
    const { chapterUrl } = req.body;
    
    if (!chapterUrl) {
      return res.status(400).json({ error: 'Chapter URL is required' });
    }

    const chapterId = extractChapterId(chapterUrl);
    if (!chapterId) {
      return res.status(400).json({ error: 'Invalid MangaDx chapter URL' });
    }

    // Get chapter data
    const chapterResponse = await axios.get(`${MANGADX_API_BASE}/chapter/${chapterId}`);
    const chapterData = chapterResponse.data.data;

    // Get chapter images from At-Home server
    const atHomeResponse = await axios.get(`${MANGADX_API_BASE}/at-home/server/${chapterId}`);
    const atHomeData = atHomeResponse.data;

    const baseUrl = atHomeData.baseUrl;
    const hash = atHomeData.chapter.hash;
    const data = atHomeData.chapter.data; // High quality images

    // Construct image URLs
    const imageUrls = data.map(filename => 
      `${baseUrl}/data/${hash}/${filename}`
    );

    res.json({
      chapterId,
      title: chapterData.attributes.title,
      pages: imageUrls.length,
      images: imageUrls
    });

  } catch (error) {
    console.error('Error fetching chapter:', error);
    res.status(500).json({ 
      error: 'Failed to fetch chapter data',
      details: error.message 
    });
  }
});

// Route to translate text
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLanguage = 'th' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Check if Google Translate API key is configured
    if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
      // Enhanced fallback translation using MyMemory API (free service)
      try {
        const encodedText = encodeURIComponent(text);
        const translationResponse = await axios.get(
          `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|${targetLanguage}`
        );

        if (translationResponse.data && translationResponse.data.responseData) {
          const translatedText = translationResponse.data.responseData.translatedText;
          
          return res.json({
            originalText: text,
            translatedText: translatedText,
            targetLanguage,
            service: 'MyMemory (Free)',
            note: 'Using free translation service. Configure GOOGLE_TRANSLATE_API_KEY for better accuracy.'
          });
        }
      } catch (fallbackError) {
        console.log('Fallback translation failed:', fallbackError.message);
      }

      // Final fallback: Basic word replacement
      const basicTranslation = translateBasicWords(text);
      return res.json({
        originalText: text,
        translatedText: basicTranslation,
        targetLanguage,
        service: 'Basic Dictionary',
        note: 'Using basic word replacement. Configure GOOGLE_TRANSLATE_API_KEY for proper translations.'
      });
    }

    // Use Google Translate API
    const [translation] = await translate.translate(text, targetLanguage);
    
    res.json({
      originalText: text,
      translatedText: translation,
      targetLanguage,
      service: 'Google Translate'
    });

  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ 
      error: 'Failed to translate text',
      details: error.message 
    });
  }
});

// Basic word translation function for fallback
function translateBasicWords(text) {
  const dictionary = {
    // Common manga words
    'hello': 'สวัสดี',
    'yes': 'ใช่',
    'no': 'ไม่',
    'and': 'และ',
    'the': '',
    'a': '',
    'an': '',
    'is': 'คือ',
    'are': 'คือ',
    'was': 'เป็น',
    'were': 'เป็น',
    'you': 'คุณ',
    'i': 'ฉัน',
    'me': 'ฉัน',
    'my': 'ของฉัน',
    'we': 'เรา',
    'they': 'พวกเขา',
    'he': 'เขา',
    'she': 'เธอ',
    'it': 'มัน',
    'what': 'อะไร',
    'where': 'ที่ไหน',
    'when': 'เมื่อไหร่',
    'why': 'ทำไม',
    'how': 'อย่างไร',
    'who': 'ใคร',
    'can': 'สามารถ',
    'will': 'จะ',
    'would': 'จะ',
    'could': 'สามารถ',
    'should': 'ควร',
    'must': 'ต้อง',
    'have': 'มี',
    'has': 'มี',
    'had': 'มี',
    'do': 'ทำ',
    'does': 'ทำ',
    'did': 'ทำ',
    'go': 'ไป',
    'come': 'มา',
    'get': 'ได้',
    'see': 'เห็น',
    'know': 'รู้',
    'think': 'คิด',
    'want': 'ต้องการ',
    'need': 'ต้องการ',
    'like': 'ชอบ',
    'love': 'รัก',
    'good': 'ดี',
    'bad': 'แย่',
    'big': 'ใหญ่',
    'small': 'เล็ก',
    'new': 'ใหม่',
    'old': 'เก่า',
    'right': 'ถูก',
    'wrong': 'ผิด',
    'stop': 'หยุด',
    'wait': 'รอ',
    'look': 'ดู',
    'listen': 'ฟัง',
    'say': 'พูด',
    'tell': 'บอก',
    'ask': 'ถาม',
    'help': 'ช่วย',
    'thank': 'ขอบคุณ',
    'sorry': 'ขอโทษ',
    'please': 'กรุณา',
    'okay': 'โอเค',
    'ok': 'โอเค'
  };

  let translatedText = text.toLowerCase();
  
  // Replace words using dictionary
  Object.keys(dictionary).forEach(englishWord => {
    const thaiWord = dictionary[englishWord];
    const regex = new RegExp(`\\b${englishWord}\\b`, 'gi');
    translatedText = translatedText.replace(regex, thaiWord);
  });

  // Clean up extra spaces
  translatedText = translatedText.replace(/\s+/g, ' ').trim();
  
  return translatedText || `[แปล] ${text}`;
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 Manga Translation API ready!`);
});
