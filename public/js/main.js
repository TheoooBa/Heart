const form = document.getElementById('subscribe-form');
const submitBtn = document.getElementById('submit-btn');
const message = document.getElementById('form-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const prenom = document.getElementById('prenom').value.trim();

  if (!email) {
    showMessage("Merci d'entrer ton adresse email.", false);
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enregistrement…';
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
      showMessage('Tu es sur la liste. On te tient au courant.', true);
      submitBtn.textContent = 'Merci';
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
  message.textContent = text;
  message.className = 'form__message' + (isSuccess ? ' form__message--success' : '');
}

function resetButton() {
  submitBtn.disabled = false;
  submitBtn.textContent = 'Je rejoins la liste';
}
