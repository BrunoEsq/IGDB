const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos de la carpeta public

// API endpoint1
app.post('/api/search-games', async (req, res) => {
  const { query } = req.body || {};

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query parameter' });
  }

  if (query.length > 100) {
    return res.status(400).json({ error: 'Query too long (max 100 characters)' });
  }

  if (!/^[\w\s\-\.\:\&\!\(\),]{1,100}$/.test(query)) {
    return res.status(400).json({ error: 'Invalid query format' });
  }

  const CLIENT_ID = process.env.IGDB_CLIENT_ID;
  const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;

  if (!CLIENT_ID || !ACCESS_TOKEN) {
    console.error('Missing IGDB credentials');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const igdbResponse = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'text/plain',
      },
      body: `fields name, id, cover.url; search "${query}"; limit 10;`,
    });

    if (!igdbResponse.ok) {
      console.error('IGDB error:', igdbResponse.status);
      return res.status(503).json({
        error: 'IGDB service unavailable',
        status: igdbResponse.status,
      });
    }

    const igdbData = await igdbResponse.json();
    const data = Array.isArray(igdbData) ? igdbData : [];

    const sanitized = data.map((game) => ({
      id: String(game.id || ''),
      name: String(game.name || '').substring(0, 100),
      cover: game.cover?.url ? {
        url: String(game.cover.url).replace(/[^a-zA-Z0-9\-_.~:/?#[\]@!$&'()*+,;=]/g, ''),
      } : null,
    }));

    res.json(sanitized);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
});

// Servir index.html en la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📂 Sirviendo archivos desde: ${__dirname}`);
});
