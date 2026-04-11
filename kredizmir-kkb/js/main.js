// KREDİZMİR - KKB Formu Ana Script v2

document.addEventListener('DOMContentLoaded', function() {

    loadCustomerDataFromSession();

    const form          = document.getElementById('kkbForm');
    const formSection   = document.getElementById('formSection');
    const resultSection = document.getElementById('resultSection');
    const btnWhatsApp   = document.getElementById('btnWhatsApp');
    const btnNewAnalysis = document.getElementById('btnNewAnalysis');

    let resultData = null;

    // FORM SUBMIT
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const radio = name => {
            const el = document.querySelector(`input[name="${name}"]:checked`);
            return el ? el.value : null;
        };

        const formData = {
            customerName:  document.getElementById('customerName').value,
            customerPhone: document.getElementById('customerPhone').value,
            s1: radio('s1'),
            s2: radio('s2'),
            s3: radio('s3'),
            s4: radio('s4'),
            s5: radio('s5'),
            s6: radio('s6')
        };

        const engine = new KKBEngine();
        resultData = engine.calculate(formData);
        resultData.customerName  = formData.customerName;
        resultData.customerPhone = formData.customerPhone;

        displayResult(resultData);
        resultSection.scrollIntoView({ behavior: 'smooth' });
    });

    // YENİ ANALİZ
    btnNewAnalysis.addEventListener('click', function() {
        resultSection.classList.add('hidden');
        formSection.classList.remove('hidden');
        form.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // WHATSAPP
    btnWhatsApp.addEventListener('click', function() {
        if (resultData) sendToWhatsApp(resultData);
    });

    // SONUCU GÖSTER
    function displayResult(data) {
        formSection.classList.add('hidden');
        resultSection.classList.remove('hidden');

        // Skor direkt göster (1000-tabanlı sistem)
        document.getElementById('scoreValue').textContent = data.score.toLocaleString('tr-TR');

        const statusBadge   = document.getElementById('statusBadge');
        const statusIcon    = document.getElementById('statusIcon');
        const statusLabel   = document.getElementById('statusLabel');
        const statusMessage = document.getElementById('statusMessage');

        statusBadge.style.background = data.result.color + '22';
        statusBadge.style.borderColor = data.result.color;
        statusIcon.textContent  = data.result.icon;
        statusLabel.textContent = data.result.label;
        statusMessage.textContent = data.result.message;

        const detailsList = document.getElementById('detailsList');
        detailsList.innerHTML = '';
        data.details.forEach(detail => {
            const item = document.createElement('div');
            item.className = 'detail-item ' + detail.status;
            item.innerHTML = `
                <div>
                    <div class="detail-factor">${detail.factor}</div>
                    <div class="detail-message">${detail.message}</div>
                </div>
                <div class="detail-value">${detail.value}</div>
            `;
            detailsList.appendChild(item);
        });
    }

    // WHATSAPP MESAJI
    function sendToWhatsApp(data) {
        const message = CONFIG.whatsapp.message_template
            .replace('{name}',           data.customerName)
            .replace('{phone}',          data.customerPhone)
            .replace('{score}',          data.score.toLocaleString('tr-TR'))
            .replace('{status}',         data.result.label + ' ' + data.result.icon)
            .replace('{recommendation}', data.result.message);

        const url = `https://wa.me/${CONFIG.whatsapp.number}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // SESSION STORAGE
    function loadCustomerDataFromSession() {
        try {
            const raw = sessionStorage.getItem('kredizmir_customer');
            if (!raw) return;
            const d = JSON.parse(raw);
            if (d.name)  document.getElementById('customerName').value  = d.name;
            if (d.phone) document.getElementById('customerPhone').value = d.phone;
            sessionStorage.removeItem('kredizmir_customer');
        } catch(e) {}
    }
});
