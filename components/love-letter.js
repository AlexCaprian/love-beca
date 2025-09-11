class LoveLetter extends HTMLElement {
  async connectedCallback() {
    try {
      const response = await fetch('./html/love-letter.html'); // caminho relativo ao index.html
      if (!response.ok) throw new Error(`Falha ao carregar love-letter.html (${response.status})`);

      this.innerHTML = await response.text();

      const flap = this.querySelector('#flap');
      const letter = this.querySelector('#letter');
      const btn = this.querySelector('#envelopeBtn');
      const copy = this.querySelector('#copiarFrase');

      // Anima a aba do envelope e mostra/oculta a carta
      btn?.addEventListener('click', () => {
        const opened = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!opened));

        // garante uma perspective visual bacana na rotação
        flap.style.transformOrigin = 'top center';
        flap.style.transform = opened ? '' : 'rotateX(-160deg)';

        letter?.classList.toggle('hidden');
      });

      // Copia a frase para a área de transferência
      copy?.addEventListener('click', async () => {
        const frase = '“Tu te tornas eternamente responsável por aquilo que cativas.”';
        try {
          await navigator.clipboard.writeText(frase);
          const old = copy.textContent;
          copy.textContent = 'Copiado!';
          setTimeout(() => (copy.textContent = old || 'Copiar frase'), 1200);
        } catch {
          // fallback simples
          alert(frase);
        }
      });

    } catch (err) {
      console.error('Erro ao inicializar <love-letter>:', err);
      this.innerHTML = `
        <section class="py-10">
          <div class="max-w-6xl mx-auto px-4">
            <p class="text-red-300">Não foi possível carregar a cartinha.</p>
          </div>
        </section>
      `;
    }
  }
}

customElements.define('love-letter', LoveLetter);