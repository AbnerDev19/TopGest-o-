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
    // 3. CÓDIGO DO STEPPER DE COTAÇÃO
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
            // Usando o número do Alessandro Rodrigues como principal no WhatsApp
            const texto = `Olá! Gostaria de fazer uma cotação.\n\n*Nome:* ${nome}\n*Serviço de Interesse:* ${servico}\n*Observações:* ${obs}`;
            const whatsappLink = `https://wa.me/5561999370708?text=${encodeURIComponent(texto)}`;
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