// KREDİZMİR - KKB Kredi Değerlendirme Motoru
// Yapıkredi 2. El Taşıt Kredisi Kriterleri

const CONFIG = {
  
  // FINDEKS EŞİKLERİ
  findeks: {
    critical: 1400,      // Minimum onay skoru
    strong: 1450,        // Güçlü profil
    excellent: 1500,     // Mükemmel profil
    bands: [
      { min: 0, max: 949, label: "Çok Düşük", color: "#dc3545" },
      { min: 950, max: 1249, label: "Düşük", color: "#fd7e14" },
      { min: 1250, max: 1499, label: "Orta", color: "#ffc107" },
      { min: 1500, max: 1749, label: "İyi", color: "#28a745" },
      { min: 1750, max: 1900, label: "Mükemmel", color: "#007bff" }
    ]
  },

  // KANUNI TAKİP KURALLARI
  legalAction: {
    none: { score: 30, label: "Temiz Sicil ✓" },
    old_closed: { score: 10, label: "Eski Takip (Kapalı)" },
    recent_or_active: { score: -100, label: "Aktif/Yakın Takip ❌" }
  },

  // GECİKME KURALLARI
  delay: {
    no_delay: { score: 25, label: "Hiç Gecikme Yok ✓" },
    old_delay: { score: 10, label: "Eski Gecikme (6+ ay önce)" },
    active_delay: { score: -100, label: "Aktif Gecikme ❌" }
  },

  // BORÇ/LİMİT ORANLARI
  debtRatio: {
    excellent: { max: 30, score: 20, label: "Mükemmel" },
    good: { max: 50, score: 10, label: "İyi" },
    acceptable: { max: 60, score: 0, label: "Kabul Edilebilir" },
    risky: { max: 100, score: -20, label: "Riskli" }
  },

  // DTI (Debt-to-Income) ORANLARI
  dti: {
    excellent: { max: 40, score: 15, label: "Düşük Borç Yükü" },
    good: { max: 50, score: 5, label: "Orta Borç Yükü" },
    risky: { max: 100, score: -15, label: "Yüksek Borç Yükü" }
  },

  // GEÇMİŞ KREDİ SİCİLİ
  creditHistory: {
    excellent: { score: 10, label: "3+ Kredi Kapattı" },
    good: { score: 5, label: "1-2 Kredi Kapattı" },
    none: { score: 0, label: "Kredi Geçmişi Yok" }
  },

  // ÇOK BANKALI ÇALIŞMA
  multiBank: {
    excellent: { score: 10, label: "4+ Banka" },
    good: { score: 5, label: "2-3 Banka" },
    single: { score: 0, label: "1 Banka" }
  },

  // SONUÇ ETİKETLERİ
  results: {
    approved: {
      min: 80,
      label: "ÇIKAR",
      icon: "✅",
      color: "#28a745",
      message: "Yüksek onay olasılığı. Başvurabilirsin!"
    },
    borderline: {
      min: 50,
      label: "SINIRDA",
      icon: "⚠️",
      color: "#ffc107",
      message: "2-3 ay iyileştirme sonrası tekrar değerlendir."
    },
    rejected: {
      min: 0,
      label: "ÇIKMAZ",
      icon: "❌",
      color: "#dc3545",
      message: "Alternatif yol ara veya profili güçlendir."
    }
  },

  // WHATSAPP AYARLARI
  whatsapp: {
    number: "905307258789",
    message_template: `📊 KREDİZMİR KKB Analiz Sonucu

👤 Müşteri: {name}
📱 Telefon: {phone}

🎯 SKOR: {score}/100
🏷️ DURUM: {status}

📍 Tahmini Findeks: {findeks_band}
📊 Borç/Limit: {debt_ratio}%
💰 DTI: {dti}%

💡 Öneri: {recommendation}

Süreci başlatmak istiyorum.`
  }
};

// HESAPLAMA FONKSİYONLARI
function calculateDebtRatio(debt, limit) {
  if (limit === 0) return 0;
  return Math.round((debt / limit) * 100);
}

function calculateDTI(monthlyPayment, income) {
  if (income === 0) return 0;
  return Math.round((monthlyPayment / income) * 100);
}

function getFindeksBand(score) {
  const band = CONFIG.findeks.bands.find(b => score >= b.min && score <= b.max);
  return band || CONFIG.findeks.bands[0];
}

function getResultCategory(score) {
  if (score >= CONFIG.results.approved.min) return CONFIG.results.approved;
  if (score >= CONFIG.results.borderline.min) return CONFIG.results.borderline;
  return CONFIG.results.rejected;
}
