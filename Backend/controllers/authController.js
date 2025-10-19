const sendEmail = require('../config/sendEmail');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

/**
 * @desc  Génère un token JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d', 
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
      return res.status(400).json({ 
        success: false,
        message: 'Tous les champs sont obligatoires' 
      });
    }

    // Vérifier si l'email existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'Cet email est déjà utilisé' 
      });
    }

    // Créer l'utilisateur
    const user = await User.create({ name, email, password });
    
    // Envoyer email de bienvenue
    try {
      await sendEmail({
        to: email,
        subject: 'Bienvenue sur AI-Book-Creator 📚',
        html: `
          <h1>Salut ${name} 👋</h1>
          <p>Bienvenue sur <strong>AI-Book-Creator</strong> !</p>
          <p>Crée, édite et partage tes livres intelligents grâce à l'IA 🤖✨</p>
          <br/>
          <p>– L'équipe AI-Book-Creator</p>
        `,
      });
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      // Ne pas bloquer l'inscription si l'email échoue
    }

    // Réponse avec token
    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
      message: 'Inscription réussie 🎉',
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
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
      return res.status(400).json({ 
        success: false,
        message: 'Email et mot de passe requis' 
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Email ou mot de passe incorrect' 
      });
    }

    // Comparer les mots de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Email ou mot de passe incorrect' 
      });
    }

    // Réponse avec token
    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      message: 'Connexion réussie ✅',
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur serveur' 
    });
  }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Récupérer le profil utilisateur
 * @access  Private
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé ❌",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profil récupéré avec succès ✅",
      data: user,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error.message);
    res.status(500).json({
      success: false,
      message: "Erreur serveur 💥",
    });
  }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Modifier le profil utilisateur
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔒 Champs autorisés à mettre à jour
    const allowedFields = ['name', 'email', 'avatar'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      userId,      // 1️⃣ ID de l'utilisateur
      updates,     // 2️⃣ Données à mettre à jour
      { new: true, runValidators: true } // 3️⃣ options
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé ❌",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profil mis à jour avec succès ✅",
      data: updatedUser,
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error.message);
    res.status(500).json({
      success: false,
      message: "Erreur serveur 💥",
    });
  }
};


