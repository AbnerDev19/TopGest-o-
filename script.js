// script.js

console.log("Script TGL carregado. Projeto iniciado!");

document.addEventListener('DOMContentLoaded', (event) => {
    
    // ===============================================
    // 1. LÓGICA DA NOVA NAVBAR (CARD NAV GSAP)
    // ===============================================
    
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navContent = document.querySelector('.card-nav-content');
    const cards = document.querySelectorAll('.nav-card');
    const navLinks = document.querySelectorAll('.nav-card-link');
    
    let isExpanded = false;
    let tl = null; // Instância da timeline do GSAP

    // Função para calcular a altura dinâmica da navbar
    const calculateHeight = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const topBarHeight = 60;
        const padding = 20;
        
        // Clona o conteúdo para medir a altura real (hack para altura 'auto' no JS)
        const contentClone = navContent.cloneNode(true);
        contentClone.style.visibility = 'hidden';
        contentClone.style.position = 'absolute';
        contentClone.style.height = 'auto';
        contentClone.style.width = nav.offsetWidth + 'px';
        document.body.appendChild(contentClone);
        
        let contentHeight = contentClone.scrollHeight;
        
        // Se for desktop, a altura é fixa (ex: 260px) ou dinâmica.
        // No design original React era fixo desktop e dinâmico mobile.
        // Vamos fazer dinâmico para ambos para garantir que cabe o conteúdo.
        if (!isMobile) {
             // No desktop os cards ficam lado a lado, altura deve ser uns 220px-260px
             contentHeight = 200; 
        }

        document.body.removeChild(contentClone);
        return topBarHeight + contentHeight + padding;
    };

    // Cria a timeline de animação
    const createTimeline = () => {
        // Reseta
        if (tl) tl.kill();
        
        // Define estado inicial
        gsap.set(nav, { height: 60 });
        gsap.set(cards, { y: 50, opacity: 0 });

        tl = gsap.timeline({ paused: true });

        // 1. Anima a altura da Nav
        tl.to(nav, {
            height: calculateHeight(),
            duration: 0.4,
            ease: "power3.out"
        });

        // 2. Anima os cards entrando (stagger = efeito cascata)
        tl.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power3.out",
            stagger: 0.08
        }, "-=0.2"); // Começa um pouco antes da altura terminar
    };

    // Inicializa a timeline
    createTimeline();

    // Toggle Menu (Clique no Hamburguer)
    navToggle.addEventListener('click', () => {
        if (!isExpanded) {
            // ABRIR
            navToggle.classList.add('open');
            nav.classList.add('open');
            createTimeline(); // Recalcula altura caso tela tenha mudado
            tl.play();
            isExpanded = true;
        } else {
            // FECHAR
            navToggle.classList.remove('open');
            tl.reverse();
            tl.eventCallback("onReverseComplete", () => {
                nav.classList.remove('open');
                isExpanded = false;
            });
        }
    });

    // Fechar menu ao clicar em um link
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

    // Recalcular ao redimensionar a tela
    window.addEventListener('resize', () => {
        if (isExpanded) {
            gsap.to(nav, {
                height: calculateHeight(),
                duration: 0.2
            });
        }
    });


    // ===============================================
    // 2. CÓDIGO DO ACCORDION (Existente)
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
    // 3. CÓDIGO DO STEPPER DE COTAÇÃO (Existente)
    // ===============================================
    let currentStep = 1;
    const totalSteps = 3;
    
    const stepperNext = document.getElementById('stepper-next');
    const stepperBack = document.getElementById('stepper-back');
    const steps = document.querySelectorAll('.step');
    const stepLines = document.querySelectorAll('.step-line');
    const panes = document.querySelectorAll('.stepper-pane');
    const inputNome = document.getElementById('stepper-nome');
    const inputServico = document.getElementById('stepper-servico');
    const inputObs = document.getElementById('stepper-obs');
    const summaryNome = document.getElementById('summary-nome');
    const summaryServico = document.getElementById('summary-servico');

    function showStep(stepNumber) {
        panes.forEach(pane => {
            pane.classList.remove('active');
            if (pane.getAttribute('data-pane') == stepNumber) {
                pane.classList.add('active');
            }
        });

        steps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'complete');
            if (stepNum < stepNumber) {
                step.classList.add('complete');
            } else if (stepNum === stepNumber) {
                step.classList.add('active');
            }
        });
        
        stepLines.forEach((line, index) => {
            const stepNum = index + 1;
            line.classList.remove('complete');
            if (stepNum < stepNumber) {
                line.classList.add('complete');
            }
        });

        if (stepNumber === 1) {
            stepperBack.style.display = 'none';
        } else {
            stepperBack.style.display = 'block';
        }

        if (stepNumber === totalSteps) {
            stepperNext.textContent = 'Solicitar via WhatsApp';
            summaryNome.textContent = inputNome.value || 'Não preenchido';
            summaryServico.textContent = inputServico.value || 'Não preenchido';
        } else {
            stepperNext.textContent = 'Avançar';
        }
    }

    stepperNext.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            if (currentStep === 1 && (inputNome.value === '' || inputServico.value === '')) {
                alert('Por favor, preencha o nome e o serviço.');
                return;
            }
            currentStep++;
            showStep(currentStep);
        } else {
            const nome = inputNome.value;
            const servico = inputServico.value;
            const obs = inputObs.value;
            const texto = `Olá! Gostaria de fazer uma cotação.\n\n*Nome:* ${nome}\n*Serviço de Interesse:* ${servico}\n*Observações:* ${obs}`;
            const whatsappLink = `https://wa.me/SEUNUMERO?text=${encodeURIComponent(texto)}`;
            window.open(whatsappLink, '_blank');
        }
    });

    stepperBack.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    showStep(currentStep);
});