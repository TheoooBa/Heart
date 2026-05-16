require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Airtable = require('airtable');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

app.post('/api/subscribe', async (req, res) => {
  const { email, prenom } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Adresse email invalide.' });
  }

  try {
    await base(process.env.AIRTABLE_TABLE_NAME).create([
      {
        fields: {
          Email: email,
          Prénom: prenom || '',
          Date: new Date().toISOString(),
        },
      },
    ]);

    res.status(200).json({ success: true, message: 'Inscription enregistrée.' });
  } catch (err) {
    console.error('Airtable error:', err.message);
    res.status(500).json({ error: 'Une erreur est survenue. Réessaie dans un instant.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Heart landing page running on http://localhost:${PORT}`);
});
