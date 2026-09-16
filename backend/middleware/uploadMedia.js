const multer = require('multer');

module.exports = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 40 * 1024 * 1024 },
  fileFilter: (req, fichier, cb) => {
    if (/^image\/(jpeg|png|webp|avif)$/.test(fichier.mimetype)) return cb(null, true);
    if (/^video\/(mp4|webm|quicktime)$/.test(fichier.mimetype)) return cb(null, true);
    const err = new Error("Format non accepté. Utilisez JPG, PNG, WebP pour une photo, ou MP4/WebM/MOV pour une vidéo.");
    err.status = 400;
    cb(err);
  },
});
