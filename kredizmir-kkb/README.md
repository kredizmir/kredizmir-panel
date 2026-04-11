# KREDİZMİR - KKB Kredi Değerlendirme Sistemi

**Yapıkredi 2. El Taşıt Kredisi** uygunluk analizi yapan profesyonel web uygulaması.

---

## 📋 ÖZELLİKLER

- ✅ 7 kritik soru ile hızlı değerlendirme
- ✅ Yapıkredi onay kriterlerine göre skor hesaplama
- ✅ Borç/Limit ve DTI oranlarını canlı hesaplama
- ✅ ÇIKAR / SINIRDA / ÇIKMAZ etiketleme
- ✅ WhatsApp entegrasyonu (tek tıkla gönder)
- ✅ Ön başvuru formundan otomatik veri aktarımı
- ✅ Mobil uyumlu, sade ve şık tasarım

---

## 🚀 KURULUM

### 1. GitHub'a Yükle

```bash
# Yeni repo oluştur
git init
git add .
git commit -m "KKB formu v1.0"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/kredizmir-kkb.git
git push -u origin main
```

### 2. GitHub Pages'i Aktifleştir

1. GitHub repo → **Settings**
2. Sol menüden **Pages**
3. **Source**: `main` branch seç
4. **Folder**: `/` (root) seç
5. **Save** tıkla
6. 2-3 dakika bekle, link hazır: `https://KULLANICI_ADIN.github.io/kredizmir-kkb/kkb-formu.html`

---

## 🔗 ÖN BAŞVURU FORMUNDAN BAĞLANTI

**Mevcut `on-basvuru.html` dosyasına ekle:**

```javascript
// Form gönderildikten sonra KKB formuna yönlendir
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Müşteri bilgilerini sessionStorage'a kaydet
    const customerData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value
    };
    sessionStorage.setItem('kredizmir_customer', JSON.stringify(customerData));
    
    // KKB formunu yeni sekmede aç
    window.open('https://KULLANICI_ADIN.github.io/kredizmir-kkb/kkb-formu.html', '_blank');
    
    // WhatsApp mesajını da gönder (mevcut kod)
    // ...
});
```

---

## ⚙️ AYARLAR

**Tüm kurallar ve eşikler `js/config.js` dosyasındadır:**

- Findeks eşikleri (1400, 1450, 1500)
- Borç/Limit oranları (%30, %50, %60)
- DTI oranları (%40, %50)
- Puan sistemi
- WhatsApp numarası
- Sonuç etiketleri (ÇIKAR/SINIRDA/ÇIKMAZ)

**Örnek: WhatsApp numarasını değiştir**

```javascript
// js/config.js içinde
whatsapp: {
    number: "905307258789",  // <-- Burası
    // ...
}
```

---

## 📊 HESAPLAMA MANTIĞI

### Mutlak Red Kriterleri (Kapı Soruları)

- Findeks < 1400 → ÇIKMAZ
- Aktif gecikme var → ÇIKMAZ
- Aktif kanuni takip var → ÇIKMAZ

### Puan Sistemi (100 üzerinden)

| Faktör | Skor |
|--------|------|
| Findeks 1400-1449 | +10 |
| Findeks 1450-1499 | +20 |
| Findeks 1500+ | +30 |
| Kanuni takip yok | +30 |
| Son 12 ay temiz | +25 |
| Borç/Limit <30% | +20 |
| DTI <40% | +15 |
| 3+ kredi kapattı | +10 |
| 4+ bankalı çalışıyor | +10 |

### Sonuç Etiketleri

- **80-100 puan:** ÇIKAR ✅ (Yüksek onay olasılığı)
- **50-79 puan:** SINIRDA ⚠️ (İyileştirme gerekli)
- **0-49 puan:** ÇIKMAZ ❌ (Alternatif yol)

---

## 🎨 TASARIM

- **Marka Rengi:** Lacivert (#1a365d) + Beyaz
- **Font:** System fonts (Apple/Android uyumlu)
- **Responsive:** Mobil, tablet, desktop
- **Stil:** Sade, şık, profesyonel

---

## 📱 WHATSAPP MESAJ ŞABLONU

```
📊 KREDİZMİR KKB Analiz Sonucu

👤 Müşteri: Mehmet Yılmaz
📱 Telefon: 0555 123 4567

🎯 SKOR: 78/100
🏷️ DURUM: SINIRDA ⚠️

📍 Tahmini Findeks: Orta (1250-1499)
📊 Borç/Limit: 45%
💰 DTI: 32%

💡 Öneri: 2-3 ay iyileştirme sonrası tekrar değerlendir.

Süreci başlatmak istiyorum.
```

---

## 🛠️ DOSYA YAPISI

```
kredizmir-kkb/
├── kkb-formu.html        # Ana sayfa
├── css/
│   └── style.css         # Stil dosyası
├── js/
│   ├── config.js         # Kurallar ve eşikler
│   ├── engine.js         # Hesaplama motoru
│   └── main.js           # Form ve UI kontrolü
└── README.md             # Bu dosya
```

---

## 📞 DESTEK

**WhatsApp:** 0530 725 87 89  
**Web:** panel.kredizmir.com

---

**© 2026 KREDİZMİR - Taşıt Kredisi & OKİ Araç Eşleştirme**
