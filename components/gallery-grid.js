class GalleryGrid extends HTMLElement {
  async connectedCallback() {
    try {
      const response = await fetch('./html/gallery-grid.html');
      if (!response.ok) throw new Error(`Falha ao carregar gallery-grid.html (${response.status})`);

      this.innerHTML = await response.text();

      const cards = this.querySelector('#cards');
      const shuffleBtns = [this.querySelector('#shuffle'), this.querySelector('#shuffle_m')].filter(Boolean);
      const starBtns   = [this.querySelector('#starsToggle'), this.querySelector('#starsToggle_m')].filter(Boolean);

      // Gera estrelas locais para a galeria
      const starsLayer = this.querySelector('#starsGallery');
      if (starsLayer && starsLayer.children.length === 0) {
        this._generateStars(starsLayer, 80); // ajuste a quantidade
      }

      // Embaralhar cards
      const shuffle = () => {
        if (!cards) return;
        const arr = Array.from(cards.children);
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          cards.appendChild(arr[j]);
          arr.splice(j, 1);
        }
      };
      shuffleBtns.forEach(b => b.addEventListener('click', shuffle));

      // Alterna estrelas LOCais + dispara evento global (para sincronizar com o hero, se quiser)
      const toggleLocalAndGlobalStars = () => {
        if (starsLayer) {
          starsLayer.style.transition = 'opacity .4s ease';
          const current = parseFloat(starsLayer.style.opacity || '0');
          starsLayer.style.opacity = current >= 1 ? '0' : '1';
        }
        // Mantém o comportamento global (hero-section também pisca)
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
        </section>
      `;
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
      s.style.top  = `${Math.random() * 100}%`;
      s.style.animation = `twinkle ${1.8 + Math.random()*1.5}s ease-in-out ${Math.random()*2}s infinite`;
      container.appendChild(s);
    }
    // Opacidade inicial
    container.style.opacity = '0';
  }
}

customElements.define('gallery-grid', GalleryGrid);