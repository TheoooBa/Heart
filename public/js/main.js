/* ── Opal heart animation with palettes ── */
let setHeroPalette = null;

function initOpalHeart() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const size = canvas.offsetWidth || 480;

  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const palettes = {
    or: [
      'rgba(147, 112, 219, 0.8)',
      'rgba(212, 175, 55, 0.8)',
      'rgba(255, 182, 193, 0.6)',
      'rgba(255, 255, 255, 0.5)',
      'rgba(196, 168, 130, 0.7)',
      'rgba(240, 200, 120, 0.6)'
    ],
    peche: [
      'rgba(212, 160, 144, 0.8)',
      'rgba(255, 180, 150, 0.7)',
      'rgba(240, 128, 128, 0.6)',
      'rgba(255, 255, 255, 0.5)',
      'rgba(147, 112, 219, 0.5)',
      'rgba(255, 200, 170, 0.7)'
    ],
    turquoise: [
      'rgba(64, 180, 200, 0.8)',
      'rgba(100, 149, 237, 0.7)',
      'rgba(72, 209, 204, 0.6)',
      'rgba(255, 255, 255, 0.5)',
      'rgba(147, 112, 219, 0.6)',
      'rgba(100, 200, 220, 0.7)'
    ],
    bordeaux: [
      'rgba(123, 30, 46, 0.9)',
      'rgba(180, 50, 80, 0.8)',
      'rgba(147, 112, 219, 0.6)',
      'rgba(255, 255, 255, 0.4)',
      'rgba(200, 80, 100, 0.7)',
      'rgba(100, 20, 40, 0.8)'
    ],
    noir: [
      'rgba(40, 40, 60, 0.8)',
      'rgba(80, 80, 120, 0.7)',
      'rgba(147, 112, 219, 0.5)',
      'rgba(150, 150, 200, 0.4)',
      'rgba(60, 60, 100, 0.6)',
      'rgba(100, 100, 150, 0.5)'
    ]
  };

  const blobs = palettes.or.map(function (color) {
    const speed = 0.3 + Math.random() * 0.5;
    const angle = Math.random() * Math.PI * 2;
    return {
      x: size * 0.15 + Math.random() * size * 0.7,
      y: size * 0.15 + Math.random() * size * 0.7,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: size * (0.38 + Math.random() * 0.15),
      color: color,
      fromColor: color,
      toColor: color,
      opacity: 0.5 + Math.random() * 0.5,
      opacityDir: Math.random() < 0.5 ? 1 : -1,
      opacitySpeed: 0.003 + Math.random() * 0.004
    };
  });

  let transitionStart = null;
  const TRANSITION_DURATION = 800;

  function parseRgba(str) {
    const m = str.match(/[\d.]+/g);
    return [+m[0], +m[1], +m[2], +m[3]];
  }

  function lerpColor(from, to, t) {
    const f = parseRgba(from);
    const g = parseRgba(to);
    return 'rgba(' +
      Math.round(f[0] + (g[0] - f[0]) * t) + ', ' +
      Math.round(f[1] + (g[1] - f[1]) * t) + ', ' +
      Math.round(f[2] + (g[2] - f[2]) * t) + ', ' +
      (f[3] + (g[3] - f[3]) * t).toFixed(2) + ')';
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  setHeroPalette = function (paletteName) {
    const target = palettes[paletteName];
    if (!target) return;
    blobs.forEach(function (blob, i) {
      blob.fromColor = blob.color;
      blob.toColor = target[i];
    });
    transitionStart = performance.now();
  };

  function animate(timestamp) {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#0c0709';
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = 'screen';

    if (transitionStart !== null) {
      const elapsed = timestamp - transitionStart;
      const t = easeInOut(Math.min(elapsed / TRANSITION_DURATION, 1));
      blobs.forEach(function (blob) {
        blob.color = lerpColor(blob.fromColor, blob.toColor, t);
      });
      if (elapsed >= TRANSITION_DURATION) {
        blobs.forEach(function (blob) { blob.fromColor = blob.toColor; });
        transitionStart = null;
      }
    }

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

  requestAnimationFrame(animate);
}

/* ── Bijou opal animation avec palettes ── */
let setBijouPalette = null;

function initBijouHeart() {
  const canvas = document.getElementById('bijou-canvas');
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const size = canvas.offsetWidth || 250;
  canvas.width = Math.round(size * dpr);
  canvas.height = Math.round(size * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const palettes = {
    or: [
      'rgba(212, 175, 55, 0.9)',
      'rgba(196, 168, 130, 0.8)',
      'rgba(255, 223, 100, 0.7)',
      'rgba(255, 255, 255, 0.5)',
      'rgba(180, 140, 60, 0.8)',
      'rgba(240, 200, 120, 0.6)'
    ],
    peche: [
      'rgba(212, 160, 144, 0.9)',
      'rgba(255, 180, 150, 0.8)',
      'rgba(240, 128, 128, 0.7)',
      'rgba(255, 255, 255, 0.5)',
      'rgba(255, 200, 170, 0.8)',
      'rgba(220, 140, 120, 0.6)'
    ],
    turquoise: [
      'rgba(64, 180, 200, 0.9)',
      'rgba(100, 149, 237, 0.8)',
      'rgba(72, 209, 204, 0.7)',
      'rgba(255, 255, 255, 0.5)',
      'rgba(0, 180, 180, 0.8)',
      'rgba(100, 200, 220, 0.6)'
    ],
    bordeaux: [
      'rgba(123, 30, 46, 0.9)',
      'rgba(180, 50, 80, 0.8)',
      'rgba(147, 112, 219, 0.7)',
      'rgba(255, 255, 255, 0.4)',
      'rgba(200, 80, 100, 0.8)',
      'rgba(100, 20, 40, 0.9)'
    ],
    noir: [
      'rgba(40, 40, 60, 0.9)',
      'rgba(80, 80, 120, 0.8)',
      'rgba(60, 60, 100, 0.7)',
      'rgba(150, 150, 200, 0.4)',
      'rgba(20, 20, 40, 0.9)',
      'rgba(100, 100, 150, 0.6)'
    ]
  };

  const blobs = palettes.or.map(function (color) {
    const speed = 0.3 + Math.random() * 0.5;
    const angle = Math.random() * Math.PI * 2;
    return {
      x: size * 0.15 + Math.random() * size * 0.7,
      y: size * 0.15 + Math.random() * size * 0.7,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: size * (0.38 + Math.random() * 0.15),
      color: color,
      fromColor: color,
      toColor: color,
      opacity: 0.5 + Math.random() * 0.5,
      opacityDir: Math.random() < 0.5 ? 1 : -1,
      opacitySpeed: 0.003 + Math.random() * 0.004
    };
  });

  let transitionStart = null;
  const TRANSITION_DURATION = 800;

  function parseRgba(str) {
    const m = str.match(/[\d.]+/g);
    return [+m[0], +m[1], +m[2], +m[3]];
  }

  function lerpColor(from, to, t) {
    const f = parseRgba(from);
    const g = parseRgba(to);
    return 'rgba(' +
      Math.round(f[0] + (g[0] - f[0]) * t) + ', ' +
      Math.round(f[1] + (g[1] - f[1]) * t) + ', ' +
      Math.round(f[2] + (g[2] - f[2]) * t) + ', ' +
      (f[3] + (g[3] - f[3]) * t).toFixed(2) + ')';
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  setBijouPalette = function (paletteName) {
    const target = palettes[paletteName];
    if (!target) return;
    blobs.forEach(function (blob, i) {
      blob.fromColor = blob.color;
      blob.toColor = target[i];
    });
    transitionStart = performance.now();
  };

  function animate(timestamp) {
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#0c0709';
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = 'screen';

    if (transitionStart !== null) {
      const elapsed = timestamp - transitionStart;
      const t = easeInOut(Math.min(elapsed / TRANSITION_DURATION, 1));
      blobs.forEach(function (blob) {
        blob.color = lerpColor(blob.fromColor, blob.toColor, t);
      });
      if (elapsed >= TRANSITION_DURATION) {
        blobs.forEach(function (blob) { blob.fromColor = blob.toColor; });
        transitionStart = null;
      }
    }

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

  requestAnimationFrame(animate);
}

/* ── Sélecteur de couleur hero ── */
function initHeroColorPicker() {
  const items = document.querySelectorAll('.hero__color-item');
  if (!items.length) return;

  items.forEach(function (item) {
    item.addEventListener('click', function () {
      items.forEach(function (i) { i.classList.remove('active'); });
      item.classList.add('active');
      if (setHeroPalette) setHeroPalette(item.dataset.palette);
    });
  });
}

/* ── Sélecteur de couleur bijou ── */
function initColorPicker() {
  const swatches = document.querySelectorAll('.swatch');
  const nameEl = document.querySelector('.couleur-active-name');

  if (!swatches.length) return;

  swatches.forEach(function (swatch) {
    swatch.addEventListener('click', function () {
      swatches.forEach(function (s) { s.classList.remove('active'); });
      swatch.classList.add('active');
      const name = swatch.dataset.name;
      const palette = swatch.dataset.palette;
      if (nameEl) nameEl.innerHTML = '<em>' + name + '</em>';
      if (setBijouPalette) setBijouPalette(palette);
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
initBijouHeart();
initHeroColorPicker();
initColorPicker();
initScrollReveal();
