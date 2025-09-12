// components/app-audio.js

// 🔸 Template inline (sem fetch)
const AUDIO_TEMPLATE = `
<div class="audio-player fixed left-1/2 bottom-6 -translate-x-1/2 z-40
            max-w-[680px] w-[92%] sm:w-[560px]
            backdrop-blur-md bg-sunflower-500/20 border border-sunflower-200/30
            rounded-2xl shadow-glow px-4 py-3 select-none">
  <div class="flex items-center gap-3">
    <!-- Play / Pause -->
    <button id="playPause" aria-label="Play/Pause"
            class="shrink-0 w-10 h-10 rounded-full bg-sunflower-500 text-space-900
                   grid place-items-center hover:bg-sunflower-400 transition">
      <svg id="iconPlay" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
           class="w-5 h-5" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      <svg id="iconPause" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
           class="w-5 h-5 hidden" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
    </button>

    <!-- Título e barra -->
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm text-white/90">Pequeno Príncipe</p>
      <div class="mt-1 flex items-center gap-2">
        <span id="currentTime" class="text-xs tabular-nums text-white/70 w-10 text-right">0:00</span>
        <input id="seek" type="range" min="0" max="100" value="0"
               class="seek appearance-none w-full h-2 rounded-full bg-white/20"
               aria-label="Progresso" />
        <span id="duration" class="text-xs tabular-nums text-white/70 w-10">0:00</span>
      </div>
    </div>

    <!-- Volume -->
    <div class="hidden sm:flex items-center gap-2 w-28">
      <button id="muteBtn" aria-label="Mute"
              class="text-sunflower-200/90 hover:text-white transition">
        <svg id="iconVol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
             class="w-5 h-5" fill="currentColor">
          <path d="M5 10v4h4l5 5V5L9 10H5z"/>
        </svg>
        <svg id="iconMute" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
             class="w-5 h-5 hidden" fill="currentColor">
          <path d="M16.5 12l3.5 3.5-1.5 1.5L15 13.5 11.5 17l-1.5-1.5L13.5 12 10 8.5 11.5 7 15 10.5 18.5 7l1.5 1.5L16.5 12zM5 10v4h4l5 5V5L9 10H5z"/>
        </svg>
      </button>
      <input id="vol" type="range" min="0" max="1" step="0.01" value="0.8"
             class="vol appearance-none w-full h-2 rounded-full bg-white/20" aria-label="Volume"/>
    </div>
  </div>

  <!-- Áudio real -->
  <audio id="audio"
         src="assets/audio/pequeno_principe.mp3"
         preload="auto" playsinline></audio>
</div>
`.trim();

class AppAudio extends HTMLElement {
  async connectedCallback() {
    try {
      if (this._initialized) return;
      this._initialized = true;

      this.innerHTML = AUDIO_TEMPLATE;

      await this._waitFor(() => this.querySelector('#audio'));
      await this._waitForWindowLoad();

      const audio     = this.querySelector('#audio');
      const playPause = this.querySelector('#playPause');
      const iconPlay  = this.querySelector('#iconPlay');
      const iconPause = this.querySelector('#iconPause');
      const seek      = this.querySelector('#seek');
      const current   = this.querySelector('#currentTime');
      const duration  = this.querySelector('#duration');
      const vol       = this.querySelector('#vol');
      const muteBtn   = this.querySelector('#muteBtn');
      const iconVol   = this.querySelector('#iconVol');
      const iconMute  = this.querySelector('#iconMute');

      if (!audio || !playPause || !seek || !current || !duration) return;

      const fmt = s => {
        if (!isFinite(s)) return '0:00';
        const m = Math.floor(s / 60), r = Math.floor(s % 60);
        return `${m}:${r.toString().padStart(2,'0')}`;
      };
      const setIcons = playing => {
        iconPlay?.classList.toggle('hidden', playing);
        iconPause?.classList.toggle('hidden', !playing);
      };
      const setMuteIcon = muted => {
        iconVol?.classList.toggle('hidden', muted);
        iconMute?.classList.toggle('hidden', !muted);
      };

      const updateDuration = () => {
        if (audio.duration) duration.textContent = fmt(audio.duration);
      };
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('durationchange', updateDuration);

      audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
          seek.value = (audio.currentTime / audio.duration) * 100;
          current.textContent = fmt(audio.currentTime);
        }
      });

      seek.addEventListener('input', () => {
        if (!audio.duration) return;
        audio.currentTime = (seek.value / 100) * audio.duration;
      });

      playPause.addEventListener('click', async () => {
        if (audio.paused) { try { await audio.play(); setIcons(true); } catch {} }
        else { audio.pause(); setIcons(false); }
      });

      if (vol) {
        vol.addEventListener('input', () => {
          audio.volume = parseFloat(vol.value);
          audio.muted = audio.volume === 0;
          setMuteIcon(audio.muted);
        });
        audio.volume = parseFloat(vol.value);
      }
      if (muteBtn) {
        muteBtn.addEventListener('click', () => {
          audio.muted = !audio.muted;
          setMuteIcon(audio.muted);
        });
      }

      const tryAutoplay = async () => {
        // Não tenta tocar sozinho; espera gesto
        const start = async () => {
          const targetVol = vol ? parseFloat(vol.value) : 0.8;
          audio.muted = false;
          audio.volume = 0;
      
          try {
            await audio.play();
            // fade-in suave
            const endVol = targetVol, steps = 12, stepMs = 80;
            let i = 0;
            const iv = setInterval(() => {
              i++; audio.volume = endVol * (i/steps);
              if (i >= steps) clearInterval(iv);
            }, stepMs);
            setIcons(true);
          } catch {/* se falhar, ignore */}
        };
      
        window.addEventListener('pointerdown', start, { once: true });
        window.addEventListener('keydown', start, { once: true });
      };
      await tryAutoplay();

      audio.addEventListener('pause', () => setIcons(false));
      audio.addEventListener('play',  () => setIcons(true));
      audio.addEventListener('ended', () => { setIcons(false); audio.currentTime = 0; });

    } catch (e) {
      this.innerHTML = `
        <div class="py-8">
          <div class="max-w-6xl mx-auto px-4 text-center">
            <p class="text-white/60">Não foi possível carregar o player.</p>
          </div>
        </div>`;
    }
  }

  _waitFor(checkFn, timeout = 2000, interval = 50) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      (function tick(){
        try {
          if (checkFn()) return resolve(true);
          if (Date.now() - start > timeout) return reject(new Error('Timeout: elementos não carregaram a tempo.'));
          setTimeout(tick, interval);
        } catch (e) { reject(e); }
      })();
    });
  }

  _waitForWindowLoad() {
    return new Promise(resolve => {
      if (document.readyState === 'complete') return resolve();
      window.addEventListener('load', resolve, { once: true });
    });
  }
}

customElements.define('app-audio', AppAudio);