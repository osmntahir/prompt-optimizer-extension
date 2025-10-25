# Prompt Optimizer Chrome Extension

Professional Chrome extension for optimizing text using Google Gemini AI.

## Features

- 🚀 **Quick Optimization**: Right-click any selected text to optimize
- ⌨️ **Keyboard Shortcut**: Ctrl+Shift+P for quick access  
- 🎨 **Multiple Tones**: Formal, casual, technical, concise options
- 📊 **Statistics**: Track usage and improvements
- 📱 **Modern UI**: Clean, responsive interface
- 🔒 **Privacy**: All processing via Google Gemini API

## Installation

1. Download or clone this repository
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension folder
5. The extension is ready to use!

## Usage

### Context Menu Method
1. Select any text on a webpage
2. Right-click and choose "Prompt İyileştir"
3. Choose optimization style (formal, casual, etc.)
4. View original and optimized versions

### Keyboard Shortcut
- Press `Ctrl+Shift+P` with text selected
- Optimization interface appears instantly

### Extension Popup
- Click the extension icon in toolbar
- View statistics and history
- Access settings and preferences

## License

MIT License - Feel free to modify and distribute.
- **Karşılaştırma**: Orijinal ve iyileştirilmiş versiyonu yan yana görüntüleme

### Gelişmiş Özellikler
- **Ton Seçenekleri**: Resmi, Samimi, Teknik, Kısa ve Öz seçenekleri
- **Uzunluk Kontrolü**: Daha kısa veya daha uzun versiyonlar
- **Çoklu Dil**: Türkçe ve İngilizce otomatik algılama
- **Tek Tıkla Kopyalama**: Optimize edilmiş metni hızlıca kopyalama
- **Geçmiş**: Son optimizasyonları görüntüleme
- **İstatistikler**: Kullanım verilerini takip etme

### Kullanıcı Deneyimi
- **Modern UI**: Gradient renkleri ve animasyonlar
- **Responsive**: Tüm ekran boyutlarında çalışır
- **Dark Mode**: Otomatik tema desteği
- **Toast Bildirimleri**: Kullanıcı dostu geri bildirimler

## 📁 Proje Yapısı

```
prompt-optimizer-extension/
├── manifest.json                 # Extension manifest
├── src/
│   ├── js/
│   │   ├── background.js         # Service worker
│   │   ├── content.js           # Content script
│   │   └── popup.js             # Popup interface
│   ├── css/
│   │   ├── content.css          # Content script styles
│   │   └── popup.css            # Popup styles
│   ├── utils/
│   │   ├── gemini-api.js        # API management
│   │   └── storage-manager.js   # Data management
│   ├── icons/                   # Extension icons
│   ├── popup.html              # Popup interface
│   └── welcome.html            # Welcome page
└── README.md
```

## 🚀 Kurulum

### 1. Geliştirici Modu Kurulumu
1. Chrome'da `chrome://extensions/` adresine gidin
2. "Geliştirici modu"nu etkinleştirin
3. "Paketlenmemiş öğe yükle"yi tıklayın
4. Bu proje klasörünü seçin

### 2. API Anahtarı Kurulumu
1. [Google AI Studio](https://makersuite.google.com/app/apikey) adresine gidin
2. Yeni bir API anahtarı oluşturun
3. Extension'da API anahtarınızı girin

## 🎯 Kullanım

### Temel Kullanım
1. Herhangi bir web sayfasında metin seçin
2. Sağ tık yapın ve "Prompt İyileştir" seçin
3. Veya `Ctrl+Shift+P` kısayolunu kullanın

### Gelişmiş Özellikler
- **Ton Değiştirme**: Açılan pencerede ton seçeneklerini değiştirin
- **Uzunluk Ayarlama**: Daha kısa veya uzun versiyonlar isteyin
- **Geçmiş Görüntüleme**: Extension popup'ında geçmişi inceleyin
- **İstatistikler**: Kullanım verilerinizi takip edin

## 🛠 Teknoloji Stack

### Chrome Extension API v3
- **Background Script**: Service Worker tabanlı
- **Content Scripts**: Web sayfası entegrasyonu
- **Storage API**: Veri kalıcılığı
- **Context Menus**: Sağ tık menü entegrasyonu

### Frontend Teknolojileri
- **Vanilla JavaScript**: Framework bağımsız
- **Modern CSS**: Flexbox, Grid, Animations
- **Responsive Design**: Mobil uyumlu
- **Progressive Enhancement**: Kademeli geliştirme

### API Entegrasyonu
- **Google Gemini AI**: Metin optimizasyonu
- **Fetch API**: HTTP istekleri
- **Error Handling**: Kapsamlı hata yönetimi
- **Rate Limiting**: API limit kontrolü

## 🎨 Tasarım Özellikleri

### Modern UI/UX
- **Gradient Renkler**: #667eea → #764ba2
- **Smooth Animations**: CSS transitions
- **Glass Effect**: Backdrop blur
- **Card Layout**: Modern kart tasarımı

### Responsive Design
- **Mobile First**: Mobil öncelikli tasarım
- **Flexbox Layout**: Esnek düzen sistemi
- **Adaptive UI**: Ekran boyutuna göre uyum
- **Touch Friendly**: Dokunmatik cihaz desteği

## 🔧 Geliştirme

### Yerel Geliştirme
```bash
# Projeyi klonlayın
git clone <repo-url>

# Proje dizinine gidin
cd prompt-optimizer-extension

# Chrome'da yükleyin (yukarıdaki adımları takip edin)
```

### Debugging
- **Console Logs**: Background ve content scriptlerde
- **Chrome DevTools**: Extension debugging
- **Storage Inspection**: chrome://extensions/
- **Network Monitoring**: API çağrıları için

## 📝 API Kullanımı

### Google Gemini API
```javascript
const response = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', 
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': API_KEY
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: optimizationPrompt
        }]
      }]
    })
  }
);
```

## 📊 Özellik Detayları

### Ton Seçenekleri
- **Neutral**: Dengeli ve profesyonel
- **Formal**: Resmi ve kurumsal
- **Casual**: Samimi ve günlük
- **Technical**: Teknik ve detaylı
- **Concise**: Kısa ve öz

### Dil Desteği
- **Otomatik Algılama**: Metin analizi ile dil tespiti
- **Türkçe**: Tam destek
- **İngilizce**: Tam destek
- **Manuel Seçim**: Kullanıcı tercihi

## 🔐 Güvenlik

### API Güvenliği
- **Local Storage**: API anahtarları güvenli depolama
- **HTTPS Only**: Şifrelenmiş bağlantılar
- **No Data Leakage**: Veri sızıntısı koruması
- **Permission Model**: Minimum izin prensibi

### Privacy
- **Local Processing**: Veriler yerel olarak işlenir
- **No Tracking**: Kullanıcı takibi yok
- **Opt-in Features**: İsteğe bağlı özellikler
- **Data Control**: Kullanıcı veri kontrolü

## 🎉 Gelecek Özellikler

### v1.1 Planları
- [ ] Özel ton tanımları
- [ ] Bulk optimizasyon
- [ ] Export/Import işlemleri
- [ ] Keyboard shortcuts özelleştirme

### v1.2 Planları
- [ ] Multiple AI providers
- [ ] Template sistem
- [ ] Team collaboration
- [ ] Analytics dashboard

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 💬 Destek

- **Issues**: GitHub Issues kullanın
- **Email**: support@promptoptimizer.com
- **Kahve ısmarla**: [Buy Me a Coffee](https://buymeacoffee.com/osmntahir)

## 📈 Sürüm Geçmişi

### v1.0.0 (İlk Sürüm)
- ✅ Temel optimizasyon işlevleri
- ✅ Sağ tık menü entegrasyonu  
- ✅ Keyboard shortcuts
- ✅ Modern UI tasarımı
- ✅ API anahtarı yönetimi
- ✅ Geçmiş ve istatistikler
- ✅ Çoklu dil desteği
- ✅ Responsive design

---

**Made with ❤️ for better prompts**
