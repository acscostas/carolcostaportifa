/* ============================================================
   CURSOR CUSTOMIZADO
   ============================================================ */

(function () {
  const cursorDot = document.querySelector('.cursor');
  const cursorRing = document.querySelector('.cursor__follower');

  if (!cursorDot || !cursorRing) return;

  // Detecta se é touch device — esconde cursor customizado
  if (window.matchMedia('(hover: none)').matches) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mouseX = 0;
  let mouseY = 0;

  // Move o ponto exatamente com o mouse (rápido)
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    gsap.to(cursorDot, {
      x: mouseX,
      y: mouseY,
      duration: 0.06,
      ease: 'none',
    });

    // Anel segue com leve delay (efeito elástico suave)
    gsap.to(cursorRing, {
      x: mouseX,
      y: mouseY,
      duration: 0.45,
      ease: 'power2.out',
    });
  });

  // Hover em elementos interativos
  const interactiveSelectors = 'a, button, .case__cta, h1, h2, h3, .nav__link';

  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('cursor--hover');
      cursorRing.classList.add('cursor--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('cursor--hover');
      cursorRing.classList.remove('cursor--hover');
    });
  });

  // Sai da janela
  document.addEventListener('mouseleave', () => {
    gsap.to([cursorDot, cursorRing], { opacity: 0, duration: 0.2 });
  });
  document.addEventListener('mouseenter', () => {
    gsap.to([cursorDot, cursorRing], { opacity: 1, duration: 0.2 });
  });

  // Click: pequena animação de pulso
  document.addEventListener('mousedown', () => {
    gsap.to(cursorRing, { scale: 0.7, duration: 0.12 });
  });
  document.addEventListener('mouseup', () => {
    gsap.to(cursorRing, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
  });
})();
