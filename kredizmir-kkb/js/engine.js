// KREDİZMİR - KKB Hesaplama Motoru v2

class KKBEngine {
  constructor() {
    this.totalScore = 0;
    this.details = [];
    this.autoFail = false;
    this.doubleAutoFail = false;
  }

  calculate(formData) {
    this.totalScore = CONFIG.BASE_SCORE;
    this.details = [];
    this.autoFail = false;
    this.doubleAutoFail = false;

    const s1 = this._eval('s1', formData.s1, 'Kanuni Takip / İcra');
    const s2 = this._eval('s2', formData.s2, 'Son 12 Ay Gecikme');

    // Özel kural: S1=D/E VE S2=E → ÇIKMAZ mesajı
    const s1Fail = formData.s1 === 'D' || formData.s1 === 'E';
    const s2Fail = formData.s2 === 'E';
    if (s1Fail && s2Fail) this.doubleAutoFail = true;
    if (s1Fail || s2Fail) this.autoFail = true;

    this._eval('s3', formData.s3, 'Borç / Limit Oranı');
    this._eval('s4', formData.s4, 'Aylık Taksit Yükü');
    this._eval('s5', formData.s5, 'Net Aylık Gelir');
    this._eval('s6', formData.s6, 'Geçmiş Kredi Sicili');

    const finalScore = Math.max(0, this.totalScore);

    return {
      score: finalScore,
      details: this.details,
      autoFail: this.autoFail,
      doubleAutoFail: this.doubleAutoFail,
      result: this._getResult(finalScore)
    };
  }

  _eval(sKey, choice, label) {
    const rule = CONFIG[sKey][choice];
    if (!rule) {
      this.details.push({ factor: label, value: '—', status: 'neutral', message: 'ℹ️ Seçilmedi' });
      return;
    }
    this.totalScore += rule.score;
    const sign = rule.score > 0 ? '+' : '';
    const status = rule.score > 0 ? 'excellent' : rule.score === 0 ? 'neutral' : 'low';
    this.details.push({
      factor: label,
      value: sign + rule.score,
      status,
      message: rule.label
    });
  }

  _getResult(score) {
    if (this.doubleAutoFail) return CONFIG.results.cikmaz;
    if (this.autoFail)       return CONFIG.results.zor;
    if (score >= CONFIG.results.uygun.min)     return CONFIG.results.uygun;
    if (score >= CONFIG.results.sinirda.min)   return CONFIG.results.sinirda;
    if (score >= CONFIG.results.alternatif.min) return CONFIG.results.alternatif;
    return CONFIG.results.zor;
  }
}
