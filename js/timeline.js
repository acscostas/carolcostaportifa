/* ============================================================
   TIMELINE — GSAP ScrollTrigger
   Bonequinha scroll-driven + troca de cor por seção
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

(function () {

  /* ── 1. Nav: scroll behavior ─────────────────────────── */
  const nav = document.getElementById('nav');

  ScrollTrigger.create({
    trigger: '#sobre',
    start: 'top 80px',
    onEnter: () => nav.classList.add('nav--scrolled'),
    onLeaveBack: () => nav.classList.remove('nav--scrolled'),
  });

  /* ── 2. Hero: entrada suave ──────────────────────────── */
  const heroCenter = document.querySelector('.hero__center');
  if (heroCenter) {
    gsap.from(heroCenter, {
      y: 24,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2,
    });
  }

  /* ── 3. Sobre: animação de entrada ──────────────────── */
  const sobreMain = document.querySelector('.sobre__main');
  if (sobreMain) {
    gsap.from(sobreMain, {
      y: 36,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#sobre',
        start: 'top 70%',
      },
    });
  }

  /* ── 4. Timeline: bonequinha ─────────────────────────── */
  const bonequinha = document.getElementById('bonequinha');
  const casesContainer = document.querySelector('.timeline__cases');

  if (!bonequinha || !casesContainer) return;

  // A bonequinha começa no topo dos cases e viaja até o fundo
  gsap.to(bonequinha, {
    y: () => casesContainer.offsetHeight - 80,
    ease: 'none',
    scrollTrigger: {
      trigger: casesContainer,
      start: 'top 50%',
      end: 'bottom 50%',
      scrub: 1.5,
    },
  });

  /* ── 5. Cores: troca abrupta por seção ───────────────── */
  const cases = document.querySelectorAll('.case');
  const workSection = document.getElementById('work');

  // Cores de reset (ao sair da timeline voltando para "sobre")
  const defaultBg = '#F8F5F0';

  ScrollTrigger.create({
    trigger: workSection,
    start: 'top 60%',
    end: 'top top',
    onLeaveBack: () => resetColors(),
  });

  cases.forEach((caseEl, i) => {
    const bg = caseEl.dataset.bg;
    const textColor = caseEl.dataset.text || '#1A1A1A';
    const isDark = isColorDark(bg);
    const expressions = ['open', 'glasses', 'sleepy', 'closed', 'happy'];

    ScrollTrigger.create({
      trigger: caseEl,
      start: 'top 62%',
      onEnter: () => {
        setColors(bg, textColor, isDark);
        setExpression(expressions[i] || 'open');
        caseEl.classList.add('case--active');
      },
      onLeaveBack: () => {
        // Volta para a cor do case anterior ou default
        if (i > 0) {
          const prev = cases[i - 1];
          const prevBg = prev.dataset.bg;
          const prevText = prev.dataset.text || '#1A1A1A';
          setColors(prevBg, prevText, isColorDark(prevBg));
          setExpression(expressions[i - 1] || 'open');
          prev.classList.add('case--active');
        } else {
          resetColors();
          setExpression('open');
        }
        caseEl.classList.remove('case--active');
      },
      onLeave: () => {
        // mantém o active no nó atual
      },
    });
  });

  /* ── 6. Case: entrada do conteúdo ───────────────────── */
  cases.forEach((caseEl) => {
    const body = caseEl.querySelector('.case__body');
    if (!body) return;

    const isLeft = caseEl.classList.contains('case--left');

    gsap.from(body, {
      x: isLeft ? -40 : 40,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: caseEl,
        start: 'top 70%',
      },
    });
  });

  /* ── 7. Contato: animação ────────────────────────────── */
  const contatoHeadline = document.querySelector('.contato__headline');
  if (contatoHeadline) {
    gsap.from(contatoHeadline, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#contato',
        start: 'top 70%',
      },
    });
  }

  // Reseta cores ao entrar na seção contato (que tem bg próprio)
  ScrollTrigger.create({
    trigger: '#contato',
    start: 'top 80%',
    onEnter: () => {
      document.body.removeAttribute('data-bg-dark');
      // Reseta body bg — contato tem bg próprio pelo CSS
      document.body.style.backgroundColor = '';
    },
    onLeaveBack: () => {
      // Volta para a última cor da timeline
      const lastCase = cases[cases.length - 1];
      if (lastCase) {
        const bg = lastCase.dataset.bg;
        const text = lastCase.dataset.text || '#1A1A1A';
        setColors(bg, text, isColorDark(bg));
      }
    },
  });

  /* ── Helpers ─────────────────────────────────────────── */
  function setColors(bg, textColor, dark) {
    document.body.style.backgroundColor = bg;
    document.body.style.color = textColor;
    document.body.setAttribute('data-bg-dark', dark ? 'true' : 'false');
  }

  function resetColors() {
    document.body.style.backgroundColor = defaultBg;
    document.body.style.color = '#1A1A1A';
    document.body.removeAttribute('data-bg-dark');
  }

  function isColorDark(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // Fórmula de luminância percebida
    return (r * 0.299 + g * 0.587 + b * 0.114) < 140;
  }

  function setExpression(state) {
    if (!bonequinha) return;
    const allStates = bonequinha.querySelectorAll('.face-state');
    allStates.forEach((el) => {
      el.style.display = 'none';
    });
    const target = bonequinha.querySelector(`.face-state--${state}`);
    if (target) target.style.display = 'block';
  }

})();
