class HeroSection extends HTMLElement {
    async connectedCallback() {
      try {
        // 1) Carrega o HTML da seção
        const resp = await fetch('./html/hero-section.html');
        if (!resp.ok) throw new Error(`Falha ao carregar hero-section.html (${resp.status})`);
        this.innerHTML = await resp.text();
  
        // 2) Define o background em camadas (como no seu original)
        document.documentElement.style.setProperty(
          '--bg',
          "radial-gradient(1000px 500px at 10% -10%, #243a72 0%, #111936 45%, #0a0f1f 100%), radial-gradient(800px 400px at 90% -20%, rgba(255,255,255,.06), transparent 60%), radial-gradient(600px 300px at 10% 120%, rgba(255,255,255,.05), transparent 60%)"
        );
  
        // 3) Gera estrelas dentro do layer #stars (se não houver)
        const starsLayer = this.querySelector('#stars');
        if (starsLayer && starsLayer.children.length === 0) {
          this._generateStars(starsLayer, 100); // ajuste a quantidade se quiser
        }
  
        // 4) Listener do evento global "toggle-stars"
        const sparkle = () => {
          if (!starsLayer) return;
          starsLayer.style.transition = 'opacity .4s ease';
          const current = parseFloat(starsLayer.style.opacity || '0.4');
          starsLayer.style.opacity = current >= 1 ? '0.4' : '1';
        };
  
        window.addEventListener('toggle-stars', sparkle);
        this._cleanup = () => window.removeEventListener('toggle-stars', sparkle);
  
      } catch (e) {
        console.error('Erro no <hero-section>:', e);
        this.innerHTML = `
          <section class="py-10">
            <div class="max-w-6xl mx-auto px-4">
              <p class="text-red-300">Não foi possível carregar a seção capa.</p>
            </div>
          </section>
        `;
      }
    }
  
    disconnectedCallback() {
      this._cleanup?.();
    }
  
    // Cria N estrelas absolutamente posicionadas dentro do layer
    _generateStars(container, count = 80) {
      // Deixe o container como referência de posicionamento
      container.style.position = 'absolute';
      container.style.inset = '0';
  
      for (let i = 0; i < count; i++) {
        const s = document.createElement('span');
        // Tamanhos variados
        const size = Math.random() < 0.85 ? 2 : 3; // 85% com 2px, 15% com 3px
        s.style.position = 'absolute';
        s.style.width = `${size}px`;
        s.style.height = `${size}px`;
        s.style.borderRadius = '9999px';
        s.style.background = 'rgba(255,255,255,0.95)';
        s.style.boxShadow = '0 0 6px rgba(255,255,255,.4)';
  
        // Posição aleatória
        s.style.left = `${Math.random() * 100}%`;
        s.style.top = `${Math.random() * 100}%`;
  
        // Brilho intermitente (twinkle) com delays distintos
        s.style.animation = `twinkle ${1.8 + Math.random()*1.5}s ease-in-out ${Math.random()*2}s infinite`;
        container.appendChild(s);
      }
  
      // Opacidade inicial suave
      container.style.opacity = '0.4';
    }
  }
  
  customElements.define('hero-section', HeroSection);