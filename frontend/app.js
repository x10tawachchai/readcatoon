const { createApp } = Vue;

createApp({
  data() {
    return {
      chapterUrl: '',
      chapterData: null,
      ocrResults: {},
      translations: {},
      ocrProgress: {},
      loading: false,
      progress: 0,
      error: '',
      success: '',
      processedPages: 0,
      selectedLanguage: 'eng'
    }
  },
  methods: {
    async loadChapter() {
      if (!this.chapterUrl.trim()) {
        this.showError('กรุณาป้อน URL ของ MangaDx');
        return;
      }

      this.loading = true;
      this.progress = 0;
      this.error = '';
      this.success = '';
      this.chapterData = null;
      this.ocrResults = {};
      this.translations = {};
      this.processedPages = 0;

      try {
        this.progress = 25;
        
        const response = await fetch('http://localhost:3001/api/manga/chapter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chapterUrl: this.chapterUrl })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to load chapter');
        }

        this.chapterData = await response.json();
        this.progress = 50;
        
        this.showSuccess(`โหลดตอนสำเร็จ! พบ ${this.chapterData.pages} หน้า`);
        
        // OCR will be triggered by image load events
        this.progress = 100;
        
      } catch (error) {
        console.error('Error loading chapter:', error);
        this.showError(`เกิดข้อผิดพลาด: ${error.message}`);
      } finally {
        this.loading = false;
      }
    },

    async performOCR(imageUrl, pageIndex) {
      try {
        this.ocrProgress[pageIndex] = 0;
        
        // Use proxy for better CORS handling
        const proxyUrl = `http://localhost:3001/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
        
        // Create a canvas for image preprocessing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = async () => {
          try {
            // Set canvas size to match image
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw image to canvas
            ctx.drawImage(img, 0, 0);
            
            // Get image data for preprocessing
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            // Preprocessing: Convert to grayscale and increase contrast
            for (let i = 0; i < data.length; i += 4) {
              // Convert to grayscale using luminance formula
              const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
              
              // Increase contrast (threshold for black/white)
              const threshold = 120;
              const value = gray > threshold ? 255 : 0;
              
              data[i] = value;     // Red
              data[i + 1] = value; // Green
              data[i + 2] = value; // Blue
              // Alpha channel stays the same
            }
            
            // Put processed image data back
            ctx.putImageData(imageData, 0, 0);
            
            // Perform OCR using Tesseract.js with optimized settings
            const { data: { text, words } } = await Tesseract.recognize(canvas, this.selectedLanguage, {
              logger: m => {
                if (m.status === 'recognizing text') {
                  this.ocrProgress[pageIndex] = Math.round(m.progress * 100);
                }
              },
              tessedit_pageseg_mode: Tesseract.PSM.AUTO,
              tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?\'"-:;() ',
              preserve_interword_spaces: '1'
            });

            // Clean up the OCR text
            const cleanedText = this.cleanOCRText(text);
            
            if (cleanedText && cleanedText.trim()) {
              this.ocrResults[pageIndex] = cleanedText.trim();
              
              // Translate the text
              await this.translateText(cleanedText.trim(), pageIndex);
            } else {
              this.ocrResults[pageIndex] = 'ไม่พบข้อความในภาพนี้';
            }
            
            delete this.ocrProgress[pageIndex];
            this.processedPages++;
            
          } catch (ocrError) {
            console.error('OCR Error:', ocrError);
            this.ocrResults[pageIndex] = 'เกิดข้อผิดพลาดในการอ่านข้อความ: ' + ocrError.message;
            delete this.ocrProgress[pageIndex];
          }
        };

        img.onerror = () => {
          this.handleImageError(pageIndex);
        };

        // Try both original URL and proxy URL
        img.src = proxyUrl;
        
      } catch (error) {
        console.error('Error in performOCR:', error);
        this.ocrResults[pageIndex] = 'เกิดข้อผิดพลาดในการประมวลผล: ' + error.message;
        delete this.ocrProgress[pageIndex];
      }
    },

    handleImageError(pageIndex) {
      console.error('Image loading error for page:', pageIndex);
      this.ocrResults[pageIndex] = 'ไม่สามารถโหลดภาพได้ - ลองใหม่อีกครั้ง';
    },

    cleanOCRText(text) {
      if (!text) return '';
      
      return text
        // Remove excessive whitespace
        .replace(/\s+/g, ' ')
        // Remove common OCR artifacts
        .replace(/[|]/g, 'I')
        .replace(/[0]/g, 'O')
        .replace(/[5]/g, 'S')
        // Remove non-text characters except punctuation
        .replace(/[^\w\s.,!?'"();:-]/g, '')
        // Clean up spacing around punctuation
        .replace(/\s+([.,!?])/g, '$1')
        .replace(/([.,!?])\s+/g, '$1 ')
        .trim();
    },

    async translateText(text, pageIndex) {
      try {
        const response = await fetch('http://localhost:3001/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            text: text,
            sourceLanguage: this.selectedLanguage,
            targetLanguage: 'th'
          })
        });

        if (!response.ok) {
          throw new Error('Translation failed');
        }

        const translationData = await response.json();
        
        // Format the translation with service info
        let translatedText = translationData.translatedText;
        if (translationData.service) {
          translatedText += `\n\n[${translationData.service}]`;
        }
        if (translationData.note) {
          translatedText += `\n💡 ${translationData.note}`;
        }
        
        this.translations[pageIndex] = translatedText;
        
      } catch (error) {
        console.error('Translation error:', error);
        this.translations[pageIndex] = 'ไม่สามารถแปลข้อความได้';
      }
    },

    showError(message) {
      this.error = message;
      this.success = '';
      setTimeout(() => {
        this.error = '';
      }, 5000);
    },

    showSuccess(message) {
      this.success = message;
      this.error = '';
      setTimeout(() => {
        this.success = '';
      }, 5000);
    }
  },

  mounted() {
    console.log('🎌 Manga Translation App initialized!');
    console.log('💡 Tips:');
    console.log('1. ป้อน URL ของ MangaDx chapter');
    console.log('2. รอให้ระบบโหลดภาพและอ่านข้อความ');
    console.log('3. ดูผลการแปลใต้แต่ละภาพ');
    console.log('🔧 For better translation accuracy, configure Google Translate API key');
  }
}).mount('#app');
