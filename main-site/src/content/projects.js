const projectFrames = {
  signalGrid: `
    <main class="signal-grid">
      <canvas id="field"></canvas>
      <div class="label">Signal Grid</div>
      <script>
        const canvas = document.getElementById('field');
        const ctx = canvas.getContext('2d');
        function draw(t = 0) {
          canvas.width = innerWidth;
          canvas.height = innerHeight;
          ctx.fillStyle = '#f7f7f2';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          for (let y = 18; y < canvas.height; y += 18) {
            for (let x = 18; x < canvas.width; x += 18) {
              const wave = Math.sin((x + t) * 0.025) + Math.cos((y - t) * 0.03);
              ctx.fillStyle = wave > 0 ? '#050505' : '#d8d8d2';
              ctx.fillRect(x, y, 7 + wave * 2, 7 + wave * 2);
            }
          }
          requestAnimationFrame(draw);
        }
        draw();
      </script>
    </main>
  `,
  orbitLetters: `
    <main class="orbit-letters">
      <div class="word">CODE</div>
      <script>
        const root = document.querySelector('.orbit-letters');
        Array.from('creative').forEach((letter, index) => {
          const span = document.createElement('span');
          span.textContent = letter;
          span.style.setProperty('--i', index);
          root.appendChild(span);
        });
      </script>
    </main>
  `,
  inkClock: `
    <main class="ink-clock">
      <div class="face">
        <div class="hand hour"></div>
        <div class="hand minute"></div>
        <div class="hand second"></div>
      </div>
      <script>
        const hands = document.querySelectorAll('.hand');
        function tick() {
          const d = new Date();
          hands[0].style.rotate = ((d.getHours() % 12) * 30 + d.getMinutes() / 2) + 'deg';
          hands[1].style.rotate = (d.getMinutes() * 6) + 'deg';
          hands[2].style.rotate = (d.getSeconds() * 6) + 'deg';
          requestAnimationFrame(tick);
        }
        tick();
      </script>
    </main>
  `,
  typeTerrain: `
    <main class="type-terrain">
      <div id="terrain"></div>
      <script>
        const terrain = document.getElementById('terrain');
        for (let i = 0; i < 90; i += 1) {
          const cell = document.createElement('b');
          cell.textContent = i % 3 === 0 ? '/' : i % 3 === 1 ? '-' : '\\\\';
          cell.style.setProperty('--d', (i % 15) * 0.06 + 's');
          terrain.appendChild(cell);
        }
      </script>
    </main>
  `,
  cursorPoster: `
    <main class="cursor-poster">
      <div class="poster">MOVE</div>
      <script>
        addEventListener('pointermove', (event) => {
          document.body.style.setProperty('--x', event.clientX / innerWidth - 0.5);
          document.body.style.setProperty('--y', event.clientY / innerHeight - 0.5);
        });
      </script>
    </main>
  `,
};

export const projectCss = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Inter, ui-sans-serif, system-ui, sans-serif; overflow: hidden; }
  main { position: relative; min-height: 100vh; background: #f7f7f2; color: #050505; }
  .label { position: absolute; left: 18px; bottom: 18px; font-size: 13px; text-transform: uppercase; letter-spacing: .08em; }
  .orbit-letters { display: grid; place-items: center; }
  .word { font-size: clamp(46px, 16vw, 110px); font-weight: 900; letter-spacing: .02em; }
  .orbit-letters span { position: absolute; font-size: 18px; font-weight: 800; animation: orbit 5s linear infinite; animation-delay: calc(var(--i) * -.36s); transform-origin: 0 96px; }
  @keyframes orbit { to { rotate: 360deg; } }
  .ink-clock { display: grid; place-items: center; }
  .face { width: min(66vw, 260px); aspect-ratio: 1; border: 3px solid #050505; border-radius: 50%; position: relative; }
  .face::after { content: ''; position: absolute; inset: 50%; width: 12px; height: 12px; translate: -50% -50%; background: #050505; border-radius: 50%; }
  .hand { position: absolute; left: 50%; bottom: 50%; width: 3px; height: 38%; background: #050505; transform-origin: bottom; }
  .minute { height: 43%; width: 2px; }
  .second { height: 45%; width: 1px; background: #e33f2f; }
  .type-terrain { display: grid; place-items: center; }
  #terrain { width: min(82vw, 520px); display: grid; grid-template-columns: repeat(15, 1fr); gap: 4px; font: 800 26px/1 ui-monospace, monospace; }
  #terrain b { animation: rise 1.8s ease-in-out infinite alternate; animation-delay: var(--d); text-align: center; }
  @keyframes rise { to { transform: translateY(-18px); } }
  .cursor-poster { display: grid; place-items: center; perspective: 700px; }
  .poster { font-size: clamp(52px, 18vw, 132px); font-weight: 950; border: 4px solid #050505; padding: .1em .2em; transform: rotateX(calc(var(--y, 0) * -22deg)) rotateY(calc(var(--x, 0) * 28deg)); }
`;

export const projects = [
  {
    slug: "signal-grid",
    title: "Signal Grid",
    date: "2026-06-01",
    summary:
      "Ein animiertes Punktfeld, das aus einfachen Sinuswellen ein grafisches Signal baut.",
    frame: projectFrames.signalGrid,
  },
  {
    slug: "orbit-letters",
    title: "Orbit Letters",
    date: "2026-05-20",
    summary:
      "Typografie als Umlaufbahn: Buchstaben kreisen um ein festes Wortzentrum.",
    frame: projectFrames.orbitLetters,
  },
  {
    slug: "ink-clock",
    title: "Ink Clock",
    date: "2026-05-05",
    summary:
      "Eine minimalistische Uhr mit schwarzen Linien und weicher Bewegung.",
    frame: projectFrames.inkClock,
  },
  {
    slug: "type-terrain",
    title: "Type Terrain",
    date: "2026-04-22",
    summary:
      "Ein Terrain aus Zeichen, das nur mit Text, Verzogerung und Rhythmus arbeitet.",
    frame: projectFrames.typeTerrain,
  },
  {
    slug: "cursor-poster",
    title: "Cursor Poster",
    date: "2026-04-08",
    summary:
      "Ein interaktives Poster, dessen Perspektive auf die Cursorposition reagiert.",
    frame: projectFrames.cursorPoster,
  },
];
