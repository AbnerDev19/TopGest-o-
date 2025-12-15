// script.js - VERSÃO COM CORREÇÃO DE TEMA

console.log("Script TGL carregado. Projeto iniciado!");

document.addEventListener('DOMContentLoaded', (event) => {

    // Inicializa Feather Icons
    feather.replace();

    // ===============================================
    // 0. TEMA (FIX 3: LÓGICA SIMPLIFICADA)
    // ===============================================
    const themeBtn = document.getElementById('themeToggleBtn');
    const htmlElement = document.documentElement;
    const themeIcon = themeBtn.querySelector('i');

    // Recupera tema salvo
    const savedTheme = localStorage.getItem('tgl-theme');

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    themeBtn.addEventListener('click', () => {
        // Pega o estado ATUAL real
        const currentTheme = htmlElement.getAttribute('data-theme');
        let newTheme;

        // Lógica simples de alternância
        if (currentTheme === 'blue-dark') {
            newTheme = 'light';
        } else {
            newTheme = 'blue-dark';
        }

        // Aplica o novo tema
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('tgl-theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        // Atualiza o ícone corretamente
        if (theme === 'blue-dark') {
            themeIcon.setAttribute('data-feather', 'sun'); // Mostra Sol no escuro
        } else {
            themeIcon.setAttribute('data-feather', 'moon'); // Mostra Lua no claro
        }
        feather.replace(); // Renderiza o novo ícone
    }

    // ===============================================
    // 1. NAVBAR (Animação GSAP)
    // ===============================================
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const cards = document.querySelectorAll('.nav-card');
    const navLinks = document.querySelectorAll('.nav-card-link');
    const navContent = document.querySelector('.card-nav-content');

    let isExpanded = false;
    let tl = null;

    const calculateHeight = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const topBarHeight = 70;
        const padding = 20;
        let contentHeight;

        if (isMobile) {
            const clone = navContent.cloneNode(true);
            clone.style.visibility = 'hidden';
            clone.style.position = 'absolute';
            clone.style.height = 'auto';
            clone.style.width = nav.offsetWidth + 'px';
            clone.style.display = 'block';
            document.body.appendChild(clone);
            contentHeight = clone.scrollHeight;
            document.body.removeChild(clone);
        } else {
            contentHeight = 220;
        }
        return topBarHeight + contentHeight + padding;
    };

    const createTimeline = () => {
        if (tl) tl.kill();
        gsap.set(nav, { height: 70 });
        gsap.set(cards, { y: 20, opacity: 0 });

        tl = gsap.timeline({ paused: true });
        tl.to(nav, {
            height: calculateHeight(),
            duration: 0.4,
            ease: "power3.out"
        });
        tl.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power3.out",
            stagger: 0.05
        }, "-=0.2");
    };

    navToggle.addEventListener('click', () => {
        if (!isExpanded) {
            createTimeline();
            navToggle.classList.add('open');
            nav.classList.add('open');
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

    // ===============================================
    // 2. ACCORDION
    // ===============================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isOpen = header.classList.contains('active');

            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.classList.remove('active');
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                    const icon = otherHeader.querySelector('.accordion-icon');
                    if (icon) icon.textContent = '+';
                }
            });

            if (!isOpen) {
                header.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + "px";
                const icon = header.querySelector('.accordion-icon');
                if (icon) icon.textContent = '−';
            } else {
                header.classList.remove('active');
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
                const icon = header.querySelector('.accordion-icon');
                if (icon) icon.textContent = '+';
            }
        });
    });

    // ===============================================
    // 3. STEPPER
    // ===============================================
    let currentStep = 1;
    const totalSteps = 3;
    const nextBtn = document.getElementById('rb-btn-next');
    const backBtn = document.getElementById('rb-btn-back');
    const contents = document.querySelectorAll('.rb-step-content');
    const indicators = document.querySelectorAll('.rb-step-indicator');
    const connectors = document.querySelectorAll('.rb-step-connector-inner');
    const inputNome = document.getElementById('rb-nome');
    const inputServico = document.getElementById('rb-servico');
    const inputObs = document.getElementById('rb-obs');
    const contactRadios = document.querySelectorAll('input[name="rb-contact"]');

    function updateStepper() {
        contents.forEach(content => {
            if (content.dataset.step == currentStep) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        indicators.forEach((indicator, index) => {
            const stepNum = index + 1;
            indicator.className = 'rb-step-indicator';
            indicator.innerHTML = '';

            if (stepNum === currentStep) {
                indicator.classList.add('active');
                indicator.innerHTML = '<div class="rb-active-dot"></div>';
            } else if (stepNum < currentStep) {
                indicator.classList.add('complete');
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

        connectors.forEach((connector, index) => {
            if (currentStep > (index + 1)) connector.style.width = '100%';
            else connector.style.width = '0%';
        });

        if (currentStep === 1) backBtn.classList.add('disabled');
        else backBtn.classList.remove('disabled');

        if (currentStep === totalSteps) {
            updateFinishButtonText();
        } else {
            nextBtn.innerHTML = 'Continuar';
            nextBtn.style.backgroundColor = '';
        }
    }

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

    contactRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (currentStep === totalSteps) updateFinishButtonText();
        });
    });

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            if (currentStep === 1 && (!inputNome.value || !inputServico.value)) {
                alert('Por favor, preencha seu nome e escolha o serviço.');
                return;
            }
            currentStep++;
            updateStepper();
        } else {
            const nome = inputNome.value;
            const servico = inputServico.value;
            const obs = inputObs.value;
            const method = document.querySelector('input[name="rb-contact"]:checked').value;

            if (method === 'whatsapp') {
                const texto = `*Nova Cotação TGL*\n\n*Nome:* ${nome}\n*Serviço:* ${servico}\n*Obs:* ${obs}`;
                window.open(`https://wa.me/5561999614193?text=${encodeURIComponent(texto)}`, '_blank');
            } else {
                const mailto = `mailto:contato@tgl.com.br?subject=Cotação ${servico}&body=Nome: ${nome}%0D%0AObs: ${obs}`;
                window.location.href = mailto;
            }
        }
    });

    backBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepper();
        }
    });

    updateStepper();
});