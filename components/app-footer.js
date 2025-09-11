class AppFooter extends HTMLElement {
  async connectedCallback() {
    try {
      const response = await fetch('./html/app-footer.html'); // caminho relativo ao index.html
      if (!response.ok) {
        throw new Error(`Falha ao carregar app-footer.html (${response.status})`);
      }

      const html = await response.text();
      this.innerHTML = html; // <- use innerHTML (H e ML maiúsculos)

      // Se precisar adicionar algum comportamento JS ao footer, faça aqui:
      // ex: this.querySelector('#meuBotao')?.addEventListener('click', ...)

    } catch (err) {
      console.error('Erro ao inicializar <app-footer>:', err);
      // Fallback simples opcional
      this.innerHTML = `
        <footer class="py-8">
          <div class="max-w-6xl mx-auto px-4 text-center">
            <p class="text-white/60">Não foi possível carregar o rodapé.</p>
          </div>
        </footer>
      `;
    }
  }
}

customElements.define('app-footer', AppFooter);