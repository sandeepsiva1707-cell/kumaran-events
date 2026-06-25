const crypto = require('crypto');

// Secret key for HMAC signing
const SECRET_KEY = process.env.JWT_SECRET || 'kumaran-secret-key-123';
const DEFAULT_EMAIL = process.env.ADMIN_EMAIL || 'admin@kumarandecors.com';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'kumaran2026';

// Helper to generate a stateless token (expires in 24 hours)
function generateToken(email) {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = `${email}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

// Helper to verify a token
function verifyToken(token) {
  try {
    if (!token) return null;
    const decoded = Buffer.from(token, 'base64').toString('ascii');
    const parts = decoded.split(':');
    if (parts.length !== 3) return null;
    
    const [email, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    
    if (Date.now() > expiresAt) return null; // Expired
    
    // Recreate signature
    const payload = `${email}:${expiresAtStr}`;
    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
    
    if (signature === expectedSignature) {
      return { email };
    }
  } catch (e) {
    // Ignore decode errors
  }
  return null;
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET to check if token is valid
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ authenticated: false, error: 'Authorization token missing.' });
    }
    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);
    if (user) {
      return res.status(200).json({ authenticated: true, email: user.email });
    } else {
      return res.status(401).json({ authenticated: false, error: 'Session expired or invalid token.' });
    }
  }

  // Handle POST for login
  if (req.method === 'POST') {
    try {
      // Handle serverless body parsing safety
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
      
      const { email, password } = body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      if (email.toLowerCase() === DEFAULT_EMAIL.toLowerCase() && password === DEFAULT_PASSWORD) {
        const token = generateToken(email.toLowerCase());
        return res.status(200).json({ token, email: email.toLowerCase() });
      } else {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Authentication server error.', details: error.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed.' });
};

// Export helper for route protection in other serverless functions
module.exports.verifyToken = verifyToken;
