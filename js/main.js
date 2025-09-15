import '../components/app-audio.js';
import '../components/app-header.js';
import '../components/hero-section.js';
import '../components/story-timeline.js';
import '../components/love-letter.js';
import '../components/gallery-grid.js';
import '../components/app-footer.js';

(function () {
  const BTN_ID   = 'btnBrilhar';
  const LAYER_ID = 'global-stars';

  function generateStars(container, count = 180) {
    // evita duplicar
    if (container.dataset.starsReady === '1') return;

    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      const size = Math.random() < 0.85 ? 2 : 3;
      Object.assign(s.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '9999px',
        background: 'rgba(255,255,255,0.95)',
        boxShadow: '0 0 6px rgba(255,255,255,.4)',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `twinkle ${1.8 + Math.random()*1.5}s ease-in-out ${Math.random()*2}s infinite`
      });
      container.appendChild(s);
    }

    // marca como populado
    container.dataset.starsReady = '1';
  }

  function ensureGlobalStarsLayer() {
    let layer = document.getElementById(LAYER_ID);

    if (!layer) {
      layer = document.createElement('div');
      layer.id = LAYER_ID;
      Object.assign(layer.style, {
        position: 'fixed',
        inset: '0',
        pointerEvents: 'none',
        zIndex: '0',
        opacity: '0',
        transition: 'opacity .4s ease'
      });
      document.body.appendChild(layer);
    }

    // se ainda não tem estrelas, cria agora
    generateStars(layer, 220);
    return layer;
  }

  function toggleStars() {
    const layer = ensureGlobalStarsLayer();
    layer.style.opacity = (layer.style.opacity === '1') ? '0' : '1';

    // compat: dispara o evento global caso algo ainda escute
    window.dispatchEvent(new Event('toggle-stars'));
  }

  // Garante que a camada exista (fica oculta)
  document.addEventListener('DOMContentLoaded', ensureGlobalStarsLayer);

  // Delegação de evento pro botão dentro do <app-header>
  document.addEventListener('click', (e) => {
    const btn = e.target.closest?.(`#${BTN_ID}`);
    if (btn) toggleStars();
  });
})();
