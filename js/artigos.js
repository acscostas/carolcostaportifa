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
  const DIRECTIONS = [
    [0, 1],   // →
    [0, -1],  // ←
    [1, 0],   // ↓
    [-1, 0],  // ↑
    [1, 1],   // ↘
    [-1, -1], // ↖
    [1, -1],  // ↙
    [-1, 1],  // ↗
  ];

  /* ── Construção do grid ──────────────────────────────────── */
  function buildGrid() {
    // Criar grid vazio
    const grid = Array.from({ length: GRID_SIZE }, () =>
      Array(GRID_SIZE).fill(null)
    );
    // wordMap: grid de strings para rastrear qual palavra ocupa cada célula
    const wordMap = Array.from({ length: GRID_SIZE }, () =>
      Array(GRID_SIZE).fill(null)
    );

    // Tentar inserir cada palavra
    for (const artigo of ARTIGOS) {
      placeWord(grid, wordMap, artigo.word);
    }

    // Preencher células vazias com letras aleatórias
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === null) {
          grid[r][c] = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        }
      }
    }

    return { grid, wordMap };
  }

  function placeWord(grid, wordMap, word) {
    const maxAttempts = 200;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const [dr, dc] = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);

      if (canPlace(grid, wordMap, word, row, col, dr, dc)) {
        for (let i = 0; i < word.length; i++) {
          grid[row + dr * i][col + dc * i] = word[i];
          wordMap[row + dr * i][col + dc * i] = word;
        }
        return true;
      }
    }
    return false; // não conseguiu encaixar (raro)
  }

  function canPlace(grid, wordMap, word, row, col, dr, dc) {
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
      if (grid[r][c] !== null && grid[r][c] !== word[i]) return false;
    }
    return true;
  }

  /* ── Renderização ────────────────────────────────────────── */
  function render(grid, wordMap) {
    const container = document.getElementById('artigosGrid');
    if (!container) return;

    const fragment = document.createDocumentFragment();

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const span = document.createElement('span');
        span.className = 'artigos__letter';
        span.textContent = grid[r][c];

        // Rotação leve aleatória para efeito caótico
        const rot = (Math.random() * 12 - 6).toFixed(1);
        span.style.transform = `rotate(${rot}deg)`;

        if (wordMap[r][c]) {
          span.dataset.word = wordMap[r][c];
        }

        fragment.appendChild(span);
      }
    }

    container.appendChild(fragment);
    bindEvents(container);
  }

  /* ── Interação ───────────────────────────────────────────── */
  let activeWord = null;

  function bindEvents(container) {
    container.addEventListener('mouseover', (e) => {
      const letter = e.target.closest('.artigos__letter[data-word]');
      if (!letter) return;
      highlightWord(container, letter.dataset.word, true);
    });

    container.addEventListener('mouseout', (e) => {
      const letter = e.target.closest('.artigos__letter[data-word]');
      if (!letter || letter.dataset.word === activeWord) return;
      highlightWord(container, letter.dataset.word, false);
    });

    container.addEventListener('click', (e) => {
      const letter = e.target.closest('.artigos__letter[data-word]');
      if (!letter) return;
      const word = letter.dataset.word;

      // Manter highlight permanente na palavra ativa
      if (activeWord && activeWord !== word) {
        highlightWord(container, activeWord, false);
      }
      activeWord = word;
      highlightWord(container, word, true);

      showPreview(word);
    });
  }

  function highlightWord(container, word, on) {
    container.querySelectorAll(`[data-word="${word}"]`).forEach((el) => {
      el.classList.toggle('artigos__letter--highlight', on);
    });
  }

  function showPreview(word) {
    const artigo = ARTIGOS.find((a) => a.word === word);
    if (!artigo) return;

    const empty = document.getElementById('artigosEmpty');
    const card  = document.getElementById('artigosCard');
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
    const { grid, wordMap } = buildGrid();
    render(grid, wordMap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
