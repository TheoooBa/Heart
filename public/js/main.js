/* ── Sparkles ── */
function initSparkles() {
  const group = document.getElementById('sparkles');
  if (!group) return;

  const colors = ['#C4A882', '#E8C4C8', '#7B8FA8', '#D4A090', '#F5EFE8', '#7B1E2E'];

  for (let i = 0; i < 80; i++) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const cx = (5 + Math.random() * 90).toFixed(1);
    const cy = (8 + Math.random() * 68).toFixed(1);
    const r = (1.5 + Math.random() * 2.5).toFixed(1);
    const color = colors[Math.floor(Math.random() * colors.length)];
    const opacity = (0.4 + Math.random() * 0.5).toFixed(2);
    const duration = (3 + Math.random() * 5).toFixed(1);
    const delay = (Math.random() * 5).toFixed(1);
    const moveY = -(8 + Math.random() * 14);

    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', color);
    circle.setAttribute('opacity', opacity);
    circle.style.setProperty('--move-y', moveY.toFixed(0) + 'px');
    circle.style.animation = 'sparkle-float ' + duration + 's ' + delay + 's ease-in-out infinite';

    group.appendChild(circle);
  }
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
initSparkles();
initColorPicker();
initScrollReveal();
