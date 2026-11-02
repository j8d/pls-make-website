// Progressive enhancement only. Without this file the page, nav and font picker still work.
(() => {
  const root = document.documentElement;

  // --- Whooosh menu: native <dialog> gives focus trap, Esc and focus return to the opener.
  const menu = document.getElementById('menu');
  const openBtn = document.querySelector('.menu-btn');
  if (menu && openBtn && typeof menu.showModal === 'function') {
    openBtn.addEventListener('click', () => menu.showModal());
    menu.querySelector('.menu-close').addEventListener('click', () => menu.close());
    // Click on the backdrop area outside the panel content closes too.
    menu.addEventListener('click', (e) => { if (e.target === menu) menu.close(); });
    menu.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        menu.close();
        history.pushState(null, '', a.getAttribute('href'));
        // Move focus to the section so keyboard and screen reader users land where they asked to go.
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: 'start' });
      });
    });
  } else if (openBtn) {
    // Very old browser: fall back to the plain inline nav.
    root.classList.add('no-dialog');
    openBtn.hidden = true;
    document.querySelector('.nav-inline').style.display = 'block';
  }

  // --- Font pair picker: apply site-wide and remember the choice.
  const NAMES = { shipped: 'Shipped', comic: 'Legally distinct', fancy: 'Fancy client', '8bit': '8-bit' };
  const note = document.getElementById('font-note');
  const saved = root.dataset.font && NAMES[root.dataset.font] ? root.dataset.font : 'shipped';
  root.dataset.font = saved;
  const current = document.querySelector(`input[name="font"][value="${saved}"]`);
  if (current) current.checked = true;
  document.querySelectorAll('input[name="font"]').forEach((input) => {
    input.addEventListener('change', () => {
      root.dataset.font = input.value;
      try { localStorage.setItem('pmw-font', input.value); } catch (e) { /* private mode: still applies for this visit */ }
      if (note) note.textContent = `Now using ${NAMES[input.value]}. Saved for next time.`;
    });
  });
})();
