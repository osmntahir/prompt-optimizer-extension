/**
 * Popup Script
 * Manages the extension popup interface and interactions
 */

class PopupManager {
  constructor() {
    this.storageManager = null;
    this.init();
  }

  async init() {
    // Import utility classes (simulated for popup context)
    await this.initializeUtilities();
    
    this.setupEventListeners();
    this.setupStorageListeners();
    await this.loadInitialData();
  }

  async initializeUtilities() {
    // Create storage manager instance for popup that uses background script
    this.storageManager = {
      async getHistory() {
        try {
          const response = await chrome.runtime.sendMessage({
            action: 'getHistory'
          });
          return (response && response.success) ? response.data : [];
        } catch (error) {
          console.error('Error getting history:', error);
          return [];
        }
      },
      
      async clearHistory() {
        try {
          const response = await chrome.runtime.sendMessage({
            action: 'clearHistory'
          });
          return response && response.success;
        } catch (error) {
          console.error('Error clearing history:', error);
          return false;
        }
      },
      
      async getStats() {
        try {
          const response = await chrome.runtime.sendMessage({
            action: 'getStats'
          });
          return (response && response.success) ? response.data : {
            totalOptimizations: 0,
            successfulOptimizations: 0,
            failedOptimizations: 0,
            mostUsedTone: 'neutral',
            averageOriginalLength: 0,
            averageOptimizedLength: 0
          };
        } catch (error) {
          console.error('Error getting stats:', error);
          return {
            totalOptimizations: 0,
            successfulOptimizations: 0,
            failedOptimizations: 0,
            mostUsedTone: 'neutral',
            averageOriginalLength: 0,
            averageOptimizedLength: 0
          };
        }
      }
    };
  }

  setupEventListeners() {
    // Quick action buttons
    document.getElementById('optimizeSelected').addEventListener('click', () => {
      this.optimizeSelectedText();
    });

    document.getElementById('instantOptimize').addEventListener('click', () => {
      this.instantOptimizeText();
    });

    // History management
    document.getElementById('clearHistory').addEventListener('click', () => {
      this.clearHistory();
    });

    // Footer links
    document.getElementById('openSettings').addEventListener('click', (e) => {
      e.preventDefault();
      this.openSettingsPage();
    });

    // Coffee link
    const coffeeLink = document.querySelector('.coffee-link');
    if (coffeeLink) {
      coffeeLink.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({
          url: 'https://buymeacoffee.com/osmntahir'
        });
      });
    }

    // Close popup when clicking outside (for debugging)
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('popup-overlay')) {
        window.close();
      }
    });
  }

  setupStorageListeners() {
    // Listen for storage changes to refresh UI immediately
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local') {
        // If optimization history changed, reload history
        if (changes.optimizationHistory) {
          // Debounce multiple rapid changes
          clearTimeout(this.historyReloadTimer);
          this.historyReloadTimer = setTimeout(() => {
            this.loadRecentHistory().catch(() => {});
          }, 100);
        }
      }
    });
  }

  async loadInitialData() {
    try {
      this.showLoading(true);
      
      // API anahtarı her zaman aktif
      this.showApiKeyConnected();
      
      // Load recent history
      await this.loadRecentHistory();
      
    } catch (error) {
      this.showError('Veriler yüklenirken hata oluştu: ' + error.message);
    } finally {
      this.showLoading(false);
    }
  }

  showApiKeyConnected() {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const apiInputGroup = document.getElementById('apiInputGroup');
    
    if (statusIndicator) {
      statusIndicator.className = 'status-indicator connected';
    }
    if (statusText) {
      statusText.textContent = 'Bağlı - API anahtarı aktif';
    }
    if (apiInputGroup) {
      apiInputGroup.style.display = 'none';
    }
  }

  async loadRecentHistory() {
    try {
      const history = await this.storageManager.getHistory();
      const historyList = document.getElementById('historyList');
      const historyEmpty = document.getElementById('historyEmpty');
      
      if (history.length === 0) {
        historyEmpty.style.display = 'block';
        return;
      }
      
      historyEmpty.style.display = 'none';
      
      // Show recent 10 items instead of 5
      const recentHistory = history.slice(0, 10);
      const historyHTML = recentHistory.map(item => this.createHistoryItemHTML(item)).join('');
      
      historyList.innerHTML = historyHTML;
      
      // Add click listeners to copy buttons
      historyList.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation(); // Prevent history item click
          
          const textToCopy = btn.dataset.text;
          const copyType = btn.dataset.copy; // 'original' or 'optimized'
          
          try {
            await navigator.clipboard.writeText(textToCopy);
            
            // Visual feedback
            const originalText = btn.textContent;
            btn.textContent = '✅ Kopyalandı!';
            btn.style.background = '#22c55e';
            
            setTimeout(() => {
              btn.textContent = originalText;
              btn.style.background = '';
            }, 1500);
            
            this.showToast(
              copyType === 'original' ? 'Orijinal prompt kopyalandı!' : 'İyileştirilmiş prompt kopyalandı!', 
              'success'
            );
          } catch (error) {
            // Fallback for clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.showToast('Metin kopyalandı!', 'success');
          }
        });
      });
      
    } catch (error) {
    }
  }

  createHistoryItemHTML(item) {
    const date = new Date(item.timestamp);
    const formattedDate = date.toLocaleDateString('tr-TR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const originalPreview = item.original.length > 100 
      ? item.original.substring(0, 100) + '...'
      : item.original;
      
    const optimizedPreview = item.optimized.length > 100 
      ? item.optimized.substring(0, 100) + '...'
      : item.optimized;
      
    const improvement = this.calculateImprovementText(item.original.length, item.optimized.length);
    const toneText = this.getToneText(item.options?.tone || 'neutral');
    
    return `
      <div class="history-item" data-history-id="${item.id}">
        <div class="history-header">
          <div class="history-date">${formattedDate}</div>
          <div class="history-stats">
            <span class="history-stat">${improvement}</span>
            <span class="history-stat">${toneText}</span>
          </div>
        </div>
        
        <div class="history-content">
          <div class="history-section">
            <div class="history-section-header">
              <span class="history-label">📝 Orijinal:</span>
              <button class="copy-btn" data-copy="original" data-text="${this.escapeHtml(item.original)}" title="Orijinali kopyala">
                📋 Kopyala
              </button>
            </div>
            <div class="history-preview original">${this.escapeHtml(originalPreview)}</div>
          </div>
          
          <div class="history-section">
            <div class="history-section-header">
              <span class="history-label">✨ İyileştirilmiş:</span>
              <button class="copy-btn" data-copy="optimized" data-text="${this.escapeHtml(item.optimized)}" title="İyileştirilmiş prompt'u kopyala">
                📋 Kopyala
              </button>
            </div>
            <div class="history-preview optimized">${this.escapeHtml(optimizedPreview)}</div>
          </div>
        </div>
      </div>
    `;
  }

  calculateImprovementText(originalLength, optimizedLength) {
    const difference = optimizedLength - originalLength;
    const percentage = originalLength > 0 ? Math.round((difference / originalLength) * 100) : 0;
    
    if (difference > 0) {
      return `+${percentage}%`;
    } else if (difference < 0) {
      return `${percentage}%`;
    } else {
      return '±0%';
    }
  }

  getToneText(tone) {
    const toneMap = {
      'neutral': 'Dengeli',
      'formal': 'Resmi',
      'casual': 'Samimi',
      'technical': 'Teknik',
      'concise': 'Kısa'
    };
    return toneMap[tone] || 'Dengeli';
  }

  async optimizeSelectedText() {
    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.id) {
        this.showToast('Aktif tab bulunamadı', 'error');
        return;
      }

      // Check if content script is injected by trying to ping it
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
      } catch (pingError) {
        // Content script not loaded, inject it
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['src/js/content.js']
          });
          await chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['src/css/content.css']
          });
          // Wait a bit for script to initialize
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (injectError) {
          this.showToast('Bu sayfada extension çalışmıyor', 'error');
          return;
        }
      }
      
      // Send message to content script to get selected text
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'getSelectedText'
      });
      
      if (response?.text && response.text.length > 0) {
        // Get user preferences for default tone
        const preferences = await chrome.storage.sync.get(['userPreferences']);
        const defaultTone = preferences.userPreferences?.defaultTone || 'neutral';
        
        // Send optimize message
        await chrome.tabs.sendMessage(tab.id, {
          action: 'showOptimizer',
          text: response.text,
          options: { tone: defaultTone },
          source: 'popup'
        });
        
        // Close popup
        window.close();
      } else {
        this.showToast('Lütfen web sayfasında bir metin seçin', 'warning');
      }
      
    } catch (error) {
      this.showToast('Seçili metin optimize edilemedi. Sayfayı yenileyin.', 'error');
    }
  }

  async instantOptimizeText() {
    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.id) {
        this.showToast('Aktif tab bulunamadı', 'error');
        return;
      }

      // Check if content script is injected by trying to ping it
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
      } catch (pingError) {
        // Content script not loaded, inject it
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['src/js/content.js']
          });
          await chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['src/css/content.css']
          });
          // Wait a bit for script to initialize
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (injectError) {
          this.showToast('Bu sayfada extension çalışmıyor', 'error');
          return;
        }
      }
      
      // Send instant optimize message
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'instantOptimize'
      });
      
      if (response?.success) {
        this.showToast('✨ Metin anında optimize edildi!', 'success');
        // Close popup
        window.close();
      } else {
        this.showToast('Lütfen web sayfasında bir metin seçin', 'warning');
      }
      
    } catch (error) {
      this.showToast('Anında optimizasyon başarısız. Sayfayı yenileyin.', 'error');
    }
  }

  async clearHistory() {
    if (confirm('Tüm geçmiş silinsin mi? Bu işlem geri alınamaz.')) {
      try {
        // Show immediate visual feedback
        const clearButton = document.getElementById('clearHistory');
        const originalText = clearButton ? clearButton.textContent : '';
        
        if (clearButton) {
          clearButton.textContent = 'Temizleniyor...';
          clearButton.disabled = true;
          clearButton.style.opacity = '0.6';
        }
        
        // Immediately clear the UI for instant feedback
        await this.updateUIAfterHistoryCleared();
        
        // Use background script to clear history for consistency
        const response = await chrome.runtime.sendMessage({
          action: 'clearHistory'
        });
        
        if (response && response.success) {
          this.showToast('Geçmiş temizlendi', 'success');
        } else {
          // If background script fails, reload from storage
          await this.loadRecentHistory();
          throw new Error('Background script response failed');
        }
      } catch (error) {
        console.error('Clear history error:', error);
        this.showToast('Geçmiş temizlenemedi', 'error');
        // Reload data in case of error
        await this.loadRecentHistory();
      } finally {
        // Restore button state
        const clearButton = document.getElementById('clearHistory');
        if (clearButton) {
          clearButton.textContent = 'Geçmişi Temizle';
          clearButton.disabled = false;
          clearButton.style.opacity = '1';
        }
      }
    }
  }

  async updateUIAfterHistoryCleared() {
    try {
      // Immediately clear the history list
      const historyList = document.getElementById('historyList');
      const historyEmpty = document.getElementById('historyEmpty');
      
      // Clear history display
      if (historyList) {
        historyList.innerHTML = '';
      }
      
      // Show empty state
      if (historyEmpty) {
        historyEmpty.style.display = 'block';
      }
      
      // Add a small delay to ensure visual feedback is seen
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Reload data from storage to ensure consistency
      await this.loadRecentHistory();
      
    } catch (error) {
      console.error('Error updating UI after history cleared:', error);
    }
  }

  openSettingsPage() {
    chrome.tabs.create({
      url: chrome.runtime.getURL('src/settings.html')
    });
  }

  showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = show ? 'flex' : 'none';
  }

  showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `popup-toast popup-toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    Object.assign(toast.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      padding: '8px 16px',
      borderRadius: '6px',
      color: 'white',
      fontSize: '12px',
      fontWeight: '500',
      zIndex: '10000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
      'success': '#10b981',
      'error': '#ef4444',
      'warning': '#f59e0b',
      'info': '#3b82f6'
    };
    toast.style.background = colors[type] || colors.info;
    
    document.body.appendChild(toast);
    
    // Show toast
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });
    
    // Hide after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  showError(message) {
    this.showToast(message, 'error');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});
