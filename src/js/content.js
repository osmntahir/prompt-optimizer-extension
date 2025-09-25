/**
 * Content Script
 * Handles text selection, UI injection, and communication with background script
 */

class ContentManager {
  constructor() {
    this.isOptimizerVisible = false;
    this.currentOptimizer = null;
    this.selectedText = '';
    this.init();
  }

  init() {
    this.setupMessageListener();
    this.setupSelectionListener();
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.action) {
        case 'showOptimizer':
          this.showOptimizer(request.text, request.options, request.source);
          sendResponse({ success: true });
          break;

        case 'getSelectedText':
          const text = window.getSelection().toString().trim();
          sendResponse({ text: text });
          break;

        default:
          sendResponse({ success: false });
      }
    });
  }

  setupSelectionListener() {
    // Metin seçimi değişikliklerini dinle
    document.addEventListener('selectionchange', () => {
      this.selectedText = window.getSelection().toString().trim();
    });

    // Escape tuşu ile optimizer'ı kapat
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOptimizerVisible) {
        this.hideOptimizer();
      }
    });
  }

  async showOptimizer(text, options = {}, source = 'unknown') {
    // Eğer zaten açık bir optimizer varsa kapat
    if (this.isOptimizerVisible) {
      this.hideOptimizer();
    }

    this.selectedText = text;
    
    // Optimizer UI oluştur
    const optimizer = this.createOptimizerUI(text, options, source);
    document.body.appendChild(optimizer);
    
    this.currentOptimizer = optimizer;
    this.isOptimizerVisible = true;

    // Fade-in animasyonu
    requestAnimationFrame(() => {
      optimizer.classList.add('po-visible');
    });

    // Direkt optimizasyonu başlat
    this.optimizeText(optimizer, text, options);
  }

  hideOptimizer() {
    if (this.currentOptimizer) {
      this.currentOptimizer.classList.add('po-hiding');
      
      setTimeout(() => {
        if (this.currentOptimizer && this.currentOptimizer.parentNode) {
          this.currentOptimizer.parentNode.removeChild(this.currentOptimizer);
        }
        this.currentOptimizer = null;
        this.isOptimizerVisible = false;
      }, 300);
    }
  }

  createOptimizerUI(text, options, source) {
    const optimizer = document.createElement('div');
    optimizer.className = 'prompt-optimizer';
    optimizer.innerHTML = `
      <div class="po-container">
        <div class="po-header">
          <h3 class="po-title">
            <span class="po-icon">✨</span>
            Prompt Optimizer
          </h3>
          <button class="po-close" title="Kapat (ESC)">×</button>
        </div>
        
        <div class="po-content">
          <div class="po-section po-original">
            <div class="po-section-header">
              <span class="po-label">🟢 Orijinal</span>
              <span class="po-length">${text.length} karakter</span>
            </div>
            <div class="po-text">${this.escapeHtml(text)}</div>
          </div>
          
          <div class="po-section po-optimized">
            <div class="po-section-header">
              <span class="po-label">🔵 İyileştirilmiş</span>
              <span class="po-length">Hazırlanıyor...</span>
            </div>
            <div class="po-text po-loading">
              <div class="po-spinner"></div>
              <span>AI ile optimize ediliyor...</span>
            </div>
          </div>
        </div>
        
        <div class="po-controls">
          <div class="po-control-group">
            <label>Ton:</label>
            <select class="po-select po-tone" value="${options.tone || 'neutral'}">
              <option value="neutral">Dengeli</option>
              <option value="formal">Resmi</option>
              <option value="casual">Samimi</option>
              <option value="technical">Teknik</option>
              <option value="concise">Kısa ve Öz</option>
            </select>
          </div>
          
          <div class="po-control-group">
            <label>Uzunluk:</label>
            <select class="po-select po-length" value="${options.length || 'maintain'}">
              <option value="maintain">Aynı</option>
              <option value="shorter">Daha Kısa</option>
              <option value="longer">Daha Uzun</option>
            </select>
          </div>
          
          <div class="po-control-group">
            <label>Dil:</label>
            <select class="po-select po-language" value="${options.language || 'auto'}">
              <option value="auto">Otomatik</option>
              <option value="tr">Türkçe</option>
              <option value="en">İngilizce</option>
            </select>
          </div>
        </div>
        
        <div class="po-actions">
          <button class="po-btn po-btn-secondary po-retry" disabled>
            <span class="po-btn-icon">🔄</span>
            Yeniden Dene
          </button>
          
          <button class="po-btn po-btn-secondary po-copy-original">
            <span class="po-btn-icon">📋</span>
            Orijinali Kopyala
          </button>
          
          <button class="po-btn po-btn-primary po-copy-optimized" disabled>
            <span class="po-btn-icon">✨</span>
            İyileştirmiş Kopyala
          </button>
        </div>
        
        <div class="po-footer">
          <div class="po-stats"></div>
          <a href="#" class="po-support" target="_blank">
            ☕ Kahve ısmarla
          </a>
        </div>
      </div>
    `;

    this.setupOptimizerEventListeners(optimizer, text, options);
    return optimizer;
  }

  setupOptimizerEventListeners(optimizer, originalText, initialOptions) {
    // Kapat butonu
    optimizer.querySelector('.po-close').addEventListener('click', () => {
      this.hideOptimizer();
    });

    // Overlay click (kapat)
    optimizer.addEventListener('click', (e) => {
      if (e.target === optimizer) {
        this.hideOptimizer();
      }
    });

    // Kontrol değişiklikleri
    const toneSelect = optimizer.querySelector('.po-tone');
    const lengthSelect = optimizer.querySelector('.po-length');
    const languageSelect = optimizer.querySelector('.po-language');

    [toneSelect, lengthSelect, languageSelect].forEach(select => {
      select.addEventListener('change', () => {
        const newOptions = {
          tone: toneSelect.value,
          length: lengthSelect.value,
          language: languageSelect.value
        };
        this.optimizeText(optimizer, originalText, newOptions);
      });
    });

    // Yeniden dene butonu
    optimizer.querySelector('.po-retry').addEventListener('click', () => {
      const options = {
        tone: toneSelect.value,
        length: lengthSelect.value,
        language: languageSelect.value
      };
      this.optimizeText(optimizer, originalText, options);
    });

    // Kopyala butonları
    optimizer.querySelector('.po-copy-original').addEventListener('click', () => {
      this.copyToClipboard(originalText, 'Orijinal metin kopyalandı!');
    });

    optimizer.querySelector('.po-copy-optimized').addEventListener('click', () => {
      const optimizedText = optimizer.querySelector('.po-optimized .po-text').textContent;
      this.copyToClipboard(optimizedText, 'İyileştirilmiş metin kopyalandı!');
    });

    // Support link
    optimizer.querySelector('.po-support').addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://buymeacoffee.com/promptoptimizer', '_blank');
    });
  }

  async optimizeText(optimizer, text, options) {
    const optimizedSection = optimizer.querySelector('.po-optimized .po-text');
    const optimizedLength = optimizer.querySelector('.po-optimized .po-length');
    const retryBtn = optimizer.querySelector('.po-retry');
    const copyBtn = optimizer.querySelector('.po-copy-optimized');
    const statsDiv = optimizer.querySelector('.po-stats');

    // Loading state
    optimizedSection.innerHTML = `
      <div class="po-spinner"></div>
      <span>AI ile optimize ediliyor...</span>
    `;
    optimizedSection.className = 'po-text po-loading';
    optimizedLength.textContent = 'Hazırlanıyor...';
    retryBtn.disabled = true;
    copyBtn.disabled = true;
    statsDiv.innerHTML = '';

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'optimizeText',
        text: text,
        options: options
      });

      if (response.success && response.data) {
        const { optimized, stats } = response.data;
        
        // Başarılı sonuç göster
        optimizedSection.textContent = optimized;
        optimizedSection.className = 'po-text po-success';
        optimizedLength.textContent = `${optimized.length} karakter`;
        
        // İstatistikleri göster
        statsDiv.innerHTML = `
          <span class="po-stat">
            📏 ${stats.improvement}
          </span>
          <span class="po-stat">
            ⚡ ${options.tone || 'neutral'} ton
          </span>
        `;

        // Butonları aktif et
        retryBtn.disabled = false;
        copyBtn.disabled = false;

      } else {
        throw new Error(response.error || 'Bilinmeyen optimizasyon hatası');
      }

    } catch (error) {
      // Hata durumu
      let errorMessage = error.message || 'Bilinmeyen hata';
      
      // Kullanıcı dostu hata mesajları
      if (errorMessage.includes('Extension context invalidated')) {
        errorMessage = 'Extension yenilendi. Sayfayı yenileyin.';
      } else if (errorMessage.includes('Could not establish connection')) {
        errorMessage = 'Extension bağlantı hatası. Sayfayı yenileyin.';
      }

      optimizedSection.innerHTML = `
        <div class="po-error">
          <span class="po-error-icon">⚠️</span>
          <div class="po-error-text">
            <strong>Hata:</strong> ${errorMessage}
            <br>
            <small>Konsolu kontrol edin ve sayfayı yenilemeyi deneyin.</small>
          </div>
        </div>
      `;
      optimizedSection.className = 'po-text po-error-state';
      optimizedLength.textContent = 'Hata';
      retryBtn.disabled = false;
      copyBtn.disabled = true;
    }
  }

  showError(message) {
    if (!this.currentOptimizer) return;

    const optimizedSection = this.currentOptimizer.querySelector('.po-optimized .po-text');
    optimizedSection.innerHTML = `
      <div class="po-error">
        <span class="po-error-icon">❌</span>
        <div class="po-error-text">${message}</div>
      </div>
    `;
  }

  async copyToClipboard(text, successMessage) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast(successMessage);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showToast(successMessage);
    }
  }

  showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'po-toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.classList.add('po-toast-visible');
    });

    setTimeout(() => {
      toast.classList.remove('po-toast-visible');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize content manager
const contentManager = new ContentManager();
