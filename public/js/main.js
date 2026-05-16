/* ── Interactive mode section ── */

const MODES = {
  quotidien: {
    subtitle: 'Pour le bureau, les transports, le trajet du soir.',
    title: 'Élégant. Discret. Magnétique.',
    lines: [
      "Se fixe sur n'importe quel vêtement, s'enlève en une seconde",
      'Invisible sous la veste, présent quand ça compte',
      "Alerte silencieuse envoyée à tes contacts si tu l'actives",
    ],
  },
  soiree: {
    subtitle: 'Pour les soirées, les retours tardifs, les moments où tu veux être vue.',
    title: 'Visible. Assumé. Adhésif.',
    lines: [
      'Porté sur le torse — il se voit, c\'est le but',
      "Voyant rouge et voix au déclenchement : l'agresseur sait qu'il est filmé",
      "L'incertitude est la dissuasion",
    ],
  },
};

function renderModeContent(mode) {
  const data = MODES[mode];
  return `
    <p class="mode-content__subtitle">${data.subtitle}</p>
    <h3 class="mode-content__title">${data.title}</h3>
    <ul class="mode-content__lines">
      ${data.lines.map(l => `<li class="mode-content__line">${l}</li>`).join('')}
    </ul>
  `;
}

function setMode(mode) {
  const content = document.getElementById('mode-content');
  const btnQuotidien = document.getElementById('mode-quotidien');
  const btnSoiree = document.getElementById('mode-soiree');
  const heroOuter = document.getElementById('hero-heart-outer');
  const heroInner = document.getElementById('hero-heart-inner');
  const isQuotidien = mode === 'quotidien';

  // Fond, couleur de texte et taille de police du body
  document.body.style.background = isQuotidien ? '#EDE4D8' : '#120B0E';
  document.body.style.color = isQuotidien ? '#3D1A20' : '#F5EFE8';
  document.body.style.fontSize = isQuotidien ? '110%' : '';

  // Classe CSS pour les éléments avec couleur explicite
  document.body.classList.toggle('theme-quotidien', isQuotidien);

  // Grand cœur hero : les deux cœurs passent en bordeaux en mode crème
  const heroStroke = isQuotidien ? '#7B1E2E' : '#EDE4D8';
  const heroWidth  = isQuotidien ? '1.5' : '1';
  if (heroOuter) { heroOuter.setAttribute('stroke', heroStroke); heroOuter.setAttribute('stroke-width', heroWidth); }
  if (heroInner) { heroInner.setAttribute('stroke', heroStroke); heroInner.setAttribute('stroke-width', heroWidth); }

  // Cœurs interactifs — toujours opacity 1, jamais en dessous de 0.9
  btnQuotidien.style.opacity = '1';
  btnSoiree.style.opacity = '1';

  // État actif (scale CSS)
  btnQuotidien.classList.toggle('mode-item--active', isQuotidien);
  btnSoiree.classList.toggle('mode-item--active', !isQuotidien);
  btnQuotidien.setAttribute('aria-pressed', String(isQuotidien));
  btnSoiree.setAttribute('aria-pressed', String(!isQuotidien));

  // Contenu — fade out / mise à jour / fade in
  content.classList.add('is-fading');
  setTimeout(() => {
    content.innerHTML = renderModeContent(mode);
    content.classList.remove('is-fading');
  }, 250);
}

document.getElementById('mode-quotidien').addEventListener('click', () => setMode('quotidien'));
document.getElementById('mode-soiree').addEventListener('click', () => setMode('soiree'));

setMode('soiree');

/* ── Subscription form ── */

const form = document.getElementById('subscribe-form');
const submitBtn = document.getElementById('submit-btn');
const messageEl = document.getElementById('form-message');
const DEFAULT_BTN_TEXT = 'Je veux être prévenue au lancement';

form.addEventListener('submit', async (e) => {
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
      const nom = prenom ? prenom : null;
      showMessage(nom ? `Merci ${nom}. On te tient au courant.` : 'Merci. On te tient au courant.', true);
      submitBtn.textContent = DEFAULT_BTN_TEXT;
    } else {
      showMessage(data.error || 'Une erreur est survenue.', false);
      resetButton();
    }
  } catch {
    showMessage('Connexion impossible. Réessaie dans un instant.', false);
    resetButton();
  }
});

function showMessage(text, isSuccess = false) {
  messageEl.textContent = text;
  messageEl.className = 'form__message' + (isSuccess ? ' form__message--success' : '');
}

function resetButton() {
  submitBtn.disabled = false;
  submitBtn.textContent = DEFAULT_BTN_TEXT;
}
