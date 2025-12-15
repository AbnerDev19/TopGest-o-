// script.js - VERSÃO CORRIGIDA E FINAL

console.log("Script TGL carregado. Projeto iniciado!");

document.addEventListener('DOMContentLoaded', (event) => {

    // ===============================================
    // 0. TEMA (CORREÇÃO CRÍTICA)
    // ===============================================
    const themeBtn = document.getElementById('themeToggleBtn');
    const htmlElement = document.documentElement;

    // Função segura para atualizar o ícone
    function updateThemeIcon(theme) {
        // Define qual ícone usar
        const iconName = theme === 'blue-dark' ? 'sun' : 'moon';

        // Reconstrói o HTML do botão para garantir que o Feather encontre o elemento
        themeBtn.innerHTML = `<i data-feather="${iconName}"></i>`;

        // Chama o replace apenas para os novos ícones inseridos
        feather.replace();
    }

    // 1. Carregar Tema Salvo ou Padrão
    const savedTheme = localStorage.getItem('tgl-theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // Se não tiver tema salvo, garante que o ícone inicial esteja correto (Lua)
        updateThemeIcon('light');
    }

    // 2. Evento de Clique no Botão
    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        let newTheme;

        // Lógica de troca
        if (currentTheme === 'blue-dark') {
            newTheme = 'light';
        } else {
            newTheme = 'blue-dark';
        }

        // Aplica e Salva
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('tgl-theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Chama o replace global para o resto do site (ícones do HTML estático)
    feather.replace();


    // ===============================================
    // 1. NAVBAR (Animação GSAP)
    // ===============================================
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const cards = document.querySelectorAll('.nav-card');
    const navLinks = document.querySelectorAll('.nav-card-link');
    const navContent = document.querySelector('.card-nav-content');

    // Verifica se os elementos existem para evitar erros
    if (nav && navToggle && navContent) {
        let isExpanded = false;
        let tl = null;

        const calculateHeight = () => {
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            const topBarHeight = 70;

            let contentHeight;
            if (isMobile) {
                // Cálculo mais seguro para mobile
                contentHeight = navContent.scrollHeight + 40;
            } else {
                contentHeight = 240; // Altura fixa ajustada para desktop
            }
            return topBarHeight + contentHeight;
        };

        const createTimeline = () => {
            if (tl) tl.kill();

            // Define estado inicial
            gsap.set(nav, { height: 70 });
            gsap.set(cards, { y: 20, opacity: 0 });

            // Garante que o conteúdo esteja visível para animação
            gsap.set(navContent, { opacity: 1, pointerEvents: 'all' });

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
                createTimeline(); // Recalcula altura ao abrir (bom para resize)
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
                    // Esconde conteúdo ao fechar para evitar cliques acidentais
                    gsap.set(navContent, { opacity: 0, pointerEvents: 'none' });
                });
            }
        });

        // Fecha o menu ao clicar nos links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isExpanded) {
                    navToggle.classList.remove('open');
                    tl.reverse();
                    tl.eventCallback("onReverseComplete", () => {
                        nav.classList.remove('open');
                        isExpanded = false;
                        gsap.set(navContent, { opacity: 0, pointerEvents: 'none' });
                    });
                }
            });
        });
    } else {
        console.error("Erro: Elementos da Navbar não encontrados no DOM.");
    }

    // ===============================================
    // 2. ACCORDION
    // ===============================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isOpen = header.classList.contains('active');

            // Fecha outros
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.classList.remove('active');
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherHeader.nextElementSibling.style.maxHeight = null;
                    const icon = otherHeader.querySelector('.accordion-icon');
                    if (icon) icon.textContent = '+';
                }
            });

            // Abre/Fecha atual
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
    // (Mantido igual, apenas garantindo verificação de nulos)
    const nextBtn = document.getElementById('rb-btn-next');
    if (nextBtn) {
        let currentStep = 1;
        const totalSteps = 3;
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
    }
});