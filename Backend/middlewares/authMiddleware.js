const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  let token;

  try {
    // Vérifier si un header Authorization existe et commence par "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extraire le token
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Trouver l'utilisateur correspondant au token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      next(); // Continuer vers le contrôleur suivant
    } else {
      return res.status(401).json({ message: 'Non autorisé, token manquant' });
    }
  } catch (error) {
    console.error('Erreur middleware protect:', error);
    return res.status(401).json({ message: 'Non autorisé, token invalide' });
  }
};

module.exports = protect;
