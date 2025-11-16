// script.js

console.log("Script TGL carregado. Projeto iniciado!");

// Aguarda o conteúdo da página carregar antes de rodar o script
document.addEventListener('DOMContentLoaded', (event) => {
    
    // --- NOVO CÓDIGO DO ACCORDION ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling; // O .accordion-content
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            // Fecha todos os outros que estiverem abertos (opcional, mas bom)
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
                header.querySelector('.accordion-icon').textContent = '−'; // Muda para 'menos'
            } else {
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = '0px';
                header.querySelector('.accordion-icon').textContent = '+';
            }
        });
    });

});