# 🚀 Prompt Optimizer

AI destekli prompt iyileştirme Chrome eklentisi. ChatGPT, Claude, Gemini gibi yapay zeka araçlarında kullanacağınız promptları daha etkili hale getirir.

---

### ☕ Destek Ol
Projeyi beğendiysen bana bir kahve ısmarlamayı düşünebilirsin!

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/osmntahir)

---

## ✨ Özellikler

- 🎯 **Hızlı Optimizasyon**: Herhangi bir metni seç, sağ tık ile optimize et
- ⌨️ **Klavye Kısayolu**: `Ctrl+Shift+Y` ile anında erişim
- 🔄 **Otomatik İyileştirme**: Metin seçince otomatik öneri göster (ayarlardan aktif et)
- 🎨 **Çoklu Ton**: Dengeli, Resmi, Samimi, Teknik, Kısa ve Öz seçenekleri
- 📚 **Geçmiş**: Son 10 optimizasyonunu kaydet ve tekrar kullan
- 🔒 **Gizlilik**: Tüm veriler yerel olarak saklanır, takip yok
- 🌐 **Google Gemini AI**: Güçlü AI ile profesyonel prompt oluşturma

## � Kurulum

### Chrome Web Store'dan (Yakında)
Eklenti Chrome Web Store'da yayınlandığında buraya link eklenecek.

### Manuel Kurulum (Geliştirici Modu)
1. Bu repository'yi bilgisayarına indir veya klonla:
   ```bash
   git clone https://github.com/osmntahir/prompt-optimizer-extension.git
   ```

2. Chrome tarayıcıda `chrome://extensions/` adresine git

3. Sağ üstten **Geliştirici Modu**nu aktif et

4. **Paketlenmemiş öğe yükle** butonuna tıkla

5. İndirdiğin klasörü seç

6. Eklenti hazır! 🎉

### Google Gemini API Anahtarı
1. [Google AI Studio](https://aistudio.google.com/app/apikey) adresine git
2. **Get API Key** ile ücretsiz API anahtarı oluştur
3. Eklenti ayarlarından API anahtarını yapıştır
4. Kaydet ve kullanmaya başla!

## 🎯 Kullanım

### Yöntem 1: Sağ Tık Menüsü
1. Herhangi bir web sayfasında metin seç
2. Sağ tık yap ve **"Prompt İyileştir"** seçeneğine tıkla
3. Açılan pencerede ton seçeneğini belirle (Dengeli, Resmi, Samimi, vb.)
4. İyileştirilmiş promptunu kopyala ve kullan!

### Yöntem 2: Klavye Kısayolu
1. Metni seç
2. `Ctrl+Shift+Y` tuşlarına bas (Windows/Linux)
3. veya `Cmd+Shift+Y` (Mac)
4. İyileştirme penceresi anında açılır

### Yöntem 3: Otomatik Öneri
1. Ayarlardan **Otomatik İyileştirme**yi aktif et
2. Artık herhangi bir metni seçtiğinde otomatik olarak iyileştirme penceresi belirir
3. Ekstra tık veya klavye kısayoluna gerek yok!

### Eklenti Popup'ı
- Tarayıcı araç çubuğunda eklenti ikonuna tıkla
- **Geçmiş**: Son 10 optimizasyonunu görüntüle ve tekrar kullan
- **İstatistikler**: Toplam kullanım sayısını kontrol et
- **Ayarlar**: Ton, otomatik iyileştirme ve diğer tercihleri yapılandır

## 🛠 Teknolojiler

- **Chrome Extension Manifest V3**: Modern eklenti standardı
- **Vanilla JavaScript**: Framework bağımsız, hızlı ve hafif
- **Google Gemini AI API**: Güçlü AI ile metin optimizasyonu
- **Chrome Storage API**: Güvenli yerel veri saklama
- **Modern CSS**: Gradient animasyonlar ve responsive tasarım

## 📊 Ton Seçenekleri

| Ton | Açıklama | Kullanım Alanı |
|-----|----------|----------------|
| **Dengeli** | Profesyonel ve tarafsız | Genel kullanım, çoğu senaryo |
| **Resmi** | Kurumsal ve ciddi | İş mailleri, resmi belgeler |
| **Samimi** | Dostça ve günlük | Sosyal medya, blog yazıları |
| **Teknik** | Detaylı ve açıklayıcı | Kod, dokümantasyon, teknik içerik |
| **Kısa ve Öz** | Minimal ve net | Hızlı sorular, özet bilgiler |

## 🔐 Gizlilik ve Güvenlik

- ✅ **Yerel Depolama**: API anahtarın ve geçmişin sadece senin bilgisayarında
- ✅ **Şifrelenmiş Bağlantı**: Tüm API çağrıları HTTPS ile
- ✅ **Takip Yok**: Hiçbir kullanıcı verisi toplanmaz veya paylaşılmaz
- ✅ **Minimal İzinler**: Sadece gerekli Chrome izinleri kullanılır
- ✅ **Açık Kaynak**: Tüm kod GitHub'da incelenebilir

Detaylı gizlilik politikası: [Privacy Policy](https://osmntahir.github.io/prompt-optimizer-extension/privacy.html)

## 📁 Proje Yapısı

```
prompt-optimizer-extension/
├── manifest.json              # Eklenti yapılandırması
├── src/
│   ├── popup.html            # Popup arayüzü
│   ├── settings.html         # Ayarlar sayfası
│   ├── welcome.html          # Hoş geldin sayfası
│   ├── js/
│   │   ├── background.js     # Arka plan script
│   │   ├── content.js        # İçerik script
│   │   ├── popup.js          # Popup logic
│   │   └── settings.js       # Ayarlar logic
│   ├── css/
│   │   ├── content.css       # İçerik stilleri
│   │   └── popup.css         # Popup stilleri
│   ├── utils/
│   │   ├── gemini-api.js     # AI API yönetimi
│   │   └── storage-manager.js # Veri yönetimi
│   └── icons/                # Eklenti iconları
└── README.md
```

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyorum! Projeyi geliştirmek için:

1. Repository'yi fork'la
2. Yeni bir branch oluştur: `git checkout -b yeni-ozellik`
3. Değişikliklerini commit et: `git commit -m 'Yeni özellik eklendi'`
4. Branch'ini push'la: `git push origin yeni-ozellik`
5. Pull Request aç

## 📄 Lisans

Bu proje MIT lisansı altında açık kaynaklıdır. Detaylar için [LICENSE](LICENSE) dosyasına bakabilirsin.

## 💬 İletişim ve Destek

- **GitHub Issues**: [Hata bildir veya öneride bulun](https://github.com/osmntahir/prompt-optimizer-extension/issues)
- **Buy Me a Coffee**: [☕ Kahve ısmarla](https://buymeacoffee.com/osmntahir)

## 🎉 Sürüm Notları

### v1.0.0 (İlk Sürüm)
- ✅ Google Gemini AI entegrasyonu
- ✅ Sağ tık menüsü desteği
- ✅ Klavye kısayolu: `Ctrl+Shift+Y`
- ✅ Otomatik iyileştirme özelliği
- ✅ 5 farklı ton seçeneği
- ✅ Geçmiş kaydetme (maksimum 10)
- ✅ Modern ve responsive UI
- ✅ Türkçe dil desteği
- ✅ Gizlilik odaklı tasarım

---

<div align="center">

**AI ile daha iyi promptlar için ❤️ ile yapıldı**

[⭐ Star](https://github.com/osmntahir/prompt-optimizer-extension) | [🐛 Issue](https://github.com/osmntahir/prompt-optimizer-extension/issues) | [☕ Coffee](https://buymeacoffee.com/osmntahir)

</div>
