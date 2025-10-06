# 📋 CHROME WEB STORE - KOPYALA-YAPIŞTIR METINLER

Bu dosya, Chrome Web Store'da form doldururken DOĞRUDAN kopyala-yapıştır yapabileceğiniz metinleri içerir.

---

## 1️⃣ EXTENSION ADI

```
Prompt Optimizer - AI Prompt İyileştirici
```

---

## 2️⃣ KISA AÇIKLAMA (132 karakter max)

```
ChatGPT, Claude, Gemini için promptlarınızı AI ile anında iyileştirin. Daha etkili sonuçlar alın!
```

---

## 3️⃣ DETAYLI AÇIKLAMA

```
🚀 Prompt Optimizer - AI ile Daha İyi Promptlar Yazın

Yapay zeka araçlarından (ChatGPT, Claude, Gemini, Copilot) en iyi sonuçları almak için promptlarınızı otomatik olarak iyileştirin!

✨ ÖZELLİKLER

🎯 ANINDA İYİLEŞTİRME
Herhangi bir web sitesinde metin seçin, sağ tıklayın ve "Prompt İyileştir" seçin. Google Gemini AI ile optimize edilmiş promptu anında görün!

🎨 FARKLI TON SEÇENEKLERİ
• Resmi - Profesyonel ve iş dünyası için
• Samimi - Günlük ve dostça konuşma tonu
• Teknik - Detaylı ve teknik içerikler için
• Kısa ve Öz - Hızlı ve net yanıtlar için

📚 GEÇMİŞ YÖNETİMİ
Son 10 iyileştirmenizi görün, önceki promptlarınızı tekrar kullanın.

⚡ KLAVYE KISAYOLU
Ctrl+Shift+Y ile anında optimize edin.

🔒 GİZLİLİK VE GÜVENLİK
• Verileriniz sadece cihazınızda saklanır
• Sunucuya veri gönderimi YOK
• Kişisel bilgi toplama YOK
• %100 güvenli ve gizli

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📖 NASIL KULLANILIR?

1. Eklentiyi yükleyin
2. ChatGPT, Claude veya herhangi bir sitede promptunuzu yazın
3. Metni seçin
4. Sağ tıklayın → "Prompt İyileştir"
5. İyileştirilmiş promptu kopyalayın ve kullanın!

━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 ÖRNEK

📝 ÖNCESİ: "Bana bir makale yaz"

✨ SONRASI: "Yapay zeka ve otomasyon teknolojilerinin iş dünyasına etkilerini anlatan, 1000-1500 kelime uzunluğunda, profesyonel bir ton kullanarak, başlıklar ve alt başlıklar içeren, örneklerle desteklenmiş bir makale hazırla."

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎁 AVANTAJLAR

⚡ HIZLI: 2-3 saniyede optimize
🎯 ETKİLİ: Daha iyi AI yanıtları
💰 ÜCRETSİZ: Tamamen bedava
🔒 GÜVENLİ: Veri toplama yok
🌍 HER YERDE: Tüm sitelerde çalışır
🇹🇷 TÜRKÇE: Tam Türkçe destek

━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 KİMLER KULLANMALI?

✅ İçerik üreticiler
✅ Yazarlar ve bloggerlar
✅ Öğrenciler ve akademisyenler
✅ Pazarlamacılar
✅ Geliştiriciler
✅ AI ile çalışan herkes!

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 GİZLİLİK TAAHHÜDÜ

• Kişisel veri toplama YOK
• Analytics/tracking YOK
• Reklam YOK
• %100 şeffaf ve güvenli

━━━━━━━━━━━━━━━━━━━━━━━━━━━

💻 AÇIK KAYNAK
Extension tamamen açık kaynak! 
GitHub: github.com/osmntahir/prompt-optimizer-extension

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 HEMEN BAŞLAYIN!
Prompt Optimizer'ı yükleyin ve AI deneyiminizi bir üst seviyeye taşıyın!
```

---

## 4️⃣ TEK AMAÇ AÇIKLAMASI (Single Purpose Justification)

```
Prompt Optimizer eklentisinin tek amacı: Kullanıcıların yazdığı yapay zeka promptlarını (ChatGPT, Claude, Gemini vb. için) otomatik olarak iyileştirmektir.

Extension, seçili metni Google Gemini AI kullanarak daha anlaşılır, yapılandırılmış ve etkili bir prompt haline getirir. Başka hiçbir işlevi yoktur - sadece prompt optimizasyonu yapar.

Kullanıcı metin seçer → Sağ tıklar → "Prompt İyileştir" → AI optimize eder → Kullanıcı daha iyi sonuç alır.
```

---

## 5️⃣ İZİN GEREKÇELERİ (Permission Justifications)

### storage İzni:
```
Kullanıcı tercihlerini (varsayılan ton, dil, bildirim ayarları) ve iyileştirme geçmişini (maksimum 10 kayıt) cihazda LOCAL olarak saklamak için kullanılır. Hiçbir veri sunucuya gönderilmez.
```

### contextMenus İzni:
```
Kullanıcılar metin seçtiğinde sağ tıklama menüsünde "Prompt İyileştir" seçeneği göstermek için kullanılır. Farklı ton seçenekleri (Resmi, Samimi, Teknik) menüde sunulur.
```

### host_permissions (Google Gemini API):
```
Google Gemini AI API'sine bağlanarak seçili metni optimize etmek için kullanılır. Sadece kullanıcının MANUEL olarak seçip optimize etmek istediği metin API'ye gönderilir. Otomatik veri toplama yoktur.
```

### content_scripts (<all_urls>):
```
Kullanıcıların ChatGPT, Claude, Gemini, Google Docs gibi TÜM web sitelerinde prompt yazarken extension'ı kullanabilmesi için gereklidir. Extension sadece kullanıcının SEÇTİĞİ metni işler. Sayfa içeriği, form verileri veya kişisel bilgiler otomatik olarak okunmaz/toplanmaz.
```

---

## 6️⃣ GİZLİLİK POLİTİKASI URL

```
https://github.com/osmntahir/prompt-optimizer-extension/blob/master/PRIVACY-POLICY.md
```

---

## 7️⃣ DESTEK URL

```
https://github.com/osmntahir/prompt-optimizer-extension/issues
```

---

## 8️⃣ WEB SİTESİ

```
https://github.com/osmntahir/prompt-optimizer-extension
```

---

## 9️⃣ KATEGORİ

```
Productivity (Verimlilik)
```

---

## 🔟 DİL

```
Türkçe (Turkish)
```

---

## 1️⃣1️⃣ ANAHTAR KELİMELER

```
prompt, AI, ChatGPT, Gemini, Claude, optimizer, iyileştirici, yapay zeka, prompt engineering, productivity, verimlilik, türkçe
```

---

## 1️⃣2️⃣ VERİ TOPLAMA SORULARI

**Do you collect personally identifiable information?**
```
NO (Hayır)
```

**Do you collect financial information?**
```
NO (Hayır)
```

**Do you collect health information?**
```
NO (Hayır)
```

**Do you collect authentication information?**
```
NO (Hayır)
```

**Do you collect user content?**
```
YES (Evet) - Only selected text for optimization, stored locally only
```
Açıklama:
```
Sadece kullanıcının seçtiği prompt metni Google Gemini API'ye optimize edilmek için gönderilir. İyileştirme geçmişi (maksimum 10 kayıt) kullanıcının cihazında LOCAL olarak saklanır. Sunucuya veya üçüncü taraflara veri gönderilmez.
```

**Do you collect website content?**
```
NO (Hayır)
```

**Is data encrypted in transit?**
```
YES (Evet) - HTTPS kullanılır
```

**Can users request deletion of their data?**
```
YES (Evet) - Ayarlardan geçmiş temizlenebilir, extension kaldırıldığında tüm veriler silinir
```

---

## 1️⃣3️⃣ UZAK KOD KULLANIMI

**Does your extension use remote code?**
```
NO (Hayır)
```

**Açıklama (gerekirse):**
```
Extension uzak kod kullanmaz. Tüm JavaScript dosyaları extension 
paketine dahildir. Sadece Google Gemini AI API'sine JSON formatında 
veri gönderimi yapılır (prompt optimizasyonu için). Harici JavaScript 
veya Wasm dosyası yüklenmez, eval() veya Function() kullanımı yoktur.
```

**Does your extension use eval()?**
```
NO (Hayır)
```

**Does your extension load external JavaScript files?**
```
NO (Hayır) - Tüm JavaScript dosyaları extension paketinde
```

**Does your extension use WebAssembly?**
```
NO (Hayır)
```

---

## ✅ HIZLI BAŞVURU ÖZETİ

| Alan | Değer |
|------|-------|
| Extension Adı | Prompt Optimizer - AI Prompt İyileştirici |
| Kategori | Productivity |
| Dil | Türkçe |
| Fiyat | Free (Ücretsiz) |
| Minimum Chrome Versiyonu | 88+ |
| İzinler | storage, contextMenus, host_permissions |
| Veri Toplama | Sadece yerel (local only) |
| Privacy Policy | EVET (GitHub'da) |

---

**TÜM METINLER HAZIR! DOĞRUDAN KOPYALA-YAPIŞTIR YAPABİLİRSİNİZ! 🚀**
