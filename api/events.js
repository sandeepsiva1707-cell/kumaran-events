const cloudinary = require('cloudinary').v2;
const { verifyToken } = require('./auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ktohexmm',
  api_key: process.env.CLOUDINARY_API_KEY || '774525689696374',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'LWR3E-fy_1pwasgmn9sps1qxBWs'
});

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Disable caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET: Retrieve all events
  if (req.method === 'GET') {
    try {
      const tag = 'kumaran-events';
      
      const result = await cloudinary.api.resources_by_tag(tag, {
        max_results: 500,
        keep_original_filename: true,
        context: true // Fetch custom context keys
      });

      const events = result.resources.map(asset => {
        const context = asset.context ? (asset.context.custom || asset.context) : {};
        
        return {
          public_id: asset.public_id,
          version: asset.version,
          format: asset.format,
          width: asset.width,
          height: asset.height,
          type: asset.type,
          created_at: asset.created_at,
          bannerUrl: asset.secure_url,
          title: context.caption || context.title || 'Untitled Event',
          description: context.alt || context.description || 'No description provided.',
          category: context.category || 'General',
          date: context.date || new Date(asset.created_at).toISOString().split('T')[0]
        };
      });

      // Sort events by date (newest first)
      events.sort((a, b) => new Date(b.date) - new Date(a.date));

      res.status(200).json({ events });
    } catch (error) {
      console.error('Serverless events fetch error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve events from Cloudinary server-side.',
        details: error.message 
      });
    }
    return;
  }

  // Helper to authenticate request
  const checkAuth = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.split(' ')[1];
    return verifyToken(token);
  };

  // POST: Create or Update Event details
  if (req.method === 'POST') {
    if (!checkAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized. Valid login session required.' });
    }

    try {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
      
      const { public_id, title, description, category, date } = body;
      
      if (!public_id) {
        return res.status(400).json({ error: 'public_id (banner public id) is required.' });
      }

      // Add context (Title, Description, Category, Date) to the image asset
      const result = await cloudinary.uploader.add_context({
        caption: title || '',
        alt: description || '',
        category: category || 'General',
        date: date || new Date().toISOString().split('T')[0]
      }, [public_id]);

      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update event metadata.', details: error.message });
    }
    return;
  }

  // DELETE: Delete event (destroys banner image)
  if (req.method === 'DELETE') {
    if (!checkAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized. Valid login session required.' });
    }

    try {
      const { public_id } = req.query || req.body || {};
      
      if (!public_id) {
        return res.status(400).json({ error: 'public_id is required for deletion.' });
      }

      // Destroy the event banner resource in Cloudinary
      const result = await cloudinary.uploader.destroy(public_id);
      
      if (result.result === 'ok' || result.result === 'not found') {
        res.status(200).json({ success: true, message: 'Event deleted successfully.' });
      } else {
        res.status(400).json({ error: 'Failed to delete event banner.', details: result });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error processing event deletion.', details: error.message });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed.' });
};
