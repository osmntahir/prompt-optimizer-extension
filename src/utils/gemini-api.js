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
    
    let prompt = `Sen bir prompt iyileştirme uzmanısın. Görevin verilen prompt'u yapay zeka modellerinin daha iyi anlayıp işleyebileceği şekilde iyileştirmek.\n\nÖNEMLİ: Metni kısaltma veya özetleme! Sadece AI'ın anlayacağı şekilde yeniden yazıp iyileştir.\n\nİyileştirilecek prompt:\n"${text}"\n\n`;
    
    prompt += `İyileştirme kriterleri:\n`;
    
    // Ton ayarları
    switch (tone) {
      case 'formal':
        prompt += `- Resmi ve profesyonel bir dil kullan\n`;
        break;
      case 'casual':
        prompt += `- Samimi ve günlük bir dil kullan\n`;
        break;
      case 'technical':
        prompt += `- Teknik ve detaylı bir yaklaşım benimse\n`;
        break;
      case 'concise':
        prompt += `- Kısa ve net bir şekilde ifade et (ama içeriği koruyarak)\n`;
        break;
      default:
        prompt += `- Dengeli ve anlaşılır bir ton kullan\n`;
    }
    
    // Uzunluk ayarları
    switch (length) {
      case 'shorter':
        prompt += `- Gereksiz tekrarları ve belirsizlikleri kaldır, ama ana mesajı koru\n`;
        break;
      case 'longer':
        prompt += `- Daha ayrıntılı ve kapsamlı açıklamalar ekle\n`;
        break;
      default:
        prompt += `- Benzer detay seviyesinde tut, sadece netliği artır\n`;
    }
    
    // Dil ayarları
    if (language === 'tr') {
      prompt += `- Türkçe olarak yanıtla\n`;
    } else if (language === 'en') {
      prompt += `- İngilizce olarak yanıtla\n`;
    } else {
      prompt += `- Orijinal metnin dilinde yanıtla\n`;
    }
    
    prompt += `\nPrompt iyileştirme hedeflerin:\n`;
    prompt += `✓ Belirsizlikleri gider ve net talimatlar ver\n`;
    prompt += `✓ Context ve bağlam bilgilerini netleştir\n`;
    prompt += `✓ AI'ın anlayacağı açık ve yapılandırılmış format kullan\n`;
    prompt += `✓ Gereksiz kelimelerden arındır ama içeriği koru\n`;
    prompt += `✓ Daha spesifik ve actionable (eyleme dönük) hale getir\n\n`;
    
    prompt += `ÖNEMLİ: Sadece iyileştirilmiş prompt'u döndür. Tırnak işareti, kod bloğu, açıklama veya ek format kullanma. Direkt metni ver.`;
    
    return prompt;
  }

  cleanOptimizedText(text) {
    // Gereksiz karakterleri ve formatlamayı temizle
    let cleaned = text.trim();
    
    // Başındaki ve sonundaki tırnak işaretlerini kaldır (tek veya çift tırnak)
    // Birden fazla kez uygula (iç içe tırnaklar için)
    while (cleaned.startsWith('"') || cleaned.startsWith("'") || cleaned.startsWith('"') || cleaned.startsWith('"')) {
      cleaned = cleaned.substring(1);
    }
    while (cleaned.endsWith('"') || cleaned.endsWith("'") || cleaned.endsWith('"') || cleaned.endsWith('"')) {
      cleaned = cleaned.substring(0, cleaned.length - 1);
    }
    
    // Markdown kod bloklarını kaldır
    cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
    cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
    
    // Fazladan boşlukları temizle
    cleaned = cleaned.trim();
    
    return cleaned;
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
