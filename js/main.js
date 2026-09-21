/* ==========================================================================
   JBC — Script principal
   Menu mobile acessível + animações de entrada.
   Carregado com `defer` em todas as páginas.
   ========================================================================== */

(function () {
    'use strict';

    /* ----------------------------------------------------------------------
       Menu mobile
       ---------------------------------------------------------------------- */

    function initMobileMenu() {
        var btn = document.querySelector('.mobile-menu-btn');
        var nav = document.querySelector('.nav-links');

        if (!btn || !nav) return;

        if (!nav.id) nav.id = 'main-nav';
        btn.setAttribute('aria-controls', nav.id);
        btn.setAttribute('aria-expanded', 'false');

        var icon = btn.querySelector('i');

        function setOpen(open) {
            nav.classList.toggle('is-open', open);
            btn.setAttribute('aria-expanded', String(open));
            btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
            if (icon) {
                icon.classList.toggle('ph-list', !open);
                icon.classList.toggle('ph-x', open);
            }
        }

        setOpen(false);

        btn.addEventListener('click', function () {
            setOpen(!nav.classList.contains('is-open'));
        });

        nav.addEventListener('click', function (event) {
            if (event.target.closest('a') && window.innerWidth <= 768) setOpen(false);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && nav.classList.contains('is-open')) {
                setOpen(false);
                btn.focus();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768 && nav.classList.contains('is-open')) setOpen(false);
        });
    }

    /* ----------------------------------------------------------------------
       Animações de entrada

       Elementos marcados com [data-reveal] aparecem ao entrar na viewport.
       [data-reveal="now"] anima assim que a página carrega (heros).
       ---------------------------------------------------------------------- */

    function initReveal() {
        var targets = document.querySelectorAll('[data-reveal]');
        if (!targets.length) return;

        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Sem IntersectionObserver ou com movimento reduzido: mostra tudo de uma vez.
        if (!('IntersectionObserver' in window) || reduceMotion) {
            targets.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // anima uma vez só
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

        targets.forEach(function (el) {
            if (el.dataset.reveal === 'now') {
                requestAnimationFrame(function () { el.classList.add('is-visible'); });
            } else {
                observer.observe(el);
            }
        });
    }

    /* ----------------------------------------------------------------------
       Âncoras vindas de outra página (ex.: servicos.html#gestao-fiscal)

       Dois problemas a resolver: o navegador não acerta a posição porque a
       página ainda está montando, e o alvo começa com opacity 0 esperando a
       animação de entrada — ou seja, chegaria invisível.
       ---------------------------------------------------------------------- */

    function initHashTarget() {
        if (!window.location.hash) return;

        var target;
        try {
            target = document.querySelector(window.location.hash);
        } catch (error) {
            return; // hash que não é um seletor válido
        }
        if (!target) return;

        target.classList.add('is-visible');

        // Impede o navegador de restaurar a posição anterior por cima da âncora.
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

        function jump() {
            target.scrollIntoView({ block: 'start', behavior: 'auto' });
        }

        jump();

        // Reposiciona depois que fontes e imagens assentarem o layout — e mais
        // uma vez no quadro seguinte, porque a restauração de scroll do
        // navegador acontece depois do evento load.
        window.addEventListener('load', function () {
            jump();
            requestAnimationFrame(jump);
        });
    }

    initMobileMenu();
    initReveal();
    initHashTarget();
})();
