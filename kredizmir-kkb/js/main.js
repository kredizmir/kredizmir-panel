// KREDİZMİR - KKB Formu Ana Script

document.addEventListener('DOMContentLoaded', function() {
    
    // SESSION STORAGE'DAN ÖN BAŞVURU VERİSİNİ YÜKLE
    loadCustomerDataFromSession();

    // FORM ELEMENTLERİ
    const form = document.getElementById('kkbForm');
    const formSection = document.getElementById('formSection');
    const resultSection = document.getElementById('resultSection');
    const btnWhatsApp = document.getElementById('btnWhatsApp');
    const btnNewAnalysis = document.getElementById('btnNewAnalysis');

    // INPUT ELEMENTLERİ
    const totalLimitInput = document.getElementById('totalLimit');
    const totalDebtInput = document.getElementById('totalDebt');
    const incomeInput = document.getElementById('income');
    const monthlyPaymentInput = document.getElementById('monthlyPayment');
    const debtRatioPreview = document.getElementById('debtRatioPreview');
    const dtiPreview = document.getElementById('dtiPreview');

    // SONUÇ VERİSİ (WhatsApp için)
    let resultData = null;

    // BORÇ/LİMİT ORANI CANLI HESAPLAMA
    function updateDebtRatio() {
        const limit = parseFloat(totalLimitInput.value) || 0;
        const debt = parseFloat(totalDebtInput.value) || 0;
        
        if (limit > 0) {
            const ratio = calculateDebtRatio(debt, limit);
            debtRatioPreview.textContent = `Borç/Limit Oranı: %${ratio}`;
            
            if (ratio <= 30) {
                debtRatioPreview.className = 'ratio-preview excellent';
            } else if (ratio <= 50) {
                debtRatioPreview.className = 'ratio-preview good';
            } else if (ratio <= 60) {
                debtRatioPreview.className = 'ratio-preview warning';
            } else {
                debtRatioPreview.className = 'ratio-preview danger';
            }
        } else {
            debtRatioPreview.textContent = '';
        }
    }

    // DTI CANLI HESAPLAMA
    function updateDTI() {
        const income = parseFloat(incomeInput.value) || 0;
        const payment = parseFloat(monthlyPaymentInput.value) || 0;
        
        if (income > 0) {
            const dti = calculateDTI(payment, income);
            dtiPreview.textContent = `Borç Yükü (DTI): %${dti}`;
            
            if (dti <= 40) {
                dtiPreview.className = 'ratio-preview excellent';
            } else if (dti <= 50) {
                dtiPreview.className = 'ratio-preview good';
            } else {
                dtiPreview.className = 'ratio-preview danger';
            }
        } else {
            dtiPreview.textContent = '';
        }
    }

    // EVENT LİSTENERS
    totalLimitInput.addEventListener('input', updateDebtRatio);
    totalDebtInput.addEventListener('input', updateDebtRatio);
    incomeInput.addEventListener('input', updateDTI);
    monthlyPaymentInput.addEventListener('input', updateDTI);

    // FORM SUBMIT
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // FORM VERİSİNİ TOPLA
        const formData = {
            customerName: document.getElementById('customerName').value,
            customerPhone: document.getElementById('customerPhone').value,
            findeks: parseInt(document.getElementById('findeks').value),
            legalAction: document.querySelector('input[name="legalAction"]:checked').value,
            delay: document.querySelector('input[name="delay"]:checked').value,
            totalLimit: parseFloat(document.getElementById('totalLimit').value),
            totalDebt: parseFloat(document.getElementById('totalDebt').value),
            income: parseFloat(document.getElementById('income').value),
            monthlyPayment: parseFloat(document.getElementById('monthlyPayment').value),
            creditHistory: document.querySelector('input[name="creditHistory"]:checked').value,
            multiBank: document.querySelector('input[name="multiBank"]:checked').value
        };

        // HESAPLAMA MOTORUNU ÇALIŞTIR
        const engine = new KKBEngine();
        resultData = engine.calculate(formData);
        
        // MÜŞTERİ BİLGİLERİNİ EKLE
        resultData.customerName = formData.customerName;
        resultData.customerPhone = formData.customerPhone;

        // SONUCU GÖSTER
        displayResult(resultData);

        // SCROLL TO RESULT
        resultSection.scrollIntoView({ behavior: 'smooth' });
    });

    // YENİ ANALİZ BUTONU
    btnNewAnalysis.addEventListener('click', function() {
        resultSection.classList.add('hidden');
        formSection.classList.remove('hidden');
        form.reset();
        debtRatioPreview.textContent = '';
        dtiPreview.textContent = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // WHATSAPP BUTONU
    btnWhatsApp.addEventListener('click', function() {
        if (resultData) {
            sendToWhatsApp(resultData);
        }
    });

    // SONUCU EKRANDA GÖSTER
    function displayResult(data) {
        // Form gizle, sonuç göster
        formSection.classList.add('hidden');
        resultSection.classList.remove('hidden');

        // SKOR (dahili 0-100 × 15 = 0-1500 gösterim)
        const displayScore = Math.round(data.score * 15);
        document.getElementById('scoreValue').textContent = displayScore.toLocaleString('tr-TR');

        // DURUM ETİKETİ
        const statusBadge = document.getElementById('statusBadge');
        const statusIcon = document.getElementById('statusIcon');
        const statusLabel = document.getElementById('statusLabel');
        const statusMessage = document.getElementById('statusMessage');

        statusBadge.className = 'status-badge ' + data.result.label.toLowerCase().replace('ı', 'i');
        statusIcon.textContent = data.result.icon;
        statusLabel.textContent = data.result.label;
        statusMessage.textContent = data.result.message;

        // DETAYLAR
        const detailsList = document.getElementById('detailsList');
        detailsList.innerHTML = '';

        data.details.forEach(detail => {
            const detailItem = document.createElement('div');
            detailItem.className = 'detail-item ' + detail.status;
            detailItem.innerHTML = `
                <div>
                    <div class="detail-factor">${detail.factor}</div>
                    <div class="detail-message">${detail.message}</div>
                </div>
                <div class="detail-value">${detail.value}</div>
            `;
            detailsList.appendChild(detailItem);
        });
    }

    // WHATSAPP MESAJI GÖNDER
    function sendToWhatsApp(data) {
        const template = CONFIG.whatsapp.message_template;
        
        const message = template
            .replace('{name}', data.customerName)
            .replace('{phone}', data.customerPhone)
            .replace('{score}', Math.round(data.score * 15).toLocaleString('tr-TR'))
            .replace('{status}', data.result.label + ' ' + data.result.icon)
            .replace('{findeks_band}', `${data.findeksBand.label} (${data.findeksBand.min}-${data.findeksBand.max})`)
            .replace('{debt_ratio}', data.debtRatio)
            .replace('{dti}', data.dti)
            .replace('{recommendation}', data.result.message);

        const whatsappURL = `https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    }

    // SESSION STORAGE'DAN MÜŞTERİ VERİSİNİ YÜKLE
    function loadCustomerDataFromSession() {
        try {
            const customerData = sessionStorage.getItem('kredizmir_customer');
            if (customerData) {
                const data = JSON.parse(customerData);
                
                // Ad soyad ve telefon varsa doldur
                if (data.name) {
                    document.getElementById('customerName').value = data.name;
                }
                if (data.phone) {
                    document.getElementById('customerPhone').value = data.phone;
                }

                // Session'ı temizle
                sessionStorage.removeItem('kredizmir_customer');
            }
        } catch (error) {
            console.log('Session data yüklenemedi:', error);
        }
    }
});
