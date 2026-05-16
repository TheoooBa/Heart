/* ── Sélection du modèle ── */

const coeurQ = document.getElementById('coeur-quotidien');
const coeurS = document.getElementById('coeur-soiree');
const contenuQ = document.getElementById('contenu-quotidien');
const contenuS = document.getElementById('contenu-soiree');

coeurQ.addEventListener('click', function () {
  contenuQ.style.display = 'block';
  contenuS.style.display = 'none';
  coeurQ.classList.add('actif');
  coeurS.classList.remove('actif');
});

coeurS.addEventListener('click', function () {
  contenuS.style.display = 'block';
  contenuQ.style.display = 'none';
  coeurS.classList.add('actif');
  coeurQ.classList.remove('actif');
});

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
