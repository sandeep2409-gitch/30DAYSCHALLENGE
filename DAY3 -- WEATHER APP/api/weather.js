/**
 * Vercel Serverless Function
 * Secure backend proxy for OpenWeatherMap API queries.
 * Keeps API Key hidden from GitHub and the client browser.
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { city, lat, lon, type, units, query } = req.query;
  
  // Load API Key securely from Vercel Environment Variables
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: "OpenWeatherMap API Key is not configured in Vercel Environment Variables." 
    });
  }

  try {
    let url = '';
    const unitsParam = units || 'metric';

    if (type === 'forecast') {
      // 5-Day / 3-Hour Forecast
      url = city
        ? `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${unitsParam}&appid=${apiKey}`
        : `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unitsParam}&appid=${apiKey}`;
    } else if (type === 'direct') {
      // Geocoding Search Suggestions
      url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`;
    } else if (type === 'reverse') {
      // Geocoding Reverse Lookup (coordinates to city name)
      url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    } else {
      // Current Weather Condition (Default)
      url = city
        ? `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${unitsParam}&appid=${apiKey}`
        : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unitsParam}&appid=${apiKey}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `External meteorological service error (${response.status})` 
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ 
      error: "Met Service Proxy failed to request coordinates: " + error.message 
    });
  }
}
