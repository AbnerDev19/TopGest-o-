document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicializar Ícones
    feather.replace();

    // 2. Menu Mobile
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if(menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 3. Tema Dark/Light
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const moonIcon = document.querySelector('.moon-icon');
    const sunIcon = document.querySelector('.sun-icon');

    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'blue-dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            if(newTheme === 'blue-dark') {
                if(moonIcon) moonIcon.style.display = 'none';
                if(sunIcon) sunIcon.style.display = 'block';
            } else {
                if(moonIcon) moonIcon.style.display = 'block';
                if(sunIcon) sunIcon.style.display = 'none';
            }
        });
    }

    // 4. Stepper Form
    let currentStep = 1;
    const totalSteps = 3;

    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentStepDiv = document.getElementById(`step${currentStep}`);
            const inputs = currentStepDiv.querySelectorAll('input[required], select[required]');
            let isValid = true;
            inputs.forEach(input => {
                if(!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '#cbd5e1';
                }
            });
            if(isValid && currentStep < totalSteps) {
                document.getElementById(`step${currentStep}`).classList.remove('active');
                document.querySelector(`.step-dot[data-step="${currentStep}"]`).classList.remove('active');
                document.querySelector(`.step-dot[data-step="${currentStep}"]`).classList.add('completed');
                currentStep++;
                document.getElementById(`step${currentStep}`).classList.add('active');
                document.querySelector(`.step-dot[data-step="${currentStep}"]`).classList.add('active');
            }
        });
    });

    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            if(currentStep > 1) {
                document.getElementById(`step${currentStep}`).classList.remove('active');
                document.querySelector(`.step-dot[data-step="${currentStep}"]`).classList.remove('active');
                currentStep--;
                document.getElementById(`step${currentStep}`).classList.add('active');
                document.querySelector(`.step-dot[data-step="${currentStep}"]`).classList.add('active');
            }
        });
    });

    document.querySelectorAll('.send-opt').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.send-opt').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            const radio = opt.querySelector('input');
            if(radio) radio.checked = true;
        });
    });

    // 5. Envio do Formulário
    const quoteForm = document.getElementById('quoteForm');
    if(quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const canalEl = document.querySelector('input[name="canal"]:checked');
            const canal = canalEl ? canalEl.value : 'whatsapp';
            const nome = document.getElementById('nome').value;
            const empresa = document.getElementById('empresa').value;
            const servico = document.getElementById('servico').value;
            const msg = document.getElementById('mensagem').value;

            if(canal === 'whatsapp') {
                const phone = "5561999614193"; 
                const text = `*Nova Cotação via Site*%0A%0A*Nome:* ${nome}%0A*Empresa:* ${empresa}%0A*Serviço:* ${servico}%0A*Detalhes:* ${msg}`;
                window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`, '_blank');
            } else {
                const mailto = `mailto:contato@topgestaologistica.com.br?subject=Cotação - ${nome}&body=Nome: ${nome}%0D%0AEmpresa: ${empresa}%0D%0AServiço: ${servico}%0D%0ADetalhes: ${msg}`;
                window.location.href = mailto;
            }
        });
    }

    // 6. Accordion
    const accHeaders = document.querySelectorAll('.accordion-header');
    accHeaders.forEach(h => {
        h.addEventListener('click', () => {
            const item = h.parentElement;
            const content = item.querySelector('.accordion-content');
            document.querySelectorAll('.accordion-item').forEach(i => {
                if(i !== item) {
                    i.classList.remove('active');
                    i.querySelector('.accordion-content').style.maxHeight = null;
                }
            });
            item.classList.toggle('active');
            if(item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // ===============================================
    // 7. ANIMAÇÕES (GSAP)
    // ===============================================
    
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // --- A. Scroll Reveal ---
        const revealElements = document.querySelectorAll('.reveal-up');
        revealElements.forEach(el => {
            gsap.fromTo(el, 
                { y: 50, opacity: 0, visibility: 'hidden' },
                {
                    y: 0, opacity: 1, visibility: 'visible',
                    duration: 0.8, 
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });

        gsap.fromTo('.reveal-right', 
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.reveal-right', start: "top 80%" } }
        );

        gsap.fromTo('.reveal-left', 
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.reveal-left', start: "top 80%" } }
        );

        // --- B. Animação de Contagem (Números) ---
        const stats = document.querySelectorAll('.count-up');
        stats.forEach(stat => {
            let target = parseInt(stat.getAttribute('data-target'));
            let proxy = { val: 0 };
            
            gsap.to(proxy, {
                val: target,
                duration: 2.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: stat,
                    start: "top 90%",
                    toggleActions: "play none none none"
                },
                onUpdate: function() {
                    stat.textContent = Math.ceil(proxy.val);
                }
            });
        });

        // --- C. TYPEWRITER PERFEITO E ROBUSTO ---
        const typewriterEl = document.getElementById('typewriter-headline');
        
        if (typewriterEl) {
            typewriterEl.innerHTML = ""; // Limpa o conteúdo inicial
            typewriterEl.classList.add('cursor-blink'); // Adiciona cursor

            const textPart1 = "Excelência em ";
            const textPart2 = "Gestão e Serviços";
            const speed = 60; // Velocidade de digitação
            
            let i = 0;

            // Função para digitar a primeira linha
            function typeLine1() {
                if (i < textPart1.length) {
                    typewriterEl.innerHTML += textPart1.charAt(i);
                    i++;
                    setTimeout(typeLine1, speed);
                } else {
                    // Adiciona a quebra de linha
                    typewriterEl.innerHTML += "<br>";
                    // Cria o span para a parte colorida
                    const span = document.createElement('span');
                    span.className = "highlight";
                    typewriterEl.appendChild(span);
                    
                    // Inicia a digitação da segunda linha dentro do span
                    let j = 0;
                    function typeLine2() {
                        if (j < textPart2.length) {
                            span.innerHTML += textPart2.charAt(j);
                            j++;
                            setTimeout(typeLine2, speed);
                        } else {
                            // Opcional: Remover o cursor no fim
                            // typewriterEl.classList.remove('cursor-blink');
                        }
                    }
                    setTimeout(typeLine2, speed);
                }
            }

            // Inicia o processo
            setTimeout(typeLine1, 500);
        }

    } else {
        console.warn("GSAP não carregado corretamente.");
    }
});