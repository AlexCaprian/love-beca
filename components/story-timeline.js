class StoryTimeline extends HTMLElement {
  async connectedCallback() {
    try {
      const resp = await fetch('./html/story-timeline.html');
      if (!resp.ok) throw new Error(`Falha ao carregar story-timeline.html (${resp.status})`);

      this.innerHTML = await resp.text();

      const itens = [
        { t: 'A semente', d: 'Foi plantada uma semente pequena, de casca rígida e alongada, com tons que mesclam o branco e o cinza-escuro em faixas delicadas.' },
        { t: 'O protesto da planta', d: 'Logo ela germinou, mas de ponta cabeça, como protesto ao mundo. Com alguma dificuldade, o jardineiro ajeitou a planta e conseguiu fazê-la crescer normalmente.' },
        { t: 'A chegada do cachorrinho', d: 'Ela cresceu em um ambiente com pouco sol, mas felizmente depois de um tempo foi enviado a ela, um cachorrinho que ajudou ela.' },
        { t: 'O sol em dias escuros', d: 'Assim, ela conseguia ver o sol mesmo em dias chuvosos, sob a neblina ou até nas noites frias.' },
        { t: 'O encontro com o bode', d: 'Depois de muito tempo um bode muito bochechudo apareceu, trazendo mais visibilidade ao sol. Ao mesmo tempo que o Girassol fez ele ter sentido de ir atrás dos seus sonhos.' },
        { t: 'A despedida da canina', d: 'Então a cachorrinha percebeu que fez um bom trabalho e poderia descansar, mas o girassol ficou relutante.' },
        { t: 'A partida para o céu', d: 'Então, o bode interveio de forma gentil. Assim, a flor aceitou, e a pequena canina foi vagar no céu como uma estrelinha.' },
        { t: 'Dias de neblina e chuva', d: 'Foram dias de neblina e de chuva, mas o bode permaneceu ao seu lado, não podia deixá-la enxergar o sol.' },
        { t: 'A viagem no jarro', d: 'Então, o bode colocou-a em um jarro e a levou para vários locais, onde conheceu outras flores e animais, fazendo-a também ver o sol de diferentes lugares.' },
        { t: 'O novo lar na colina', d: 'Quando chegaram a uma colina, o bode a deixou no chão e sentou-se ao seu lado, observando juntos o sol, no melhor lugar possível, que seria o seu novo lar.' },
      ];

      const ol = this.querySelector('#timeline');
      if (!ol) return;

      // Cria os <li> com uma classe para esconder além do quarto
      ol.innerHTML = itens.map((item, index) => `
        <li class="relative ${index >= 4 ? 'hidden extra-item' : ''}">
          <span class="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-sunflower-500 shadow-glow border border-white/40"></span>
          <div class="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6">
            <h3 class="font-semibold text-xl">${item.t}</h3>
            <p class="text-white/80 mt-2">${item.d}</p>
          </div>
        </li>
      `).join('');

      // Adiciona botão de expandir/retrair
      const wrapper = document.createElement('div');
      wrapper.className = 'mt-6 text-center';

      const btn = document.createElement('button');
      btn.textContent = 'Ver mais';
      btn.className = 'px-4 py-2 bg-sunflower-500 text-white rounded-lg hover:bg-sunflower-600 transition-all';

      wrapper.appendChild(btn);
      this.querySelector('.max-w-5xl').appendChild(wrapper);

      btn.addEventListener('click', () => {
        const extras = this.querySelectorAll('.extra-item');
        const isHidden = extras[0].classList.contains('hidden');
        extras.forEach(li => li.classList.toggle('hidden', !isHidden));
        btn.textContent = isHidden ? 'Ver menos' : 'Ver mais';
      });

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
