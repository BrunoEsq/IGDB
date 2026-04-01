/**
 * Vercel Function: Proxy seguro para IGDB API
 * - Las API keys están protegidas en el servidor
 * - Valida todas las peticiones entrantes
 * - Limita el número de resultados
 */

export default async function handler(req, res) {
  // Solo permitir GET y POST
  if (!['GET', 'POST'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS - Permitir peticiones públicas desde cualquier origen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar peticiones OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Obtener el query de búsqueda
  const query = req.body?.query || req.query?.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query parameter' });
  }

  // Validar que el query no sea demasiado largo (prevenir abuso)
  if (query.length > 100) {
    return res.status(400).json({ error: 'Query too long' });
  }

  // Validar que no tenga caracteres peligrosos
  if (!/^[\w\s\-\.\:\&\!\(\),]{1,100}$/.test(query)) {
    return res.status(400).json({ error: 'Invalid query format' });
  }

  const CLIENT_ID = process.env.IGDB_CLIENT_ID;
  const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN;

  if (!CLIENT_ID || !ACCESS_TOKEN) {
    console.error('Missing IGDB credentials in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const response = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'text/plain'
      },
      // Limitar a 10 resultados y campos específicos
      body: `fields name, id, cover.url; search "${query}"; limit 10;`
    });

    if (!response.ok) {
      console.error('IGDB API error:', response.status, response.statusText);
      return res.status(response.status).json({ 
        error: 'IGDB API error',
        details: response.statusText 
      });
    }

    const data = await response.json();

    // Procesar resultados para que sean seguros
    const safeData = data.map(game => ({
      id: String(game.id), // Convertir a string para evitar problemas
      name: String(game.name || '').substring(0, 100), // Limitar longitud
      cover: game.cover ? {
        url: String(game.cover.url || '').replace(/[^a-zA-Z0-9\-_.~:/?#[\]@!$&'()*+,;=]/g, '')
      } : null
    }));

    // Configurar headers de seguridad
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache de 5 minutos
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    
    return res.status(200).json(safeData);

  } catch (error) {
    console.error('Proxy error:', error.message);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Unknown error'
    });
  }
}
