/**
 * Gemini API Manager
 * Handles all API interactions with Google Gemini
 */
class GeminiAPI {
  constructor() {
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    // API anahtarı .env dosyasından hardcoded olarak alınır
    this.apiKey = 'AIzaSyBM72GxKm1-7KrZaK7a7z0DwAXtWvsqtVw';
  }

  async optimizePrompt(originalText, options = {}) {
    if (!this.apiKey) {
      throw new Error('API anahtarı bulunamadı.');
    }

    const {
      tone = 'neutral',
      language = 'auto',
      style = 'improved',
      length = 'maintain'
    } = options;

    const prompt = this.buildOptimizationPrompt(originalText, { tone, language, style, length });
    console.log('📝 Oluşturulan prompt:', prompt.substring(0, 100) + '...');

    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
        stopSequences: []
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    try {
      // Timeout controller (20s)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': this.apiKey
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Hatası (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('API\'den geçerli bir yanıt alınamadı');
      }

      const candidate = data.candidates[0];

      if (candidate.finishReason === 'SAFETY') {
        throw new Error('İçerik güvenlik filtresi tarafından engellendi');
      }

      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        throw new Error('API yanıtında içerik bulunamadı');
      }

      const optimizedText = candidate.content.parts[0].text;
      return this.cleanOptimizedText(optimizedText);
      
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('API zaman aşımına uğradı (20s)');
      }
      if (error.message.includes('403') || error.message.includes('API_KEY_INVALID')) {
        throw new Error('API anahtarı geçersiz veya yetki hatası');
      } else if (error.message.includes('429')) {
        throw new Error('API limit aşıldı, lütfen biraz bekleyin');
      } else if (error.message.includes('NetworkError') || error.name === 'TypeError') {
        throw new Error('İnternet bağlantısı sorunu');
      }
      
      throw error;
    }
  }

  buildOptimizationPrompt(text, options) {
    const { tone, language, style, length } = options;
    
    let prompt = `Lütfen aşağıdaki metni optimize et:\n\n"${text}"\n\n`;
    
    prompt += `Optimizasyon kriterleri:\n`;
    
    // Ton ayarları
    switch (tone) {
      case 'formal':
        prompt += `- Resmi ve profesyonel bir ton kullan\n`;
        break;
      case 'casual':
        prompt += `- Samimi ve günlük bir dil kullan\n`;
        break;
      case 'technical':
        prompt += `- Teknik ve detaylı bir yaklaşım benimse\n`;
        break;
      case 'concise':
        prompt += `- Kısa ve öz bir şekilde ifade et\n`;
        break;
      default:
        prompt += `- Dengeli ve net bir ton kullan\n`;
    }
    
    // Uzunluk ayarları
    switch (length) {
      case 'shorter':
        prompt += `- Orijinalden daha kısa yap\n`;
        break;
      case 'longer':
        prompt += `- Daha ayrıntılı ve açıklayıcı yap\n`;
        break;
      default:
        prompt += `- Benzer uzunlukta tut\n`;
    }
    
    // Dil ayarları
    if (language === 'tr') {
      prompt += `- Türkçe olarak yanıtla\n`;
    } else if (language === 'en') {
      prompt += `- İngilizce olarak yanıtla\n`;
    } else {
      prompt += `- Orijinal metnin dilinde yanıtla\n`;
    }
    
    prompt += `\nSadece optimize edilmiş metni döndür, ek açıklama yapma.`;
    
    return prompt;
  }

  cleanOptimizedText(text) {
    // Gereksiz karakterleri ve formatlamayı temizle
    return text
      .replace(/^["']|["']$/g, '') // Başındaki ve sonundaki tırnak işaretlerini kaldır
      .trim();
  }

  // Dil algılama
  detectLanguage(text) {
    const turkishChars = /[çğıöşüÇĞIİÖŞÜ]/g;
    const turkishWords = /\b(ve|bir|bu|şu|ile|için|gibi|kadar|daha|çok|az|her|hiç|kendi|onun|bunun|şunun)\b/gi;
    
    if (turkishChars.test(text) || turkishWords.test(text)) {
      return 'tr';
    }
    return 'en';
  }
}

// Export for Node test environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GeminiAPI;
}

// Make available globally in browser or service worker
if (typeof window !== 'undefined') {
  window.GeminiAPI = GeminiAPI;
} else if (typeof self !== 'undefined') {
  // Service worker / worker context
  self.GeminiAPI = GeminiAPI;
}
