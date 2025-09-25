/**
 * Storage Manager
 * Handles all chrome.storage operations
 */
class StorageManager {
  constructor() {
    this.maxHistory = 10;
  }

  // Geçmiş işlemleri
  async getHistory() {
    const result = await chrome.storage.local.get(['optimizationHistory']);
    return result.optimizationHistory || [];
  }

  async addToHistory(original, optimized, options = {}) {
    const history = await this.getHistory();
    
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      original,
      optimized,
      options,
      website: options.website || 'Unknown'
    };

    // Yeni entry'yi başa ekle
    history.unshift(newEntry);
    
    // Maksimum sayıyı aş, eski olanları sil
    if (history.length > this.maxHistory) {
      history.splice(this.maxHistory);
    }

    await chrome.storage.local.set({ optimizationHistory: history });
    return newEntry;
  }

  async clearHistory() {
    await chrome.storage.local.remove(['optimizationHistory']);
  }

  async removeFromHistory(id) {
    const history = await this.getHistory();
    const filteredHistory = history.filter(entry => entry.id !== id);
    await chrome.storage.local.set({ optimizationHistory: filteredHistory });
  }

  // Kullanıcı tercihleri
  async getPreferences() {
    const result = await chrome.storage.sync.get(['userPreferences']);
    return result.userPreferences || {
      defaultTone: 'neutral',
      defaultLanguage: 'auto',
      showNotifications: true,
      autoDetectLanguage: true,
      saveHistory: true
    };
  }

  async setPreferences(preferences) {
    await chrome.storage.sync.set({ userPreferences: preferences });
  }

  async updatePreference(key, value) {
    const preferences = await this.getPreferences();
    preferences[key] = value;
    await this.setPreferences(preferences);
  }

  // İstatistikler
  async getStats() {
    const result = await chrome.storage.local.get(['stats']);
    return result.stats || {
      totalOptimizations: 0,
      successfulOptimizations: 0,
      failedOptimizations: 0,
      mostUsedTone: 'neutral',
      averageOriginalLength: 0,
      averageOptimizedLength: 0,
      lastUsed: null
    };
  }

  async updateStats(isSuccess, originalLength, optimizedLength = 0, tone = 'neutral') {
    const stats = await this.getStats();
    
    stats.totalOptimizations++;
    stats.lastUsed = new Date().toISOString();
    
    if (isSuccess) {
      stats.successfulOptimizations++;
      
      // Ortalama uzunlukları güncelle
      const total = stats.successfulOptimizations;
      stats.averageOriginalLength = ((stats.averageOriginalLength * (total - 1)) + originalLength) / total;
      stats.averageOptimizedLength = ((stats.averageOptimizedLength * (total - 1)) + optimizedLength) / total;
      
      // En çok kullanılan tonu güncelle (basit sayaç mantığı)
      if (!stats.toneUsage) stats.toneUsage = {};
      stats.toneUsage[tone] = (stats.toneUsage[tone] || 0) + 1;
      
      // En çok kullanılan tonu bul
      stats.mostUsedTone = Object.keys(stats.toneUsage).reduce((a, b) => 
        stats.toneUsage[a] > stats.toneUsage[b] ? a : b
      );
    } else {
      stats.failedOptimizations++;
    }

    await chrome.storage.local.set({ stats });
  }

  // Tüm verileri temizle
  async clearAllData() {
    await chrome.storage.local.clear();
    await chrome.storage.sync.clear();
  }

  // Export/Import işlemleri
  async exportData() {
    const [history, preferences, stats] = await Promise.all([
      this.getHistory(),
      this.getPreferences(),
      this.getStats()
    ]);

    return {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      data: {
        history,
        preferences,
        stats
      }
    };
  }

  async importData(importData) {
    if (!importData.data) {
      throw new Error('Geçersiz import verisi');
    }

    const { history, preferences, stats } = importData.data;

    if (history) await chrome.storage.local.set({ optimizationHistory: history });
    if (preferences) await chrome.storage.sync.set({ userPreferences: preferences });
    if (stats) await chrome.storage.local.set({ stats });
  }
}

// Export for use in other modules
// Universal export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
} else if (typeof window !== 'undefined') {
  // Browser context
  window.StorageManager = StorageManager;
} else if (typeof self !== 'undefined') {
  // Service worker / worker context
  self.StorageManager = StorageManager;
}
