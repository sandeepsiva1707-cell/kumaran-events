const cloudinary = require('cloudinary').v2;
const { verifyToken } = require('./auth');

// Configure Cloudinary securely using server-side environment variables with hardcoded fallbacks
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

  // Disable caching for live API updates
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET: Fetch all gallery images
  if (req.method === 'GET') {
    try {
      const tag = process.env.CLOUDINARY_GALLERY_TAG || 'kumaran-gallery';
      
      // Fetch all resources with the tag using the secure Admin API
      const result = await cloudinary.api.resources_by_tag(tag, {
        max_results: 500,
        keep_original_filename: true,
        context: true // Fetch title/description context
      });

      const resources = result.resources.map(asset => {
        // Read context values safely
        const caption = asset.context && asset.context.custom 
          ? asset.context.custom.caption 
          : (asset.context ? asset.context.caption : '');
        const alt = asset.context && asset.context.custom 
          ? asset.context.custom.alt 
          : (asset.context ? asset.context.alt : '');

        return {
          public_id: asset.public_id,
          version: asset.version,
          format: asset.format,
          width: asset.width,
          height: asset.height,
          type: asset.type,
          created_at: asset.created_at,
          folder: asset.asset_folder || asset.folder || '',
          context: {
            caption: caption || '',
            alt: alt || ''
          }
        };
      });

      res.status(200).json({ resources });
    } catch (error) {
      console.error('Serverless gallery fetch error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve images from Cloudinary server-side.',
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

  // POST: Update context metadata (Title/Description)
  if (req.method === 'POST') {
    if (!checkAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized. Valid login session required.' });
    }

    try {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
      
      const { public_id, title, description } = body;
      
      if (!public_id) {
        return res.status(400).json({ error: 'public_id is required.' });
      }

      // Add context in Cloudinary (overwrites existing keys)
      const result = await cloudinary.uploader.add_context({
        caption: title || '',
        alt: description || ''
      }, [public_id]);

      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update image metadata.', details: error.message });
    }
    return;
  }

  // DELETE: Delete asset from Cloudinary
  if (req.method === 'DELETE') {
    if (!checkAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized. Valid login session required.' });
    }

    try {
      const { public_id } = req.query || req.body || {};
      
      if (!public_id) {
        return res.status(400).json({ error: 'public_id is required for deletion.' });
      }

      // Destroy resource in Cloudinary
      const result = await cloudinary.uploader.destroy(public_id);
      
      if (result.result === 'ok') {
        res.status(200).json({ success: true, message: 'Image deleted successfully.' });
      } else {
        res.status(400).json({ error: 'Failed to delete image.', details: result });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error processing deletion request.', details: error.message });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed.' });
};
