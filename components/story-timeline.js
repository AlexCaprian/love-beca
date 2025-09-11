class StoryTimeline extends HTMLElement {
  async connectedCallback() {
    try {
      // Carrega o HTML base
      const resp = await fetch('./html/story-timeline.html'); // caminho relativo ao index.html
      if (!resp.ok) throw new Error(`Falha ao carregar story-timeline.html (${resp.status})`);

      this.innerHTML = await resp.text();

      // Seus dados dinâmicos (pode vir de um JSON externo também)
      const itens = [
        { t: 'Quando tudo começou', d: 'Um olhar, um sorriso, e o universo ganhou novas cores.' },
        { t: 'Primeira aventura',   d: 'Mãos dadas, passinhos sincronizados, e planos que viraram constelações.' },
        { t: 'Nosso planeta favorito', d: 'Um cantinho só nosso, com girassóis e poesia.' },
        { t: 'Nosso planeta favorito', d: 'Um cantinho só nosso, com girassóis e poesia.' },
        { t: 'Nosso planeta favorito', d: 'Um cantinho só nosso, com girassóis e poesia.' },
        { t: 'Nosso planeta favorito', d: 'Um cantinho só nosso, com girassóis e poesia.' },
      ];

      // Seleciona o <ol> e injeta os <li>
      const ol = this.querySelector('#timeline');
      if (!ol) return;

      ol.innerHTML = itens.map(item => `
        <li class="relative">
          <span class="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-sunflower-500 shadow-glow border border-white/40"></span>
          <div class="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
            <h3 class="font-semibold text-xl">${item.t}</h3>
            <p class="text-white/80 mt-2">${item.d}</p>
          </div>
        </li>
      `).join('');

    } catch (err) {
      console.error('Erro ao inicializar <story-timeline>:', err);
      this.innerHTML = `
        <section class="py-10">
          <div class="max-w-5xl mx-auto px-4">
            <p class="text-red-300">Não foi possível carregar a linha do tempo.</p>
          </div>
        </section>
      `;
    }
  }
}

customElements.define('story-timeline', StoryTimeline);