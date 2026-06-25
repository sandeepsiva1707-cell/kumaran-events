const cloudinary = require('cloudinary').v2;

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const tag = process.env.CLOUDINARY_GALLERY_TAG || 'kumaran-gallery';
    
    // Fetch all resources with the tag using the secure Admin API
    const result = await cloudinary.api.resources_by_tag(tag, {
      max_results: 500,
      keep_original_filename: true
    });

    res.status(200).json({
      resources: result.resources.map(asset => ({
        public_id: asset.public_id,
        version: asset.version,
        format: asset.format,
        width: asset.width,
        height: asset.height,
        type: asset.type,
        created_at: asset.created_at,
        folder: asset.asset_folder || asset.folder || ''
      }))
    });
  } catch (error) {
    console.error('Serverless gallery fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve images from Cloudinary server-side.',
      details: error.message 
    });
  }
};
