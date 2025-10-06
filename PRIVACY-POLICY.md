# Gizlilik Politikası - Prompt Optimizer

**Son Güncelleme:** 6 Ekim 2025  
**Versiyon:** 1.0.0

## Genel Bakış
Prompt Optimizer, kullanıcı gizliliğine önem veren bir Chrome extension'ıdır. Bu belge, extension'ın hangi verileri topladığını, nasıl kullandığını ve koruduğunu açıklar.

---

## Toplanan Veriler

### 1. Kullanıcı Ayarları (Yerel Depolama)
**Ne Toplanır:**
- Varsayılan ton tercihi (Resmi, Samimi, Teknik, vb.)
- Otomatik iyileştirme açık/kapalı durumu
- Geçmiş kaydetme tercihi
- Bildirim tercihleri

**Nerede Saklanır:**
- Chrome'un yerel depolama alanında (`chrome.storage.sync`)
- Sadece kullanıcının cihazında
- Sunucuya veya üçüncü taraf servislere GÖNDERİLMEZ

**Amaç:**
- Kullanıcı deneyimini kişiselleştirmek
- Tercih edilen ayarları hatırlamak

---

### 2. İyileştirme Geçmişi (Yerel Depolama)
**Ne Toplanır:**
- Son 10 optimize edilmiş prompt (orijinal ve optimize edilmiş versiyonlar)
- İyileştirme tarihi ve saati
- Kullanılan ayarlar (ton, dil, uzunluk)

**Nerede Saklanır:**
- Chrome'un yerel depolama alanında (`chrome.storage.local`)
- Maksimum 10 kayıt tutulur (eski kayıtlar otomatik silinir)
- Sunucuya GÖNDERİLMEZ

**Amaç:**
- Kullanıcının geçmiş optimizasyonlarını tekrar görmesi
- Kopyalama ve karşılaştırma imkanı sunmak

**Kullanıcı Kontrolü:**
- Geçmişi istediği zaman tamamen silebilir
- Ayarlardan geçmiş kaydetmeyi kapatabilir

---

### 3. Kullanım İstatistikleri (Yerel Depolama)
**Ne Toplanır:**
- Toplam iyileştirme sayısı
- Başarılı/başarısız işlem sayıları
- En çok kullanılan ton tercihleri

**Nerede Saklanır:**
- Sadece kullanıcının cihazında
- Hiçbir zaman dışarı gönderilmez

**Amaç:**
- Kullanıcıya kullanım istatistikleri göstermek
- Extension'ın ne kadar kullanıldığını görmek

---

## API'ye Gönderilen Veriler

### Google Gemini AI API
**Ne Gönderilir:**
- Sadece kullanıcının SEÇTIĞI ve iyileştirmek istediği metin
- Seçilen ayarlar (ton, dil, uzunluk tercihleri)

**Nasıl Gönderilir:**
- HTTPS ile şifreli bağlantı
- Sadece kullanıcı manuel olarak "İyileştir" butonuna tıkladığında
- Otomatik veri gönderimi YOK

**Google'ın Kullanımı:**
- Google Gemini API'nin kendi gizlilik politikasına tabidir
- API KEY extension içinde hardcoded (kullanıcıdan toplanmaz)

**Gönderilmeyen Veriler:**
- Sayfa içeriği
- Form verileri
- Şifreler
- Kişisel bilgiler
- Çerezler
- Tarayıcı geçmişi

---

## Toplanmayan Veriler

### ❌ Kişisel Bilgiler
- İsim, e-posta, telefon numarası toplanmaz
- Kullanıcı kimliği oluşturulmaz
- Hesap sistemi yok

### ❌ Tarayıcı Verisi
- Gezinme geçmişi okunmaz
- Açık sekmeler izlenmez
- Form verileri toplanmaz
- Çerezler okunmaz

### ❌ Analytics/Tracking
- Google Analytics kullanılmaz
- Kullanıcı davranışı izlenmez
- IP adresi toplanmaz
- Konum bilgisi alınmaz

### ❌ Reklam/Pazarlama
- Reklam servisleri yok
- Pazarlama verileri toplanmaz
- Üçüncü taraf reklam ağlarına veri gönderilmez

---

## Veri Güvenliği

### Şifreleme
- Tüm API iletişimi HTTPS ile şifrelidir
- Yerel depolama Chrome'un güvenli storage API'si ile korunur

### Veri Saklama
- Veriler sadece kullanıcının cihazında saklanır
- Cloud yedekleme yok
- Merkezi sunucu yok

### Veri Silme
- Kullanıcı extension'ı kaldırdığında tüm veriler SİLİNİR
- Ayarlardan "Geçmişi Temizle" ile manuel silme imkanı
- Chrome storage'ı temizleme ile tüm veriler kaldırılabilir

---

## Üçüncü Taraf Servisler

### Google Gemini AI API
- **Amaç:** Prompt optimizasyonu
- **Veri:** Sadece seçili metin
- **Politika:** [Google AI Privacy Policy](https://policies.google.com/privacy)

**Diğer Üçüncü Taraf Servisleri:**
- Analytics: YOK
- Crash Reporting: YOK
- Reklam Ağları: YOK

---

## Çocukların Gizliliği
Extension, 13 yaş altı çocuklar için tasarlanmamıştır. Bilerek 13 yaş altı çocuklardan veri toplamamaktayız.

---

## Kullanıcı Hakları

### Erişim Hakkı
- Tüm saklanan veriler extension popup'ında görüntülenebilir
- Ayarlar ve geçmiş her zaman erişilebilir

### Silme Hakkı
- Geçmişi istediği zaman silebilir
- Extension'ı kaldırarak tüm verileri silebilir

### Kontrol Hakkı
- Hangi verilerin saklanacağını seçebilir
- Geçmiş kaydetmeyi kapatabilir
- Otomatik iyileştirmeyi kapatabilir

---

## Değişiklikler
Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler olduğunda:
- Extension güncelleme notlarında belirtilir
- Kullanıcılar bilgilendirilir

---

## İletişim
Gizlilik ile ilgili sorularınız için:
- **GitHub:** https://github.com/osmntahir/prompt-optimizer-extension
- **Destek:** https://buymeacoffee.com/osmntahir

---

## Özet

### ✅ Yapıyoruz
- Ayarları yerel olarak saklıyoruz
- Seçili metni AI ile optimize ediyoruz
- Kullanıcıya tam kontrol veriyoruz

### ❌ Yapmıyoruz  
- Kişisel veri toplamıyoruz
- Tracking/analytics yapmıyoruz
- Veri satmıyoruz veya paylaşmıyoruz
- Reklam göstermiyoruz

---

**Gizliliğiniz bizim için önemlidir. Extension tamamen açık kaynak olarak geliştirilmiştir ve kaynak kodları GitHub'da incelenebilir.**

**GitHub Repository:** https://github.com/osmntahir/prompt-optimizer-extension

---

*Bu gizlilik politikası Türkçe ve İngilizce olarak sağlanmaktadır.*
