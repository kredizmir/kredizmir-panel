// KREDİZMİR - KKB Puanlama Sistemi
// Temel skor: 1000 + S1 + S2 + S3 + S4 + S5 + S6

const CONFIG = {

  BASE_SCORE: 1000,

  // S1 — Kanuni Takip / İcra / Varlık Şirketi
  s1: {
    A: { score: +200, label: "Hiç yok" },
    B: { score:  +30, label: "1 tane var, kapalı" },
    C: { score:  -80, label: "2–3 tane var, kapalı" },
    D: { score: -250, label: "4+ tane var, kapalı da olsa", autoFail: true },
    E: { score: -350, label: "1+ tane aktif",               autoFail: true }
  },

  // S2 — Son 12 Ay Gecikme
  s2: {
    A: { score: +150, label: "Hiç gecikme yok" },
    B: { score:  +40, label: "1–2 kez, max 15 gün" },
    C: { score:  -40, label: "3–5 kez, max 30 gün" },
    D: { score: -120, label: "30+ gün gecikme var (kapalı)" },
    E: { score: -280, label: "Aktif gecikme var", autoFail: true }
  },

  // S3 — Borç / Limit Oranı (Kart + KMH)
  s3: {
    A: { score: +100, label: "%0 – %30" },
    B: { score:  +50, label: "%31 – %60" },
    C: { score:  +10, label: "%61 – %80" },
    D: { score:  -15, label: "%81 – %90" },
    E: { score:  -35, label: "%91 ve üzeri" }
  },

  // S4 — Aylık Taksit Yükü
  s4: {
    A: { score: +100, label: "Hiç aktif kredi/taksit yok" },
    B: { score:  +50, label: "15.000 TL altı" },
    C: { score:  -10, label: "15.000 – 40.000 TL" },
    D: { score:  -90, label: "40.000 – 80.000 TL" },
    E: { score: -160, label: "80.000 TL üzeri" }
  },

  // S5 — Net Aylık Gelir
  s5: {
    A: { score: +130, label: "200.000 TL+" },
    B: { score:  +80, label: "100.000 – 200.000 TL" },
    C: { score:  +25, label: "50.000 – 100.000 TL" },
    D: { score:  -35, label: "25.000 – 50.000 TL" },
    E: { score:  -90, label: "25.000 TL altı" }
  },

  // S6 — Geçmiş Kredi Sicili
  s6: {
    A: { score: +130, label: "Birden fazla kredi/leasing, düzenli kapatıldı" },
    B: { score:  +75, label: "1 kredi, düzenli kapatıldı" },
    C: { score:  +25, label: "Hiç kredi kullanmadı (temiz ama geçmişsiz)" },
    D: { score:  -40, label: "Kredi kullandı, gecikmeyle/sorunlu kapandı" },
    E: { score:  -90, label: "Kredi kullandı, hâlâ sorunlu/devam ediyor" }
  },

  // SONUÇ BANTLARI
  results: {
    cikar: {
      min: 1350,
      label: "ÇIKAR",
      icon: "✅",
      color: "#28a745",
      message: "Yüksek onay olasılığı. Başvurabilirsiniz!"
    },
    sinirda: {
      min: 1000,
      label: "SINIRDA",
      icon: "🟡",
      color: "#ffc107",
      message: "Profil iyileştirme önerilir. Danışmanımızla görüşün."
    },
    alternatif: {
      min: 0,
      label: "ALTERNATİF YOL",
      icon: "💡",
      color: "#e68a00",
      message: "Dijital senet yöntemi ile devam ederseniz finansman sağlanabilir."
    }
  },

  // WHATSAPP AYARLARI
  whatsapp: {
    number: "905307258789",
    message_template: `📊 KREDİZMİR KKB Analiz Sonucu

👤 Müşteri: {name}
📱 Telefon: {phone}

🎯 SKOR: {score} PUAN
🏷️ DURUM: {status}

💡 Öneri: {recommendation}

Süreci başlatmak istiyorum.`
  }
};
