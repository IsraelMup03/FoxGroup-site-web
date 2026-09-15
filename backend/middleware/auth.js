const jwt = require('jsonwebtoken');

module.exports = function exigerAdmin(req, res, next) {
  const entete = req.headers.authorization || '';
  const token = entete.startsWith('Bearer ') ? entete.slice(7) : null;
  if (!token) return res.status(401).json({ erreur: 'Connexion requise.' });

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ erreur: 'Session expirée. Reconnectez-vous.' });
  }
};
