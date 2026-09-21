/* ==========================================================================
   JBC — Acordeão acessível
   Usado no FAQ e na página de Links úteis.

   Antes, os gatilhos eram <div> com onclick: não recebiam foco, não abriam
   pelo teclado e não comunicavam estado a leitores de tela. Agora são
   <button> com aria-expanded/aria-controls.

   A altura é animada em pixels porque a alternativa em CSS puro
   (grid-template-rows: 0fr -> 1fr) não anima de forma confiável.
   ========================================================================== */

(function () {
    'use strict';

    var roots = document.querySelectorAll('[data-accordion]');
    if (!roots.length) return;

    function panelOf(trigger) {
        return document.getElementById(trigger.getAttribute('aria-controls'));
    }

    function open(trigger) {
        var panel = panelOf(trigger);
        trigger.setAttribute('aria-expanded', 'true');
        trigger.closest('[data-accordion-item]').classList.add('is-open');
        panel.style.height = panel.scrollHeight + 'px';
    }

    function close(trigger) {
        var panel = panelOf(trigger);
        trigger.setAttribute('aria-expanded', 'false');
        trigger.closest('[data-accordion-item]').classList.remove('is-open');
        // Fixa a altura atual antes de zerar, senão não há o que animar.
        panel.style.height = panel.scrollHeight + 'px';
        panel.offsetHeight;
        panel.style.height = '0px';
    }

    var allTriggers = [];

    roots.forEach(function (root) {
        // Um painel aberto por vez, a menos que data-accordion="multiple"
        var single = root.dataset.accordion !== 'multiple';
        var triggers = Array.prototype.slice.call(
            root.querySelectorAll('[data-accordion-trigger]')
        );
        allTriggers = allTriggers.concat(triggers);

        triggers.forEach(function (trigger) {
            panelOf(trigger).style.height = '0px';

            trigger.addEventListener('click', function () {
                var wasOpen = trigger.getAttribute('aria-expanded') === 'true';

                if (single) {
                    triggers.forEach(function (other) {
                        if (other.getAttribute('aria-expanded') === 'true') close(other);
                    });
                }

                if (wasOpen) {
                    close(trigger);
                } else {
                    open(trigger);
                }
            });
        });
    });

    // O texto reflui ao mudar a largura: recalcula a altura dos painéis abertos.
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            allTriggers.forEach(function (trigger) {
                if (trigger.getAttribute('aria-expanded') !== 'true') return;
                var panel = panelOf(trigger);
                panel.style.height = 'auto';
                var h = panel.scrollHeight;
                panel.style.height = h + 'px';
            });
        }, 150);
    });
})();
