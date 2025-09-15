class GalleryGrid extends HTMLElement {
  async connectedCallback() {
    try {
      const response = await fetch('./html/gallery-grid.html');
      if (!response.ok) throw new Error(`Falha ao carregar gallery-grid.html (${response.status})`);
      this.innerHTML = await response.text();

      const cardsRow = this.querySelector('#cardsRow');

      const items = (window.galleryData ?? [
        { title: "Beca Neném", text: "Muito fofinha", img: "assets/img/27.jpg" },
        { title: "Beca aluninha", text: "Muito fofinha em seu uniforme.", img: "assets/img/25.jpg" },
        { title: "Beca Patriota", text: "Provavelmente estava escondida no 8 de Janeiro.", img: "assets/img/28.jpg" },
        { title: "Primeiro beijo", text: "Nosso primeiro beijo, seu sim para nós.", img: "assets/img/01.jpg" },
        { title: "Primeiro encontro", text: "Nosso primeiro encontro, um dia divertido e jeito de sensações.", img: "assets/img/02.jpg" },
        { title: "Primeira comemoração", text: "Nossa primeira comemoração, um momento especial demias, inesquecível.", img: "assets/img/04.jpg" },
        { title: "Jardim das flores", text: "Nosso cantinho especial, com a flor mais linda no meio da foto.", img: "assets/img/03.jpg" },
        { title: "Outra família", text: "Uma família que também te acolhe e ajuda, está aqui para fazer se sentir amada.", img: "assets/img/12.jpg" },
        { title: "Nosso natal", text: "Um de vários que teremos juntos.", img: "assets/img/14.jpg" },
        { title: "Praia", text: "Um dia iremos aproveitar a praia com a nossa própria família.", img: "assets/img/16.jpg" },
        { title: "Carlos Acutis", text: "Essa foto envelheceu como vinho.", img: "assets/img/20.jpg" },
        { title: "Treinando ser pais", text: "Vamos tirar uma foto assim com nosso filho. rs", img: "assets/img/24.jpg" },
        { title: "Beca dentusa", text: "Uma beca rara, aparece as vezes quando se come sushi", img: "assets/img/13.jpg" },
        { title: "Beca Feminista", text: "Essa só existe na fantasia.", img: "assets/img/18.jpg" },
        { title: "Beca Sensual", text: "Tem um sex appeal essa foto que não sei explicar.", img: "assets/img/11.jpg" },
        { title: "Beca desconfiada", text: "Acho muito bom sua cara nessa foto. rs", img: "assets/img/07.jpg" },
        { title: "Beca dorminhoca", text: "Acho muito lindo você dormindo. Não vejo a hora de poder acordar todos os dias vendo essa cena.", img: "assets/img/08.jpg" },
        { title: "Beca Bronzeada", text: "Surge depois da Beca aquática.", img: "assets/img/17.jpg" },
        { title: "Beca florida", text: "Ainda vou comprar um vestido desses para você.", img: "assets/img/21.jpg" },
        { title: "Juntos", text: "Vamos construir nossa família.", img: "assets/img/30.jpg" },


      ]);

      if (cardsRow) {
        cardsRow.innerHTML = items.map(({ title, text, img }) => {
          const hasImg = Boolean(img && String(img).trim());
          const fallback = `
            <div class="absolute inset-0 bg-gradient-to-br from-sunflower-500/30 to-space-700/50"></div>
          `;
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
}
customElements.define('gallery-grid', GalleryGrid);
