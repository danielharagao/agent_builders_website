// script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('multiStepForm');
    const formPages = document.querySelectorAll('.form-page');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const submitBtn = document.querySelector('.submit-btn');
    let currentPage = 0;

    // Mostrar a primeira página
    formPages[currentPage].classList.add('active');

    // Função para mudar de página
    function showPage(index) {
        formPages.forEach((page, i) => {
            page.classList.toggle('active', i === index);
        });
    }

    // Eventos dos botões "Próximo"
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validatePage(currentPage)) {
                currentPage++;
                showPage(currentPage);
            }
        });
    });

    // Eventos dos botões "Anterior"
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage--;
            showPage(currentPage);
        });
    });

    // Validação de cada página
    function validatePage(page) {
        const currentFormPage = formPages[page];
        const inputs = currentFormPage.querySelectorAll('input, select, textarea');
        let valid = true;

        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                valid = false;
                input.style.borderColor = 'red';
            } else {
                input.style.borderColor = '#ddd';
            }

            // Campos "Outro"
            if (input.name.includes('other') && input.disabled === false && !input.value.trim()) {
                valid = false;
                input.style.borderColor = 'red';
            }
        });

        if (!valid) {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }

        return valid;
    }

    // Habilitar campos "Outro" quando selecionado
    const industryRadios = document.getElementsByName('industry');
    const industryOther = document.getElementById('industry_other');

    industryRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'Outro') {
                industryOther.disabled = false;
            } else {
                industryOther.disabled = true;
                industryOther.value = '';
            }
        });
    });

    const meetingPreferenceRadios = document.getElementsByName('meetingPreference');
    const meetingPreferenceOther = document.getElementById('meetingPreference_other');

    meetingPreferenceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'Outro') {
                meetingPreferenceOther.disabled = false;
            } else {
                meetingPreferenceOther.disabled = true;
                meetingPreferenceOther.value = '';
            }
        });
    });

    // Função para coletar os dados do formulário
    function collectFormData() {
        const formData = {};

        // Dados da Empresa
        formData.companyName = document.getElementById('companyName').value.trim();
        formData.contactEmail = document.getElementById('contactEmail').value.trim();
        formData.contactNumber = document.getElementById('contactNumber').value.trim();
        formData.industry = document.getElementById('industry').value;
        if (formData.industry === 'Outro') {
            formData.industry = document.getElementById('industry_other').value.trim();
        }

        // Detalhes do Projeto
        formData.projectDescription = document.getElementById('projectDescription').value.trim();
        formData.desiredTechnologies = document.getElementById('desiredTechnologies').value.trim();
        formData.budget = document.getElementById('budget').value.trim();

        // Preferências de Reunião
        const meetingPreferenceSelected = document.querySelector('input[name="meetingPreference"]:checked');
        formData.meetingPreference = meetingPreferenceSelected.value;
        if (formData.meetingPreference === 'Outro') {
            formData.meetingPreference = document.getElementById('meetingPreference_other').value.trim();
        }

        formData.preferredTime = document.getElementById('preferredTime').value;

        // Consentimentos
        formData.privacy_consent = document.querySelector('input[name="privacy_consent"]').checked;
        formData.feedback_consent = document.querySelector('input[name="feedback_consent"]').checked;

        return formData;
    }

    // Função para enviar os dados para a API
    async function submitFormData(formData) {
        try {
            const response = await fetch('https://sua-api.com/subscribe', { // Substitua pela URL da sua API
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro na submissão');
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
            throw error;
        }
    }

    // Evento de submissão do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (validatePage(currentPage)) {
            // Coletar os dados do formulário
            const data = collectFormData();

            // Enviar os dados para a API
            try {
                const result = await submitFormData(data);
                console.log('Formulário enviado com sucesso:', result);

                // Mostrar a página de confirmação
                currentPage++;
                showPage(currentPage);

                // Resetar o formulário
                form.reset();

                // Resetar os campos "Outro"
                document.getElementById('industry_other').disabled = true;
                document.getElementById('meetingPreference_other').disabled = true;
            } catch (error) {
                alert('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente mais tarde.');
            }
        }
    });

    // Seção FAQ - Toggle de respostas
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('h4');
        const answer = item.querySelector('p');

        question.addEventListener('click', () => {
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                answer.style.display = 'block';
            } else {
                answer.style.display = 'none';
            }
        });
    });
});
