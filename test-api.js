// Simple test file to verify server functionality
const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  try {
    console.log('🧪 Testing Manga Translation API...\n');
    
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test 2: Translation endpoint
    console.log('\n2. Testing translation...');
    const translationResponse = await axios.post(`${API_BASE}/translate`, {
      text: 'Hello, this is a test.',
      targetLanguage: 'th'
    });
    console.log('✅ Translation test passed:', translationResponse.data);
    
    // Test 3: MangaDx endpoint (will likely fail without valid URL)
    console.log('\n3. Testing MangaDx endpoint...');
    try {
      const mangaResponse = await axios.post(`${API_BASE}/manga/chapter`, {
        chapterUrl: 'https://mangadx.org/chapter/test-12345'
      });
      console.log('✅ MangaDx test passed:', mangaResponse.data);
    } catch (error) {
      console.log('⚠️  MangaDx test failed (expected):', error.response?.data?.error || error.message);
    }
    
    console.log('\n🎉 API tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('Make sure the server is running on port 3001');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;
