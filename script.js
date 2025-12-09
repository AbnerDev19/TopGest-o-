// script.js

console.log("Script TGL carregado. Projeto iniciado!");

document.addEventListener('DOMContentLoaded', (event) => {
    
    // ===============================================
    // 1. LÓGICA DA NAVBAR (CARD NAV GSAP)
    // ===============================================
    
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navContent = document.querySelector('.card-nav-content');
    const cards = document.querySelectorAll('.nav-card');
    const navLinks = document.querySelectorAll('.nav-card-link');
    
    let isExpanded = false;
    let tl = null;

    const calculateHeight = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const topBarHeight = 60;
        const padding = 20;
        
        const contentClone = navContent.cloneNode(true);
        contentClone.style.visibility = 'hidden';
        contentClone.style.position = 'absolute';
        contentClone.style.height = 'auto';
        contentClone.style.width = nav.offsetWidth + 'px';
        document.body.appendChild(contentClone);
        
        let contentHeight = contentClone.scrollHeight;
        
        if (!isMobile) {
             contentHeight = 200; 
        }

        document.body.removeChild(contentClone);
        return topBarHeight + contentHeight + padding;
    };

    const createTimeline = () => {
        if (tl) tl.kill();
        
        gsap.set(nav, { height: 60 });
        gsap.set(cards, { y: 50, opacity: 0 });

        tl = gsap.timeline({ paused: true });

        tl.to(nav, {
            height: calculateHeight(),
            duration: 0.4,
            ease: "power3.out"
        });

        tl.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power3.out",
            stagger: 0.08
        }, "-=0.2");
    };

    createTimeline();

    navToggle.addEventListener('click', () => {
        if (!isExpanded) {
            navToggle.classList.add('open');
            nav.classList.add('open');
            createTimeline(); 
            tl.play();
            isExpanded = true;
        } else {
            navToggle.classList.remove('open');
            tl.reverse();
            tl.eventCallback("onReverseComplete", () => {
                nav.classList.remove('open');
                isExpanded = false;
            });
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isExpanded) {
                navToggle.classList.remove('open');
                tl.reverse();
                tl.eventCallback("onReverseComplete", () => {
                    nav.classList.remove('open');
                    isExpanded = false;
                });
            }
        });
    });

    window.addEventListener('resize', () => {
        if (isExpanded) {
            gsap.to(nav, {
                height: calculateHeight(),
                duration: 0.2
            });
        }
    });


    // ===============================================
    // 2. CÓDIGO DO ACCORDION (Diferenciais)
    // ===============================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            accordionHeaders.forEach(h => {
                if (h !== header) {
                    h.setAttribute('aria-expanded', 'false');
                    h.nextElementSibling.style.maxHeight = '0px';
                    h.querySelector('.accordion-icon').textContent = '+';
                }
            });

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

    // ===============================================
    // 3. CÓDIGO DO NOVO STEPPER (REACT BITS STYLE)
    // ===============================================

    // Configurações
    let currentStep = 1;
    const totalSteps = 3;
    
    // Elementos DOM
    const nextBtn = document.getElementById('rb-btn-next');
    const backBtn = document.getElementById('rb-btn-back');
    const contents = document.querySelectorAll('.rb-step-content');
    const indicators = document.querySelectorAll('.rb-step-indicator');
    const connectors = document.querySelectorAll('.rb-step-connector-inner');
    
    // Inputs
    const inputNome = document.getElementById('rb-nome');
    const inputServico = document.getElementById('rb-servico');
    const inputObs = document.getElementById('rb-obs');
    const contactRadios = document.querySelectorAll('input[name="rb-contact"]');

    // Função Principal de Atualização
    function updateStepper() {
        // 1. Atualizar Conteúdo (Show/Hide)
        contents.forEach(content => {
            if(content.dataset.step == currentStep) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // 2. Atualizar Indicadores (Bolinhas)
        indicators.forEach((indicator, index) => {
            const stepNum = index + 1;
            // Resetar classes
            indicator.className = 'rb-step-indicator';
            indicator.innerHTML = ''; // Limpa conteúdo

            if (stepNum === currentStep) {
                indicator.classList.add('active');
                indicator.innerHTML = '<div class="rb-active-dot"></div>';
            } else if (stepNum < currentStep) {
                indicator.classList.add('complete');
                // Ícone de Check (SVG)
                indicator.innerHTML = `
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="width:16px; height:16px;">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                    </svg>
                `;
            } else {
                indicator.classList.add('inactive');
                indicator.innerHTML = `<span class="rb-step-number">${stepNum}</span>`;
            }
        });

        // 3. Atualizar Conectores (Linhas Roxas/Amarelas)
        connectors.forEach((connector, index) => {
            if (currentStep > (index + 1)) {
                connector.style.width = '100%';
            } else {
                connector.style.width = '0%';
            }
        });

        // 4. Atualizar Botões
        if (currentStep === 1) {
            backBtn.classList.add('disabled');
        } else {
            backBtn.classList.remove('disabled');
        }

        // Texto do Botão Next
        if (currentStep === totalSteps) {
            updateFinishButtonText(); // Define se é Zap ou Email
        } else {
            nextBtn.textContent = 'Continuar';
            nextBtn.style.backgroundColor = '#5227FF'; // Cor padrão do botão
        }
    }

    // Função auxiliar para mudar texto do botão final
    function updateFinishButtonText() {
        const method = document.querySelector('input[name="rb-contact"]:checked').value;
        if (method === 'whatsapp') {
            nextBtn.innerHTML = 'Enviar no WhatsApp <i data-feather="message-circle"></i>';
            nextBtn.style.backgroundColor = '#25D366';
        } else {
            nextBtn.innerHTML = 'Enviar por E-mail <i data-feather="mail"></i>';
            nextBtn.style.backgroundColor = '#EA4335';
        }
        feather.replace();
    }

    // Event Listeners para Radios (Mudar botão em tempo real)
    contactRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (currentStep === totalSteps) updateFinishButtonText();
        });
    });

    // Botão Avançar
    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            // Validação Simples
            if (currentStep === 1) {
                if (!inputNome.value || !inputServico.value) {
                    alert('Por favor, preencha seu nome e escolha o serviço.');
                    return;
                }
            }
            currentStep++;
            updateStepper();

        } else {
            // Ação Final (Enviar)
            const nome = inputNome.value;
            const servico = inputServico.value;
            const obs = inputObs.value;
            const method = document.querySelector('input[name="rb-contact"]:checked').value;

            if (method === 'whatsapp') {
                const texto = `*Nova Cotação TGL*\n\n*Nome:* ${nome}\n*Serviço:* ${servico}\n*Obs:* ${obs}`;
                // WHATSAPP SCRIPT CORRIGIDO
                window.open(`https://wa.me/5561999614193?text=${encodeURIComponent(texto)}`, '_blank');
            } else {
                // E-MAIL SCRIPT CORRIGIDO
                const mailto = `mailto:contato@tgl.com.br?subject=Cotação ${servico}&body=Nome: ${nome}%0D%0AObs: ${obs}`;
                window.location.href = mailto;
            }
        }
    });

    // Botão Voltar
    backBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepper();
        }
    });

    // Inicializar
    updateStepper();
});