/**
 * Settings Page Script
 * Manages extension settings and preferences
 */

class SettingsManager {
  constructor() {
    this.defaultSettings = {
      defaultTone: 'neutral',
      autoOptimize: false,
      saveHistory: true,
      maxHistory: 10,
      showSuccessNotifications: true,
      showErrorNotifications: true
    };
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['userPreferences']);
      const settings = { ...this.defaultSettings, ...(result.userPreferences || {}) };
      
      // Update UI with current settings
      this.updateUI(settings);
      
    } catch (error) {
      console.error('Settings load error:', error);
      this.showToast('Ayarlar yüklenemedi', 'error');
    }
  }

  updateUI(settings) {
    // Dropdown ayarları
    document.getElementById('defaultTone').value = settings.defaultTone;
    document.getElementById('maxHistory').value = settings.maxHistory;
    
    // Toggle ayarları
    this.setToggleState('autoOptimize', settings.autoOptimize);
    this.setToggleState('saveHistory', settings.saveHistory);
    this.setToggleState('showSuccessNotifications', settings.showSuccessNotifications);
    this.setToggleState('showErrorNotifications', settings.showErrorNotifications);
  }

  setToggleState(toggleId, active) {
    const toggle = document.getElementById(toggleId);
    if (toggle) {
      if (active) {
        toggle.classList.add('active');
      } else {
        toggle.classList.remove('active');
      }
    }
  }

  setupEventListeners() {
    // Toggle switches
    document.querySelectorAll('.toggle-switch').forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
      });
    });

    // Save settings button
    document.getElementById('saveSettings').addEventListener('click', () => {
      this.saveSettings();
    });

    // Auto-save on change
    document.querySelectorAll('select, input').forEach(element => {
      element.addEventListener('change', () => {
        // Auto-save after 1 second delay
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
          this.saveSettings(false); // Save silently
        }, 1000);
      });
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
  }

  async saveSettings(showFeedback = true) {
    try {
      const settings = this.getFormValues();
      
      await chrome.storage.sync.set({ userPreferences: settings });
      
      if (showFeedback) {
        this.showToast('Ayarlar kaydedildi', 'success');
      }
    } catch (error) {
      console.error('Settings save error:', error);
      this.showToast('Ayarlar kaydedilemedi', 'error');
    }
  }

  getFormValues() {
    return {
      defaultTone: document.getElementById('defaultTone').value,
      autoOptimize: document.getElementById('autoOptimize').classList.contains('active'),
      saveHistory: document.getElementById('saveHistory').classList.contains('active'),
      maxHistory: parseInt(document.getElementById('maxHistory').value) || 10,
      showSuccessNotifications: document.getElementById('showSuccessNotifications').classList.contains('active'),
      showErrorNotifications: document.getElementById('showErrorNotifications').classList.contains('active')
    };
  }

  showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `settings-toast settings-toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: '10000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      maxWidth: '300px'
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
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }
}

// Initialize settings manager when page loads
document.addEventListener('DOMContentLoaded', () => {
  new SettingsManager();
});