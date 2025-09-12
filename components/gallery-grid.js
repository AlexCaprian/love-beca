class GalleryGrid extends HTMLElement {
  async connectedCallback() {
    try {
      const response = await fetch('./html/gallery-grid.html');
      if (!response.ok) throw new Error(`Falha ao carregar gallery-grid.html (${response.status})`);
      this.innerHTML = await response.text();

      const cardsRow = this.querySelector('#cardsRow');
      const starBtns = [this.querySelector('#starsToggle'), this.querySelector('#starsToggle_m')].filter(Boolean);
      const starsLayer = this.querySelector('#starsGallery');
      if (starsLayer && starsLayer.children.length === 0) this._generateStars(starsLayer, 80);

      // ➜ Dados da galeria (title, text, img)
      // Pode trocar por fetch de JSON se quiser.
      const items = (window.galleryData ?? [
        { title: "Nosso pôr do sol", text: "Onde os girassóis parecem olhar para nós.", img: "" },
        { title: "Primeiro passeio", text: "Passinhos que viraram constelações no coração.", img: "" },
        { title: "Planeta de girassóis", text: "Nosso cantinho favorito no universo.", img: "" },
        { title: "Sorrisos", text: "O céu abriu quando você sorriu.", img: "" },
        { title: "Abraços", text: "Um abraço seu vale um universo.", img: "" },
        { title: "Caminhos", text: "Do seu lado, tudo floresce.", img: "" },
      ]);

      // Renderiza os cards
      // Renderiza os cards (com fallback de cor quando não houver img ou se falhar)
      if (cardsRow) {
        cardsRow.innerHTML = items.map(({ title, text, img }) => {
          const hasImg = Boolean(img && String(img).trim());
          // Fallback: fundo colorido/gradiente
          const fallback = `
      <div class="absolute inset-0 bg-gradient-to-br from-sunflower-500/30 to-space-700/50"></div>
    `;
          // Imagem (se houver) + overlay; onerror esconde a <img> e mantém o fallback
          const picture = hasImg ? `
      <img src="${img}" alt="${title}" loading="lazy"
           class="card-img absolute inset-0 w-full h-full object-cover"
           onerror="this.style.display='none';"
      />
    ` : '';

          return `
      <article class="snap-start shrink-0 w-[260px] sm:w-[300px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:bg-white/7 transition">
        <div class="aspect-[4/3] relative">
          ${fallback}
          ${picture}
          <div class="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
        </div>
        <div class="p-5">
          <h3 class="font-semibold text-lg">${title}</h3>
          <p class="text-white/75 mt-1">${text}</p>
        </div>
      </article>
    `;
        }).join('');
      }

      // Toggle estrelas locais + evento global
      const toggleLocalAndGlobalStars = () => {
        if (starsLayer) {
          starsLayer.style.transition = 'opacity .4s ease';
          const current = parseFloat(starsLayer.style.opacity || '0');
          starsLayer.style.opacity = current >= 1 ? '0' : '1';
        }
        window.dispatchEvent(new CustomEvent('toggle-stars', { detail: { from: 'gallery' } }));
      };
      starBtns.forEach(b => b.addEventListener('click', toggleLocalAndGlobalStars));

    } catch (err) {
      console.error('Erro ao inicializar <gallery-grid>:', err);
      this.innerHTML = `
        <section class="py-10">
          <div class="max-w-6xl mx-auto px-4">
            <p class="text-red-300">Não foi possível carregar a galeria.</p>
          </div>
        </section>`;
    }
  }

  _generateStars(container, count = 80) {
    container.style.position = 'absolute';
    container.style.inset = '0';
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      const size = Math.random() < 0.85 ? 2 : 3;
      s.style.position = 'absolute';
      s.style.width = `${size}px`;
      s.style.height = `${size}px`;
      s.style.borderRadius = '9999px';
      s.style.background = 'rgba(255,255,255,0.95)';
      s.style.boxShadow = '0 0 6px rgba(255,255,255,.4)';
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 100}%`;
      s.style.animation = `twinkle ${1.8 + Math.random() * 1.5}s ease-in-out ${Math.random() * 2}s infinite`;
      container.appendChild(s);
    }
    container.style.opacity = '0';
  }
}
customElements.define('gallery-grid', GalleryGrid);