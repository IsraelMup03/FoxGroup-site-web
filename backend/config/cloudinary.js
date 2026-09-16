const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;

const CLOUDINARY_ACTIF = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

if (CLOUDINARY_ACTIF) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
} else {
  console.warn('Cloudinary non configuré : les photos et vidéos seront stockées localement dans backend/data/uploads.');
}

const DOSSIER_LOCAL = path.join(__dirname, '..', 'data', 'uploads');
fs.mkdirSync(DOSSIER_LOCAL, { recursive: true });

const EXTENSIONS = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif',
  'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov',
};

// Stockage local de secours : utilisé automatiquement tant que Cloudinary n'est pas configuré.
function enregistrerLocal(buffer, mimetype, baseUrl) {
  const extension = EXTENSIONS[mimetype] || 'bin';
  const nomFichier = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${extension}`;
  fs.writeFileSync(path.join(DOSSIER_LOCAL, nomFichier), buffer);
  return { secure_url: `${baseUrl}/uploads/${nomFichier}`, public_id: `local:${nomFichier}` };
}

function supprimerLocal(nomFichier) {
  try {
    fs.unlinkSync(path.join(DOSSIER_LOCAL, nomFichier));
  } catch (err) {
    if (err.code !== 'ENOENT') console.warn('Suppression du fichier local impossible :', err.message);
  }
}

// `options.mimetype` et `options.baseUrl` ne sont utilisés que pour le repli local.
function envoyerMedia(buffer, resourceType = 'image', options = {}) {
  if (!CLOUDINARY_ACTIF) {
    return Promise.resolve(enregistrerLocal(buffer, options.mimetype, options.baseUrl));
  }
  return new Promise((resolve, reject) => {
    const config = {
      folder: process.env.CLOUDINARY_FOLDER || 'foxgroup',
      resource_type: resourceType,
    };
    config.transformation = resourceType === 'video'
      ? [{ width: 1280, height: 1280, crop: 'limit', quality: 'auto' }]
      : [{ width: 1400, height: 1400, crop: 'limit', quality: 'auto', fetch_format: 'auto' }];

    const flux = cloudinary.uploader.upload_stream(config, (err, resultat) => (err ? reject(err) : resolve(resultat)));
    flux.end(buffer);
  });
}

async function supprimerMedia(publicId, resourceType = 'image') {
  if (!publicId) return;
  if (publicId.startsWith('local:')) {
    supprimerLocal(publicId.slice('local:'.length));
    return;
  }
  if (!CLOUDINARY_ACTIF) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.warn('Suppression Cloudinary impossible :', err.message);
  }
}

module.exports = { envoyerMedia, supprimerMedia, DOSSIER_LOCAL };
