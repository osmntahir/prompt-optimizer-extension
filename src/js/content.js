/**
 * Content Script
 * Handles text selection, UI injection, and communication with background script
 */

class ContentManager {
  constructor() {
    this.isOptimizerVisible = false;
    this.currentOptimizer = null;
    this.selectedText = '';
    this.originalTextBackup = null; // Ctrl+Z için backup
    this.selectedRange = null; // Selection range backup
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

        case 'instantOptimize':
          this.handleInstantOptimize().then(result => {
            sendResponse(result);
          });
          return true; // Async response
          break;

        case 'ping':
          sendResponse({ pong: true });
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

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Escape tuşu ile optimizer'ı kapat
      if (e.key === 'Escape' && this.isOptimizerVisible) {
        this.hideOptimizer();
        return;
      }
      
      // Ctrl+Z ile instant optimize geri al
      if (e.ctrlKey && e.key === 'z' && this.originalTextBackup && this.selectedRange) {
        e.preventDefault();
        this.undoInstantOptimize();
        return;
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
            <select class="po-select po-length-select" value="${options.length || 'maintain'}">
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

    // Kontrol değişiklikleri - Her select için ayrı ayrı kontrol
    const toneSelect = optimizer.querySelector('.po-tone');
    const lengthSelect = optimizer.querySelector('.po-length-select');
    const languageSelect = optimizer.querySelector('.po-language');

    console.log('🎯 Select elementleri:', {
      toneSelect: !!toneSelect,
      lengthSelect: !!lengthSelect,
      languageSelect: !!languageSelect
    });

    // Ton değişikliği
    if (toneSelect) {
      toneSelect.addEventListener('change', (e) => {
        console.log('🎵 Ton değişti:', e.target.value);
        const newOptions = {
          tone: toneSelect.value,
          length: lengthSelect?.value || 'maintain',
          language: languageSelect?.value || 'auto'
        };
        this.optimizeText(optimizer, originalText, newOptions);
      });
    }

    // Uzunluk değişikliği
    if (lengthSelect) {
      lengthSelect.addEventListener('change', (e) => {
        console.log('📏 Uzunluk değişti:', e.target.value);
        const newOptions = {
          tone: toneSelect?.value || 'neutral',
          length: lengthSelect.value,
          language: languageSelect?.value || 'auto'
        };
        this.optimizeText(optimizer, originalText, newOptions);
      });
    }

    // Dil değişikliği
    if (languageSelect) {
      languageSelect.addEventListener('change', (e) => {
        console.log('🌍 Dil değişti:', e.target.value);
        const newOptions = {
          tone: toneSelect?.value || 'neutral',
          length: lengthSelect?.value || 'maintain',
          language: languageSelect.value
        };
        this.optimizeText(optimizer, originalText, newOptions);
      });
    }

    // Yeniden dene butonu
    optimizer.querySelector('.po-retry').addEventListener('click', () => {
      const options = {
        tone: toneSelect?.value || 'neutral',
        length: lengthSelect?.value || 'maintain',
        language: languageSelect?.value || 'auto'
      };
      console.log('🔄 Yeniden dene butonu - seçenekler:', options);
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

  showToast(message, duration = 3000, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `po-toast po-toast-${type}`;
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

  // Instant Optimize Functions
  async handleInstantOptimize() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (!selectedText) {
      return { success: false, message: 'Metin seçilmedi' };
    }

    try {
      // Selection range'i kaydet (Ctrl+Z için)
      this.selectedRange = selection.getRangeAt(0).cloneRange();
      this.originalTextBackup = selectedText;
      
      // Loading indicator göster
      this.showInstantOptimizeLoader();
      
      // Optimize et
      const response = await chrome.runtime.sendMessage({
        action: 'optimizeText',
        text: selectedText,
        options: { tone: 'neutral', length: 'maintain', language: 'auto' }
      });

      if (response?.success && response.data?.optimized) {
        // Seçili metni optimize edilmiş halle değiştir
        this.replaceSelectedText(response.data.optimized);
        
        this.hideInstantOptimizeLoader();
        this.showToast('✨ Metin optimize edildi! (Ctrl+Z ile geri al)', 3000, 'success');
        
        return { success: true };
      } else {
        throw new Error(response?.error || 'Optimizasyon başarısız');
      }
    } catch (error) {
      console.error('Instant optimize error:', error);
      this.hideInstantOptimizeLoader();
      this.showToast('❌ Optimizasyon başarısız: ' + error.message, 3000, 'error');
      return { success: false, error: error.message };
    }
  }

  replaceSelectedText(newText) {
    if (this.selectedRange) {
      // Seçili alanı sil ve yeni metni ekle
      this.selectedRange.deleteContents();
      
      // Text node oluştur ve ekle
      const textNode = document.createTextNode(newText);
      this.selectedRange.insertNode(textNode);
      
      // Yeni metni seç (görsel feedback için)
      const newSelection = window.getSelection();
      newSelection.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNode(textNode);
      newSelection.addRange(newRange);
    }
  }

  undoInstantOptimize() {
    if (this.originalTextBackup && this.selectedRange) {
      // Mevcut seçimi sil ve orijinal metni geri koy
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        
        const textNode = document.createTextNode(this.originalTextBackup);
        range.insertNode(textNode);
        
        // Orijinal metni seç
        const newSelection = window.getSelection();
        newSelection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNode(textNode);
        newSelection.addRange(newRange);
      }
      
      // Backup'ı temizle
      this.originalTextBackup = null;
      this.selectedRange = null;
      
      this.showToast('↶ Orijinal metin geri yüklendi', 2000);
    }
  }

  showInstantOptimizeLoader() {
    // Sayfada küçük bir loading indicator göster
    const loader = document.createElement('div');
    loader.id = 'po-instant-loader';
    loader.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        animation: fadeIn 0.3s ease;
      ">
        ✨ Optimize ediliyor...
      </div>
    `;
    document.body.appendChild(loader);
  }

  hideInstantOptimizeLoader() {
    const loader = document.getElementById('po-instant-loader');
    if (loader) {
      loader.remove();
    }
  }
}

// Initialize content manager
const contentManager = new ContentManager();
