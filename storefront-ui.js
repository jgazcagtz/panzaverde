/* Presentation-only enhancements. Product, checkout, auth and API logic live in script.js. */
(() => {
    // These are the existing catalog photos, saved from Imgur's official 640px
    // versions so browser hotlink failures cannot replace them with placeholders.
    // Source URLs and file checksums are recorded in assets/products/sources.json.
    const originalProductPhotoIds = new Set([
        '0SK8MuI', '5kbXrDR', '6mljk5L', '6uZUzF8', '7zoiYN8', 'CAtOzlA',
        'CtURNmF', 'CuhnSD3', 'EBqMxqr', 'FxIyawD', 'Gh1ozVF', 'gRCANyj',
        'HN5cFUm', 'iXCpNDz', 'jehZ5Bu', 'jhlGdSc', 'jLK6q3R', 'jrJlWHl',
        'kWyjWlf', 'LznPjo4', 'N49fDtW', 'ODAIYHh', 'pLKUISA', 'PQNiYFI',
        'QlbwTrr', 'rk9xzMb', 'sLaUnO7', 'Sp53Fq9', 'TqhrfIN', 'WDPDcq1',
        'wpgUaGP', 'YDjR9QQ', 'Yk8a3AC', 'Yo5R1in'
    ]);
    function prepareImage(img) {
        if (img.dataset.uiPrepared || img.closest('.hero-art, .header-content, .footer-logo')) return;
        img.dataset.uiPrepared = 'true';
        img.decoding = 'async';
        const photo = img.src.match(/^https:\/\/i\.imgur\.com\/([a-zA-Z0-9]+)\.(?:png|jpe?g)(?:\?.*)?$/);
        if (photo && originalProductPhotoIds.has(photo[1])) {
            img.dataset.originalSrc = img.getAttribute('src');
            if (img.getBoundingClientRect().top >= window.innerHeight) img.loading = 'lazy';
            img.src = new URL(`assets/products/${photo[1]}.jpg`, document.baseURI).href;
        }
    }
    function prepareImages(root) {
        if (root instanceof HTMLImageElement) prepareImage(root);
        root.querySelectorAll?.('img').forEach(prepareImage);
    }
    prepareImages(document);
    new MutationObserver(records => {
        for (const record of records) {
            record.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) prepareImages(node);
            });
        }
    }).observe(document.body, { childList: true, subtree: true });

    // Keep keyboard navigation inside an open overlay and return it to its trigger.
    const overlays = [
        { element: document.getElementById('cart'), open: el => el.classList.contains('active'), close: () => window.toggleCart() },
        { element: document.getElementById('product-modal'), open: el => el.style.display === 'block', close: () => window.closeProductModal() },
        { element: document.getElementById('edit-modal'), open: el => el.style.display === 'block', close: () => window.toggleModal() }
    ].filter(item => item.element);
    const activeOverlays = [];
    const focusable = el => [...el.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]')]
        .filter(control => !control.disabled && control.getClientRects().length);
    for (const overlay of overlays) {
        const el = overlay.element;
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'true');
        el.tabIndex = -1;
        if (el.id === 'cart') el.setAttribute('aria-label', 'Carrito');
        const sync = () => {
            const open = overlay.open(el);
            el.inert = !open;
            el.setAttribute('aria-hidden', String(!open));
            if (open && !activeOverlays.includes(overlay)) {
                overlay.returnFocus = document.activeElement;
                activeOverlays.push(overlay);
                (focusable(el)[0] || el).focus({ preventScroll: true });
            } else if (!open && activeOverlays.includes(overlay)) {
                activeOverlays.splice(activeOverlays.indexOf(overlay), 1);
                if (activeOverlays.length) document.body.style.overflow = 'hidden';
                if (overlay.returnFocus?.isConnected) overlay.returnFocus.focus({ preventScroll: true });
            }
        };
        sync();
        new MutationObserver(sync).observe(el, { attributes: true, attributeFilter: ['class', 'style'] });
    }
    document.addEventListener('keydown', event => {
        const overlay = activeOverlays.at(-1);
        if (!overlay) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            overlay.close();
        } else if (event.key === 'Tab') {
            const controls = focusable(overlay.element);
            const first = controls[0] || overlay.element;
            const last = controls.at(-1) || overlay.element;
            if (!overlay.element.contains(document.activeElement) || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
            }
        }
    });
    const categoryToggle = document.querySelector('.category-toggle');
    const categoryMenu = document.querySelector('.category-menu');
    if (categoryToggle && categoryMenu) {
        categoryToggle.setAttribute('aria-expanded', 'false');
        new MutationObserver(() => categoryToggle.setAttribute('aria-expanded', String(categoryMenu.classList.contains('open'))))
            .observe(categoryMenu, { attributes: true, attributeFilter: ['class'] });
    }
})();
