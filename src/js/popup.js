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
    await this.loadInitialData();
  }

  async initializeUtilities() {
    // Create storage manager instance for popup
    this.storageManager = {
      async getHistory() {
        const result = await chrome.storage.local.get(['optimizationHistory']);
        return result.optimizationHistory || [];
      },
      
      async clearHistory() {
        await chrome.storage.local.remove(['optimizationHistory']);
      },
      
      async getStats() {
        const result = await chrome.storage.local.get(['stats']);
        return result.stats || {
          totalOptimizations: 0,
          successfulOptimizations: 0,
          failedOptimizations: 0,
          mostUsedTone: 'neutral',
          averageOriginalLength: 0,
          averageOptimizedLength: 0
        };
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

    // Close popup when clicking outside (for debugging)
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('popup-overlay')) {
        window.close();
      }
    });
  }

  async loadInitialData() {
    try {
      this.showLoading(true);
      
      // API anahtarı her zaman aktif
      this.showApiKeyConnected();
      
      // Load statistics
      await this.loadStats();
      
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

  async loadStats() {
    try {
      const stats = await this.storageManager.getStats();
      
      // Update UI elements
      document.getElementById('totalOptimizations').textContent = stats.totalOptimizations;
      
      const successRate = stats.totalOptimizations > 0 
        ? Math.round((stats.successfulOptimizations / stats.totalOptimizations) * 100)
        : 0;
      document.getElementById('successRate').textContent = `${successRate}%`;
      
      // Calculate average improvement
      const avgImprovement = this.calculateAverageImprovement(stats);
      document.getElementById('avgImprovement').textContent = avgImprovement;
      
      // Most used tone
      const toneMap = {
        'neutral': 'Dengeli',
        'formal': 'Resmi',
        'casual': 'Samimi',
        'technical': 'Teknik',
        'concise': 'Kısa'
      };
      document.getElementById('mostUsedTone').textContent = 
        toneMap[stats.mostUsedTone] || 'Dengeli';
        
    } catch (error) {
    }
  }

  calculateAverageImprovement(stats) {
    if (stats.successfulOptimizations === 0) return '+0%';
    
    const originalAvg = stats.averageOriginalLength;
    const optimizedAvg = stats.averageOptimizedLength;
    
    if (originalAvg === 0) return '+0%';
    
    const improvement = ((optimizedAvg - originalAvg) / originalAvg) * 100;
    const sign = improvement >= 0 ? '+' : '';
    
    return `${sign}${Math.round(improvement)}%`;
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
        // Send optimize message
        await chrome.tabs.sendMessage(tab.id, {
          action: 'showOptimizer',
          text: response.text,
          options: { tone: 'neutral' },
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
        await this.storageManager.clearHistory();
        await this.loadRecentHistory();
        await this.loadStats();
        this.showToast('Geçmiş temizlendi', 'success');
      } catch (error) {
        this.showToast('Geçmiş temizlenemedi', 'error');
      }
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
