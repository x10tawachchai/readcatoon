const axios = require('axios');

async function testJapaneseOCR() {
  try {
    console.log('Testing Japanese OCR fallback...');
    const response = await axios.post('http://localhost:3001/api/ocr-fallback', {
      imageUrl: 'https://example.com/test.jpg', // dummy URL for testing
      language: 'japanese'
    });
    console.log('Success:', response.data);
  } catch (error) {
    console.log('Error details:', error.response?.data || error.message);
  }
}

testJapaneseOCR();
