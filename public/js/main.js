/* ── Opal heart animation ── */
function initOpalHeart() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const size = canvas.offsetWidth || 380;

  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const COLORS = [
    'rgba(147, 112, 219, 0.8)',
    'rgba(100, 149, 237, 0.8)',
    'rgba(255, 182, 193, 0.7)',
    'rgba(255, 255, 255, 0.5)',
    'rgba(196, 168, 130, 0.6)',
    'rgba(123, 143, 168, 0.7)'
  ];

  const blobs = COLORS.map(function (color) {
    const speed = 0.3 + Math.random() * 0.5;
    const angle = Math.random() * Math.PI * 2;
    return {
      x: size * 0.15 + Math.random() * size * 0.7,
      y: size * 0.15 + Math.random() * size * 0.7,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: size * (0.38 + Math.random() * 0.15),
      color: color,
      opacity: 0.5 + Math.random() * 0.5,
      opacityDir: Math.random() < 0.5 ? 1 : -1,
      opacitySpeed: 0.003 + Math.random() * 0.004
    };
  });

  function animate() {
    ctx.clearRect(0, 0, size, size);

    ctx.fillStyle = '#0c0709';
    ctx.fillRect(0, 0, size, size);

    ctx.globalCompositeOperation = 'screen';

    blobs.forEach(function (blob) {
      blob.x += blob.vx;
      blob.y += blob.vy;
      if (blob.x < 0) { blob.x = 0; blob.vx *= -1; }
      if (blob.x > size) { blob.x = size; blob.vx *= -1; }
      if (blob.y < 0) { blob.y = 0; blob.vy *= -1; }
      if (blob.y > size) { blob.y = size; blob.vy *= -1; }

      blob.opacity += blob.opacityDir * blob.opacitySpeed;
      if (blob.opacity >= 1.0) { blob.opacity = 1.0; blob.opacityDir = -1; }
      if (blob.opacity <= 0.5) { blob.opacity = 0.5; blob.opacityDir = 1; }

      const g = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
      g.addColorStop(0, blob.color);
      g.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.globalAlpha = blob.opacity;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    requestAnimationFrame(animate);
  }

  animate();
}

/* ── Sélecteur de couleur ── */
function initColorPicker() {
  const swatches = document.querySelectorAll('.swatch');
  const heartPath = document.getElementById('bijou-heart-path');
  const nameEl = document.querySelector('.couleur-active-name');

  if (!swatches.length || !heartPath) return;

  swatches.forEach(function (swatch) {
    swatch.addEventListener('click', function () {
      swatches.forEach(function (s) { s.classList.remove('active'); });
      swatch.classList.add('active');
      const color = swatch.dataset.color;
      const name = swatch.dataset.name;
      heartPath.setAttribute('fill', color);
      heartPath.setAttribute('stroke', color);
      if (nameEl) nameEl.innerHTML = '<em>' + name + '</em>';
    });
  });
}

/* ── Scroll reveal ── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(function (el) { observer.observe(el); });
}

/* ── FAQ accordéon ── */
document.querySelectorAll('.faq__question').forEach(function (btn) {
  btn.addEventListener('click', function () {
    btn.closest('.faq__item').classList.toggle('open');
  });
});

/* ── Formulaire d'inscription ── */
const form = document.getElementById('subscribe-form');
const submitBtn = document.getElementById('submit-btn');
const messageEl = document.getElementById('form-message');
const DEFAULT_BTN_TEXT = 'Je veux être prévenue au lancement';

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const prenom = document.getElementById('prenom').value.trim();

  if (!email) {
    showMessage("Merci d'entrer ton adresse email.", false);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Envoi…';
  showMessage('');

  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, prenom }),
    });

    const data = await res.json();

    if (res.ok) {
      form.reset();
      const nom = prenom || null;
      showMessage(nom ? 'Merci ' + nom + '. On te tient au courant.' : 'Merci. On te tient au courant.', true);
      submitBtn.textContent = DEFAULT_BTN_TEXT;
    } else {
      showMessage(data.error || 'Une erreur est survenue.', false);
      resetButton();
    }
  } catch (err) {
    showMessage('Connexion impossible. Réessaie dans un instant.', false);
    resetButton();
  }
});

function showMessage(text, isSuccess) {
  messageEl.textContent = text;
  messageEl.className = 'form__message' + (isSuccess ? ' form__message--success' : '');
}

function resetButton() {
  submitBtn.disabled = false;
  submitBtn.textContent = DEFAULT_BTN_TEXT;
}

/* ── Init ── */
initOpalHeart();
initColorPicker();
initScrollReveal();
