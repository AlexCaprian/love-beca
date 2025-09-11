class AppHeader extends HTMLElement {
    async connectedCallback() {
      try {
        const response = await fetch('./html/app-header.html');
        if (!response.ok) throw new Error(`Falha ao carregar app-header.html (${response.status})`);
        this.innerHTML = await response.text();
  
        this.querySelector('#btnBrilhar')?.addEventListener('click', () => {
          // Nome certinho: "toggle-stars"
          window.dispatchEvent(new CustomEvent('toggle-stars', { detail: { mode: 'sparkle' } }));
        });
      } catch (e) {
        console.error('Erro no <app-header>:', e);
        this.innerHTML = `<div class="p-4 text-red-300">Não foi possível carregar o header.</div>`;
      }
    }
  }
  customElements.define('app-header', AppHeader);