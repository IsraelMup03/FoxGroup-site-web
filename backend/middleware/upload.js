const multer = require('multer');

module.exports = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, fichier, cb) => {
    if (/^image\/(jpeg|png|webp|avif)$/.test(fichier.mimetype)) return cb(null, true);
    const err = new Error("Format d'image non accepté. Utilisez JPG, PNG ou WebP.");
    err.status = 400;
    cb(err);
  },
});
