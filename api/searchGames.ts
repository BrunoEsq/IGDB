import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Get the query parameter
    const { query } = req.body || {};

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid query parameter' });
    }

    // Validate query length
    if (query.length > 100) {
      return res.status(400).json({ error: 'Query too long (max 100 characters)' });
    }

    // Validate characters
    if (!/^[\w\s\-\.\:\&\!\(\),]{1,100}$/.test(query)) {
      return res.status(400).json({ error: 'Invalid query format' });
    }

    // Get credentials from environment
    const CLIENT_ID = process.env.IGDB_CLIENT_ID;
    const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;

    if (!CLIENT_ID || !ACCESS_TOKEN) {
      console.error('Missing IGDB credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Call IGDB API
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

    // Ensure it's an array
    const data = Array.isArray(igdbData) ? igdbData : [];

    // Sanitize data
    const sanitized = data.map((game: any) => ({
      id: String(game.id || ''),
      name: String(game.name || '').substring(0, 100),
      cover: game.cover?.url ? {
        url: String(game.cover.url).replace(/[^a-zA-Z0-9\-_.~:/?#[\]@!$&'()*+,;=]/g, ''),
      } : null,
    }));

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.status(200).json(sanitized);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}
