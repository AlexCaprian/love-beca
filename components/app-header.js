class AppHeader extends HTMLElement {
  async connectedCallback() {
    try {
      console.log('[header] connectedCallback');

      const res = await fetch('./html/app-header.html');
      console.log('[header] fetch status:', res.status);
      if (!res.ok) throw new Error(`Falha ao carregar app-header.html (${res.status})`);
      this.innerHTML = await res.text();
      console.log('[header] template injetado');

      // refs
      const btnMenu   = this.querySelector('#btnMenu');
      const panel     = this.querySelector('#mobileMenu');
      const iconMenu  = this.querySelector('#iconMenu');
      const iconClose = this.querySelector('#iconClose');
      const btnBrilhar = this.querySelector('#btnBrilhar');
      const btnBrilharM = this.querySelector('#btnBrilhar_m');

      console.log('[header] refs:', {
        btnMenu: !!btnMenu, panel: !!panel, iconMenu: !!iconMenu, iconClose: !!iconClose,
        btnBrilhar: !!btnBrilhar, btnBrilharM: !!btnBrilharM
      });

      // Ação “brilhar”
      const dispatchSparkle = () =>
        window.dispatchEvent(new CustomEvent('toggle-stars', { detail: { mode: 'sparkle' } }));
      btnBrilhar?.addEventListener('click', () => {
        console.log('[header] click btnBrilhar');
        dispatchSparkle();
      });
      btnBrilharM?.addEventListener('click', () => {
        console.log('[header] click btnBrilhar_m');
        dispatchSparkle();
        this._closeMenu?.();
      });

      // helpers
      const logState = (where) => {
        console.log(`[header] ${where}:`, {
          panelHidden: panel?.classList.contains('hidden'),
          panelClasses: panel?.className,
          btnAria: btnMenu?.getAttribute('aria-expanded'),
          iconMenuHidden: iconMenu?.classList.contains('hidden'),
          iconCloseHidden: iconClose?.classList.contains('hidden'),
          width: window.innerWidth
        });
      };

      const onClickOutside = (e) => {
        if (!this.contains(e.target)) {
          console.log('[header] click-fora -> fechar');
          closeMenu();
        }
      };
      const onEsc = (e) => {
        if (e.key === 'Escape') {
          console.log('[header] ESC -> fechar');
          closeMenu();
        }
      };

      const openMenu = () => {
        if (!panel) return console.warn('[header] openMenu: panel nulo');
        logState('antes open');
        panel.classList.remove('hidden');
        btnMenu?.setAttribute('aria-expanded', 'true');
        iconMenu?.classList.add('hidden');
        iconClose?.classList.remove('hidden');
        document.addEventListener('click', onClickOutside, { capture: true });
        document.addEventListener('keydown', onEsc, { capture: true });
        logState('depois open');
      };

      const closeMenu = () => {
        if (!panel) return console.warn('[header] closeMenu: panel nulo');
        logState('antes close');
        panel.classList.add('hidden');
        btnMenu?.setAttribute('aria-expanded', 'false');
        iconMenu?.classList.remove('hidden');
        iconClose?.classList.add('hidden');
        document.removeEventListener('click', onClickOutside, { capture: true });
        document.removeEventListener('keydown', onEsc, { capture: true });
        logState('depois close');
      };
      this._closeMenu = closeMenu;

      // estado inicial
      logState('inicial');

      // toggle
      btnMenu?.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('[header] click btnMenu');
        const hidden = panel?.classList.contains('hidden');
        console.log('[header] panel hidden?', hidden);
        hidden ? openMenu() : closeMenu();
      });

      // fechar ao clicar link
      panel?.querySelectorAll('a[role="menuitem"]').forEach(a => {
        a.addEventListener('click', () => {
          console.log('[header] click link mobile -> fechar');
          closeMenu();
        });
      });

      // matchMedia 750px
      const mq = window.matchMedia('(min-width: 750px)');
      console.log('[header] mq initial match (>=750)?', mq.matches);
      const syncMenu = (ev) => {
        console.log('[header] mq change (>=750)?', ev.matches, '-> fechar menu');
        closeMenu();
      };
      // alguns browsers antigos não têm addEventListener em MediaQueryList
      if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', syncMenu);
      } else {
        mq.addListener(syncMenu);
      }

      // logs de resize para conferir breakpoint
      window.addEventListener('resize', () => {
        console.log('[header] resize -> width:', window.innerWidth, '>=750?', window.innerWidth >= 750);
      });

    } catch (e) {
      console.error('Erro no <app-header>:', e);
      this.innerHTML = `<div class="p-4 text-red-300">Não foi possível carregar o header.</div>`;
    }
  }
}
customElements.define('app-header', AppHeader);