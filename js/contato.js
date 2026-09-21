/* ==========================================================================
   JBC — Página de contato
   Copiar e-mail para a área de transferência, com aviso acessível.
   ========================================================================== */

(function () {
    'use strict';

    var btn = document.querySelector('[data-copy]');
    if (!btn) return;

    var label = btn.querySelector('[data-copy-label]') || btn;
    var status = document.getElementById('copy-status');
    var original = label.textContent;
    var timer;

    function feedback(message, success) {
        label.textContent = message;
        btn.classList.toggle('is-copied', success);
        if (status) status.textContent = message;

        clearTimeout(timer);
        timer = setTimeout(function () {
            label.textContent = original;
            btn.classList.remove('is-copied');
            if (status) status.textContent = '';
        }, 2500);
    }

    // Reserva para quando a Clipboard API não está disponível ou é bloqueada
    // (navegador antigo, contexto sem HTTPS, permissão negada).
    function copyFallback(value) {
        var field = document.createElement('textarea');
        field.value = value;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();

        var ok = false;
        try {
            ok = document.execCommand('copy');
        } catch (error) {
            ok = false;
        }

        document.body.removeChild(field);
        return ok;
    }

    function done(success, value) {
        if (success) {
            feedback('E-mail copiado', true);
        } else {
            // Último recurso: mostra o endereço para a pessoa copiar na mão.
            feedback(value, false);
        }
    }

    btn.addEventListener('click', function () {
        var value = btn.dataset.copy;

        if (!navigator.clipboard) {
            done(copyFallback(value), value);
            return;
        }

        navigator.clipboard.writeText(value).then(
            function () { done(true, value); },
            function () { done(copyFallback(value), value); }
        );
    });
})();
