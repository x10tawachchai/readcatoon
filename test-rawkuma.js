const axios = require('axios');

async function testRawkuma() {
  try {
    console.log('Testing Rawkuma URL parsing...');
    const response = await axios.post('http://localhost:3001/api/manga/chapter', {
      chapterUrl: 'https://rawkuma.net/mizu-zokusei-no-mahou-tsukai-chapter-1/'
    });
    console.log('Success:', response.data);
  } catch (error) {
    console.log('Error:', error.response?.data || error.message);
  }
}

testRawkuma();
