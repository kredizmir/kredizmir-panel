// KREDİZMİR - KKB Hesaplama Motoru

class KKBEngine {
  constructor() {
    this.totalScore = 0;
    this.details = [];
    this.blockers = [];
  }

  // ANA HESAPLAMA FONKSİYONU
  calculate(formData) {
    this.totalScore = 0;
    this.details = [];
    this.blockers = [];

    // 1. FINDEKS SKORU KONTROLÜ
    this.evaluateFindeks(formData.findeks);

    // 2. KANUNI TAKİP KONTROLÜ (Kapı Sorusu)
    this.evaluateLegalAction(formData.legalAction);

    // 3. GECİKME KONTROLÜ (Kapı Sorusu)
    this.evaluateDelay(formData.delay);

    // 4. BORÇ/LİMİT ORANI
    const debtRatio = calculateDebtRatio(formData.totalDebt, formData.totalLimit);
    this.evaluateDebtRatio(debtRatio);

    // 5. DTI (Debt-to-Income)
    const dti = calculateDTI(formData.monthlyPayment, formData.income);
    this.evaluateDTI(dti);

    // 6. GEÇMİŞ KREDİ SİCİLİ
    this.evaluateCreditHistory(formData.creditHistory);

    // 7. ÇOK BANKALI ÇALIŞMA
    this.evaluateMultiBank(formData.multiBank);

    // SONUÇ HESAPLA
    return {
      score: Math.max(0, Math.min(100, this.totalScore)),
      details: this.details,
      blockers: this.blockers,
      debtRatio: debtRatio,
      dti: dti,
      findeksBand: getFindeksBand(formData.findeks),
      result: this.getResult()
    };
  }

  // 1. FINDEKS DEĞERLENDİRME
  evaluateFindeks(score) {
    const band = getFindeksBand(score);
    
    if (score < CONFIG.findeks.critical) {
      this.blockers.push(`Findeks skoru ${CONFIG.findeks.critical}'ün altında (${score})`);
      this.totalScore -= 50;
      this.details.push({
        factor: "Findeks Skoru",
        value: score,
        status: "critical",
        message: `❌ Kritik eşiğin altında (min ${CONFIG.findeks.critical})`
      });
    } else if (score >= CONFIG.findeks.excellent) {
      this.totalScore += 30;
      this.details.push({
        factor: "Findeks Skoru",
        value: score,
        status: "excellent",
        message: "✅ Mükemmel seviye (1500+)"
      });
    } else if (score >= CONFIG.findeks.strong) {
      this.totalScore += 20;
      this.details.push({
        factor: "Findeks Skoru",
        value: score,
        status: "good",
        message: "✅ Güçlü profil (1450+)"
      });
    } else {
      this.totalScore += 10;
      this.details.push({
        factor: "Findeks Skoru",
        value: score,
        status: "acceptable",
        message: "⚠️ Minimum eşikte (1400-1449)"
      });
    }
  }

  // 2. KANUNI TAKİP DEĞERLENDİRME
  evaluateLegalAction(type) {
    const rules = CONFIG.legalAction;
    let rule;

    if (type === 'none') {
      rule = rules.none;
      this.totalScore += rule.score;
      this.details.push({
        factor: "Kanuni Takip",
        value: "Yok",
        status: "excellent",
        message: `✅ ${rule.label}`
      });
    } else if (type === 'old_closed') {
      rule = rules.old_closed;
      this.totalScore += rule.score;
      this.details.push({
        factor: "Kanuni Takip",
        value: "Eski (Kapalı)",
        status: "acceptable",
        message: `⚠️ ${rule.label}`
      });
    } else {
      rule = rules.recent_or_active;
      this.blockers.push("Aktif veya yakın tarihli kanuni takip var");
      this.totalScore += rule.score;
      this.details.push({
        factor: "Kanuni Takip",
        value: "Aktif/Yakın",
        status: "critical",
        message: `❌ ${rule.label}`
      });
    }
  }

  // 3. GECİKME DEĞERLENDİRME
  evaluateDelay(type) {
    const rules = CONFIG.delay;
    let rule;

    if (type === 'no_delay') {
      rule = rules.no_delay;
      this.totalScore += rule.score;
      this.details.push({
        factor: "Ödeme Gecikmesi",
        value: "Yok",
        status: "excellent",
        message: `✅ ${rule.label}`
      });
    } else if (type === 'old_delay') {
      rule = rules.old_delay;
      this.totalScore += rule.score;
      this.details.push({
        factor: "Ödeme Gecikmesi",
        value: "Eski (6+ ay)",
        status: "acceptable",
        message: `⚠️ ${rule.label}`
      });
    } else {
      rule = rules.active_delay;
      this.blockers.push("Aktif ödeme gecikmesi var");
      this.totalScore += rule.score;
      this.details.push({
        factor: "Ödeme Gecikmesi",
        value: "Aktif",
        status: "critical",
        message: `❌ ${rule.label}`
      });
    }
  }

  // 4. BORÇ/LİMİT DEĞERLENDİRME
  evaluateDebtRatio(ratio) {
    const rules = CONFIG.debtRatio;
    let rule;

    if (ratio <= rules.excellent.max) {
      rule = rules.excellent;
      this.totalScore += rule.score;
      this.details.push({
        factor: "Borç/Limit Oranı",
        value: `%${ratio}`,
        status: "excellent",
        message: `✅ ${rule.label} (0-30%)`
      });
    } else if (ratio <= rules.good.max) {
      rule = rules.good;
      this.totalScore += rule.score;
      this.details.push({
        factor: "Borç/Limit Oranı",
        value: `%${ratio}`,
        status: "good",
        message: `✅ ${rule.label} (30-50%)`
      });
    } else if (ratio <= rules.acceptable.max) {
      rule = rules.acceptable;
      this.totalScore += rule.score;
      this.details.push({
        factor: "Borç/Limit Oranı",
        value: `%${ratio}`,
        status: "acceptable",
        message: `⚠️ ${rule.label} (50-60%)`
      });
    } else {
      rule = rules.risky;
      this.totalScore += rule.score;
      this.details.push({
        factor: "Borç/Limit Oranı",
        value: `%${ratio}`,
        status: "warning",
        message: `⚠️ ${rule.label} (60%+)`
      });
    }
  }

  // 5. DTI DEĞERLENDİRME
  evaluateDTI(dti) {
    const rules = CONFIG.dti;
    let rule;

    if (dti <= rules.excellent.max) {
      rule = rules.excellent;
      this.totalScore += rule.score;
      this.details.push({
        factor: "Borç Yükü (DTI)",
        value: `%${dti}`,
        status: "excellent",
        message: `✅ ${rule.label} (0-40%)`
      });
    } else if (dti <= rules.good.max) {
      rule = rules.good;
      this.totalScore += rule.score;
      this.details.push({
        factor: "Borç Yükü (DTI)",
        value: `%${dti}`,
        status: "good",
        message: `✅ ${rule.label} (40-50%)`
      });
    } else {
      rule = rules.risky;
      this.totalScore += rule.score;
      this.details.push({
        factor: "Borç Yükü (DTI)",
        value: `%${dti}`,
        status: "warning",
        message: `⚠️ ${rule.label} (50%+)`
      });
    }
  }

  // 6. GEÇMİŞ KREDİ SİCİLİ
  evaluateCreditHistory(type) {
    const rules = CONFIG.creditHistory;
    let rule;

    if (type === 'excellent') {
      rule = rules.excellent;
      this.totalScore += rule.score;
      this.details.push({
        factor: "Kredi Geçmişi",
        value: "3+ Kredi",
        status: "excellent",
        message: `✅ ${rule.label}`
      });
    } else if (type === 'good') {
      rule = rules.good;
      this.totalScore += rule.score;
      this.details.push({
        factor: "Kredi Geçmişi",
        value: "1-2 Kredi",
        status: "good",
        message: `✅ ${rule.label}`
      });
    } else {
      rule = rules.none;
      this.details.push({
        factor: "Kredi Geçmişi",
        value: "Yok",
        status: "neutral",
        message: `ℹ️ ${rule.label}`
      });
    }
  }

  // 7. ÇOK BANKALI ÇALIŞMA
  evaluateMultiBank(type) {
    const rules = CONFIG.multiBank;
    let rule;

    if (type === 'excellent') {
      rule = rules.excellent;
      this.totalScore += rule.score;
      this.details.push({
        factor: "Çok Bankalı",
        value: "4+ Banka",
        status: "excellent",
        message: `✅ ${rule.label}`
      });
    } else if (type === 'good') {
      rule = rules.good;
      this.totalScore += rule.score;
      this.details.push({
        factor: "Çok Bankalı",
        value: "2-3 Banka",
        status: "good",
        message: `✅ ${rule.label}`
      });
    } else {
      rule = rules.single;
      this.details.push({
        factor: "Çok Bankalı",
        value: "1 Banka",
        status: "neutral",
        message: `ℹ️ ${rule.label}`
      });
    }
  }

  // SONUÇ BELİRLE
  getResult() {
    if (this.blockers.length > 0) {
      return CONFIG.results.rejected;
    }
    return getResultCategory(this.totalScore);
  }
}
