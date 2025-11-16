// script.js

console.log("Script TGL carregado. Projeto iniciado!");

document.addEventListener('DOMContentLoaded', (event) => {
    
    // --- CÓDIGO DO ACCORDION ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            // Fecha todos os outros (opcional)
            accordionHeaders.forEach(h => {
                if (h !== header) {
                    h.setAttribute('aria-expanded', 'false');
                    h.nextElementSibling.style.maxHeight = '0px';
                    h.querySelector('.accordion-icon').textContent = '+';
                }
            });

            // Abre ou fecha o item clicado
            if (!isExpanded) {
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
                header.querySelector('.accordion-icon').textContent = '−';
            } else {
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = '0px';
                header.querySelector('.accordion-icon').textContent = '+';
            }
        });
    });


    // --- NOVO CÓDIGO DO STEPPER DE COTAÇÃO ---
    let currentStep = 1;
    const totalSteps = 3;
    
    // Botões
    const stepperNext = document.getElementById('stepper-next');
    const stepperBack = document.getElementById('stepper-back');
    
    // Passos (círculos 1, 2, 3)
    const steps = document.querySelectorAll('.step');
    const stepLines = document.querySelectorAll('.step-line');

    // Panes (conteúdo)
    const panes = document.querySelectorAll('.stepper-pane');

    // Inputs
    const inputNome = document.getElementById('stepper-nome');
    const inputServico = document.getElementById('stepper-servico');
    const inputObs = document.getElementById('stepper-obs');

    // Summary (resumo)
    const summaryNome = document.getElementById('summary-nome');
    const summaryServico = document.getElementById('summary-servico');

    // Função para mostrar o passo
    function showStep(stepNumber) {
        // 1. Atualiza os Panes (Conteúdo)
        panes.forEach(pane => {
            pane.classList.remove('active');
            if (pane.getAttribute('data-pane') == stepNumber) {
                pane.classList.add('active');
            }
        });

        // 2. Atualiza os Steps (Círculos)
        steps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'complete');
            if (stepNum < stepNumber) {
                step.classList.add('complete');
            } else if (stepNum === stepNumber) {
                step.classList.add('active');
            }
        });
        
        // 3. Atualiza Linhas
        stepLines.forEach((line, index) => {
            const stepNum = index + 1;
            line.classList.remove('complete');
            if (stepNum < stepNumber) {
                line.classList.add('complete');
            }
        });

        // 4. Atualiza os Botões
        if (stepNumber === 1) {
            stepperBack.style.display = 'none';
        } else {
            stepperBack.style.display = 'block';
        }

        if (stepNumber === totalSteps) {
            stepperNext.textContent = 'Solicitar via WhatsApp';
            // Preenche o resumo no passo 3
            summaryNome.textContent = inputNome.value || 'Não preenchido';
            summaryServico.textContent = inputServico.value || 'Não preenchido';
        } else {
            stepperNext.textContent = 'Avançar';
        }
    }

    // Ação do botão AVANÇAR
    stepperNext.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            // Validação simples
            if (currentStep === 1 && (inputNome.value === '' || inputServico.value === '')) {
                alert('Por favor, preencha o nome e o serviço.');
                return;
            }

            currentStep++;
            showStep(currentStep);
        } else {
            // Ação Final: Enviar WhatsApp
            const nome = inputNome.value;
            const servico = inputServico.value;
            const obs = inputObs.value;

            // Formata a mensagem
            const texto = `Olá! Gostaria de fazer uma cotação.\n\n*Nome:* ${nome}\n*Serviço de Interesse:* ${servico}\n*Observações:* ${obs}`;
            
            // Lembre-se de trocar SEUNUMERO
            const whatsappLink = `https://wa.me/SEUNUMERO?text=${encodeURIComponent(texto)}`;
            
            window.open(whatsappLink, '_blank');
        }
    });

    // Ação do botão VOLTAR
    stepperBack.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Inicia no passo 1
    showStep(currentStep);
});