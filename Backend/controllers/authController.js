const sendEmail = require('../config/sendEmail');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

/**
 * @desc  Génère un token JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token valable 7 jours
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Inscription utilisateur
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier les champs obligatoires
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    // Vérifier si l'email existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Créer l'utilisateur
    const user = await User.create({ name, email, password });
     await sendEmail({
      to: email,
      subject: 'Bienvenue sur AI-Book-Creator 📚',
      html: `
        <h1>Salut ${name} 👋</h1>
        <p>Bienvenue sur <strong>AI-Book-Creator</strong> !</p>
        <p>Crée, édite et partage tes livres intelligents grâce à l’IA 🤖✨</p>
        <br/>
        <p>– L’équipe AI-Book-Creator</p>
      `,
    });

    // Réponse avec token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      message: 'Inscription réussie 🎉',
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Connexion utilisateur
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier les champs
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    // Comparer les mots de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Réponse avec token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      message: 'Connexion réussie ✅',
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
