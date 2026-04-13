(() => {
  'use strict';

  /* ── Dados dos artigos ───────────────────────────────────── */
  const ARTIGOS = [
    {
      word: 'DESIGNER',
      title: 'A inteligência artificial não substitui o designer. Ela revela quem ele realmente é.',
      teaser: 'Existe uma ansiedade crescente sobre o que a IA vai substituir. A pergunta útil é outra: o que ela revela sobre a qualidade de quem a usa?',
      href: '/artigos/designer.html',
    },
    {
      word: 'DESCOBERTA',
      title: 'DescoBERTA: como um chatbot me ajudou a encontrar uma carreira',
      teaser: 'A história de como um projeto mudou completamente meus planos pro futuro e me fez descobrir um universo no qual nunca tinha pensado em trabalhar.',
      href: '/artigos/descoberta.html',
    },
    {
      word: 'PIXEL',
      title: 'O design começa antes do primeiro pixel.',
      teaser: 'O que acontece quando uma disciplina precisa ser inventada antes de ser praticada — e o que isso ensina sobre o que liderança de design realmente significa.',
      href: '/artigos/pixel.html',
    },
    {
      word: 'OLHAR',
      title: 'Cross-Functional Designer: uma abordagem antropológica das relações corporativas',
      teaser: 'Escolhi falar sobre relações e sobre como podemos construí-las a partir do olhar — dentro e fora do mundo corporativo.',
      href: '/artigos/relacoes.html',
    },
  ];

  const GRID_SIZE = 18;
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Apenas horizontal e vertical — sem diagonal
  const DIRECTIONS = [
    { dr: 0, dc: 1, dir: 'h' },  // → direita
    { dr: 1, dc: 0, dir: 'v' },  // ↓ baixo
  ];

  /* ── Construção do grid ──────────────────────────────────── */
  function buildGrid() {
    const grid    = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
    const wordMap = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
    const dirMap  = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
    const edgeMap = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

    for (const artigo of ARTIGOS) {
      placeWord(grid, wordMap, dirMap, edgeMap, artigo.word);
    }

    // Preencher células vazias com letras aleatórias
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === null) {
          grid[r][c] = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        }
      }
    }

    return { grid, wordMap, dirMap, edgeMap };
  }

  function placeWord(grid, wordMap, dirMap, edgeMap, word) {
    const maxAttempts = 300;
    // Embaralhar direções para variação
    const dirs = [...DIRECTIONS].sort(() => Math.random() - 0.5);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const { dr, dc, dir } = dirs[attempt % dirs.length];
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);

      if (canPlace(grid, wordMap, word, row, col, dr, dc)) {
        for (let i = 0; i < word.length; i++) {
          const r = row + dr * i;
          const c = col + dc * i;
          grid[r][c]    = word[i];
          wordMap[r][c] = word;
          dirMap[r][c]  = dir;
          edgeMap[r][c] = i === 0 ? 'start' : i === word.length - 1 ? 'end' : 'mid';
        }
        return true;
      }
    }
    return false;
  }

  function canPlace(grid, wordMap, word, row, col, dr, dc) {
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
      if (grid[r][c] !== null && grid[r][c] !== word[i]) return false;
      // Evitar que duas palavras diferentes compartilhem células
      if (wordMap[r][c] !== null && wordMap[r][c] !== word) return false;
    }
    return true;
  }

  /* ── Renderização ────────────────────────────────────────── */
  function render({ grid, wordMap, dirMap, edgeMap }) {
    const container = document.getElementById('artigosGrid');
    if (!container) return;

    const fragment = document.createDocumentFragment();

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const span = document.createElement('span');
        span.className = 'artigos__letter';
        span.textContent = grid[r][c];

        // Rotação leve aleatória — efeito caótico
        const rot = (Math.random() * 10 - 5).toFixed(1);
        span.style.transform = `rotate(${rot}deg)`;

        if (wordMap[r][c]) {
          span.dataset.word    = wordMap[r][c];
          span.dataset.wordDir = dirMap[r][c];
          span.dataset.wordEdge = edgeMap[r][c];
        }

        fragment.appendChild(span);
      }
    }

    container.appendChild(fragment);
    bindEvents(container);
  }

  /* ── Estado de interação ─────────────────────────────────── */
  let hoveredWord = null;
  let activeWord  = null;

  function setWordState(container, word, state) {
    if (!word) return;
    container.querySelectorAll(`[data-word="${word}"]`).forEach((el) => {
      el.classList.remove('artigos__letter--word-hover', 'artigos__letter--word-active');
      if (state === 'hover')  el.classList.add('artigos__letter--word-hover');
      if (state === 'active') el.classList.add('artigos__letter--word-active');
    });
  }

  /* ── Eventos ─────────────────────────────────────────────── */
  function bindEvents(container) {
    container.addEventListener('mouseover', (e) => {
      const letter = e.target.closest('.artigos__letter[data-word]');
      const word = letter?.dataset.word ?? null;

      if (word === hoveredWord) return;

      // Remove hover da palavra anterior (se não for a ativa)
      if (hoveredWord && hoveredWord !== activeWord) {
        setWordState(container, hoveredWord, 'none');
      }

      hoveredWord = word;

      if (word && word !== activeWord) {
        setWordState(container, word, 'hover');
      }
    });

    container.addEventListener('mouseleave', () => {
      if (hoveredWord && hoveredWord !== activeWord) {
        setWordState(container, hoveredWord, 'none');
      }
      hoveredWord = null;
    });

    container.addEventListener('click', (e) => {
      const letter = e.target.closest('.artigos__letter[data-word]');
      if (!letter) return;

      const word = letter.dataset.word;
      if (word === activeWord) return;

      // Remove estado ativo da palavra anterior
      if (activeWord) setWordState(container, activeWord, 'none');

      activeWord = word;
      setWordState(container, word, 'active');
      showPreview(word);
    });
  }

  /* ── Preview panel ───────────────────────────────────────── */
  function showPreview(word) {
    const artigo = ARTIGOS.find((a) => a.word === word);
    if (!artigo) return;

    const empty   = document.getElementById('artigosEmpty');
    const card    = document.getElementById('artigosCard');
    const preview = document.getElementById('artigosPreview');

    document.getElementById('artigosCardKeyword').textContent = artigo.word;
    document.getElementById('artigosCardTitle').textContent   = artigo.title;
    document.getElementById('artigosCardTeaser').textContent  = artigo.teaser;
    document.getElementById('artigosCardCta').href            = artigo.href;

    empty.hidden = true;
    card.hidden  = false;

    // Mobile: deslizar painel
    preview.classList.add('artigos__preview--open');
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    const data = buildGrid();
    render(data);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
