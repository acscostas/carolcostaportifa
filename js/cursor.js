/* ============================================================
   CURSOR CUSTOMIZADO — Olho com cílios
   O dot é a pupila (segue rápido), o eye é o contorno (segue com lag)
   ============================================================ */

(function () {
  const cursorDot = document.querySelector('.cursor');
  const cursorEye = document.querySelector('.cursor__eye');

  if (!cursorDot || !cursorEye) return;

  // Detecta se é touch device — esconde cursor customizado
  if (window.matchMedia('(hover: none)').matches) {
    cursorDot.style.display = 'none';
    cursorEye.style.display = 'none';
    document.body.style.cursor = 'auto';
    return;
  }

  let mouseX = 0;
  let mouseY = 0;

  // Move o ponto (pupila) exatamente com o mouse (rápido)
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    gsap.to(cursorDot, {
      x: mouseX,
      y: mouseY,
      duration: 0.06,
      ease: 'none',
    });

    // Olho segue com leve delay (efeito suave)
    gsap.to(cursorEye, {
      x: mouseX,
      y: mouseY,
      duration: 0.5,
      ease: 'power2.out',
    });
  });

  // Hover em elementos interativos
  const interactiveSelectors = 'a, button, .case__cta, h1, h2, h3, .nav__link, .art__card';

  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('cursor--hover');
      cursorEye.classList.add('cursor--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('cursor--hover');
      cursorEye.classList.remove('cursor--hover');
    });
  });

  // Sai da janela
  document.addEventListener('mouseleave', () => {
    gsap.to([cursorDot, cursorEye], { opacity: 0, duration: 0.2 });
  });
  document.addEventListener('mouseenter', () => {
    gsap.to([cursorDot, cursorEye], { opacity: 1, duration: 0.2 });
  });

  // Click: pequena animação de pulso no olho
  document.addEventListener('mousedown', () => {
    gsap.to(cursorEye, { scale: 0.8, duration: 0.12 });
  });
  document.addEventListener('mouseup', () => {
    gsap.to(cursorEye, { scale: 1, duration: 0.2, ease: 'back.out(2)' });
  });
})();
