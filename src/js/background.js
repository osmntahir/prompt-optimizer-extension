/**
 * Background Service Worker
 * Handles context menu, keyboard shortcuts, and API calls
 */

// Import utilities
importScripts(
  '../utils/gemini-api.js',
  '../utils/storage-manager.js'
);

class BackgroundManager {
  constructor() {
    this.geminiAPI = new GeminiAPI();
    this.storageManager = new StorageManager();
    this.init();
  }

  init() {
    this.setupContextMenu();
    this.setupEventListeners();
    this.setupStorageListeners();
  }

  setupContextMenu() {
    chrome.runtime.onInstalled.addListener(() => {
      chrome.contextMenus.create({
        id: 'optimize-prompt',
        title: 'Prompt İyileştir',
        contexts: ['selection'],
        visible: true
      });

      chrome.contextMenus.create({
        id: 'optimize-prompt-formal',
        title: '📋 Resmi Tonla İyileştir',
        contexts: ['selection'],
        parentId: 'optimize-prompt'
      });

      chrome.contextMenus.create({
        id: 'optimize-prompt-casual',
        title: '💬 Samimi Tonla İyileştir',
        contexts: ['selection'],
        parentId: 'optimize-prompt'
      });

      chrome.contextMenus.create({
        id: 'optimize-prompt-technical',
        title: '🔧 Teknik Tonla İyileştir',
        contexts: ['selection'],
        parentId: 'optimize-prompt'
      });

      chrome.contextMenus.create({
        id: 'optimize-prompt-concise',
        title: '⚡ Kısa ve Öz İyileştir',
        contexts: ['selection'],
        parentId: 'optimize-prompt'
      });

      chrome.contextMenus.create({
        id: 'separator1',
        type: 'separator',
        contexts: ['selection'],
        parentId: 'optimize-prompt'
      });

      chrome.contextMenus.create({
        id: 'optimize-prompt-shorter',
        title: '📝 Daha Kısa Yap',
        contexts: ['selection'],
        parentId: 'optimize-prompt'
      });

      chrome.contextMenus.create({
        id: 'optimize-prompt-longer',
        title: '📄 Daha Detaylı Yap',
        contexts: ['selection'],
        parentId: 'optimize-prompt'
      });
    });
  }

  setupEventListeners() {
    // Context menu click handler
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      this.handleContextMenuClick(info, tab);
    });

    // Keyboard shortcut handler
    chrome.commands.onCommand.addListener((command) => {
      if (command === 'instant_optimize') {
        this.handleInstantOptimizeShortcut();
      }
    });

    // Message handler from content script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      // Async handler wrapper
      (async () => {
        try {
          await this.handleMessage(request, sender, sendResponse);
        } catch (error) {
          sendResponse({ success: false, error: error.message });
        }
      })();

      // Return true for async response
      return true;
    });

    // Extension installed/updated handler
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === 'install') {
        this.handleFirstInstall();
      } else if (details.reason === 'update') {
        this.handleUpdate(details);
      }
    });
  }

  async handleContextMenuClick(info, tab) {
    const selectedText = info.selectionText?.trim();

    if (!selectedText) {
      console.log('No text selected');
      return;
    }

    // Menu ID'sine göre seçenekleri belirle
    const options = this.getOptionsFromMenuId(info.menuItemId);

    try {
      // Content script'e optimizasyon isteği gönder
      await chrome.tabs.sendMessage(tab.id, {
        action: 'showOptimizer',
        text: selectedText,
        options: options,
        source: 'contextMenu'
      });
    } catch (error) {
      console.error('Context menu click error:', error);
    }
  }

  async handleInstantOptimizeShortcut() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      // Content script'e instant optimize mesajı gönder
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'instantOptimize'
      });

      if (!response?.success) {
        console.log('No text selected for instant optimize');
      }
    } catch (error) {
      console.error('Instant optimize error:', error);
    }
  }

  async handleMessage(request, sender, sendResponse) {
    console.log('� HandleMessage başladı:', {
      action: request.action,
      textLength: request.text?.length,
      options: request.options,
      sender: sender.tab?.url
    });

    try {
      switch (request.action) {
        case 'optimizeText':
          console.log('🎯 optimizeText action başlatılıyor...');
          {
            const text = request.text;
            const options = request.options || {};

            if (!text || !text.trim()) {
              console.error('❌ Text eksik:', { text, options });
              throw new Error('Optimize edilecek metin bulunamadı');
            }

            // Get user preferences for default tone
            const preferences = await this.storageManager.getPreferences();
            const defaultTone = preferences.defaultTone || 'neutral';

            // Varsayılanlar
            const normalizedOptions = {
              tone: options.tone || defaultTone,
              length: options.length || 'maintain',
              language: options.language || 'auto'
            };

            console.log('📝 API çağrısı yapılacak:', {
              textLength: text.length,
              options: normalizedOptions,
              apiExists: !!this.geminiAPI
            });

            // Gemini API çağrısı
            const optimizedText = await this.geminiAPI.optimizePrompt(text, normalizedOptions);
            console.log('🎉 API çağrısı tamamlandı:', {
              originalLength: text.length,
              optimizedLength: optimizedText?.length,
              hasResult: !!optimizedText
            });

            if (!optimizedText || typeof optimizedText !== 'string') {
              throw new Error('API geçersiz metin döndürdü');
            }

            const originalLength = text.length;
            const optimizedLength = optimizedText.length;
            const result = {
              original: text,
              optimized: optimizedText,
              options: normalizedOptions,
              timestamp: new Date().toISOString(),
              stats: {
                originalLength,
                optimizedLength,
                improvement: this.calculateImprovement(originalLength, optimizedLength)
              }
            };

            // İstatistikleri ve geçmişi güncelle
            await this.storageManager.updateStats(true, originalLength, optimizedLength, normalizedOptions.tone);
            await this.saveToHistory(text, optimizedText, normalizedOptions);

            sendResponse({ success: true, data: result });
          }
          break;

        case 'saveToHistory':
          await this.saveToHistory(request.original, request.optimized, request.options);
          sendResponse({ success: true });
          break;

        case 'getHistory':
          const history = await this.storageManager.getHistory();
          sendResponse({ success: true, data: history });
          break;

        case 'clearHistory':
          await this.storageManager.clearHistory();

          // Broadcast to all components that history was cleared
          this.broadcastHistoryCleared();

          sendResponse({ success: true });
          break;

        case 'getStats':
          const stats = await this.storageManager.getStats();
          sendResponse({ success: true, data: stats });
          break;

        case 'checkApiKey':
          // API anahtarı her zaman mevcut (hardcoded)
          sendResponse({ success: true, hasApiKey: true });
          break;

        default:
          console.warn('⚠️ Bilinmeyen action:', request.action);
          sendResponse({ success: false, error: 'Bilinmeyen eylem' });
      }
    } catch (error) {
      // Hata istatistiği
      if (request?.text) {
        try {
          await this.storageManager.updateStats(false, request.text.length);
        } catch (statError) { }
      }
      sendResponse({ success: false, error: error.message });
    }
  }

  async saveToHistory(original, optimized, options) {
    const preferences = await this.storageManager.getPreferences();

    if (preferences.saveHistory) {
      await this.storageManager.addToHistory(original, optimized, options);
    }
  }

  async getCurrentWebsite() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const url = new URL(tab.url);
      return url.hostname;
    } catch {
      return 'Unknown';
    }
  }

  calculateImprovement(originalLength, optimizedLength) {
    const difference = optimizedLength - originalLength;
    const percentage = ((difference / originalLength) * 100).toFixed(1);

    if (difference > 0) {
      return `+${percentage}% uzun`;
    } else if (difference < 0) {
      return `${percentage}% kısa`;
    } else {
      return 'Aynı uzunluk';
    }
  }

  getOptionsFromMenuId(menuItemId) {
    const optionsMap = {
      'optimize-prompt-formal': { tone: 'formal' },
      'optimize-prompt-casual': { tone: 'casual' },
      'optimize-prompt-technical': { tone: 'technical' },
      'optimize-prompt-concise': { tone: 'concise' },
      'optimize-prompt-shorter': { length: 'shorter' },
      'optimize-prompt-longer': { length: 'longer' }
    };

    return optionsMap[menuItemId] || { tone: 'neutral' };
  }

  async handleFirstInstall() {
    // Welcome page aç
    chrome.tabs.create({
      url: chrome.runtime.getURL('src/welcome.html')
    });
  }

  handleUpdate(details) {
    // Extension güncellendi
  }

  setupStorageListeners() {
    // Listen for storage changes to broadcast to other components
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local') {
        // Notify all tabs about storage changes
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
            if (tab.url && !tab.url.startsWith('chrome://')) {
              chrome.tabs.sendMessage(tab.id, {
                action: 'storageChanged',
                changes: changes
              }).catch(() => {
                // Ignore errors for tabs without content script
              });
            }
          });
        });
      }
    });
  }

  broadcastHistoryCleared() {
    // Notify all tabs that history was cleared
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url && !tab.url.startsWith('chrome://')) {
          chrome.tabs.sendMessage(tab.id, {
            action: 'historyCleared'
          }).catch(() => {
            // Ignore errors for tabs without content script
          });
        }
      });
    });
  }
}

// Initialize background manager
const backgroundManager = new BackgroundManager();
