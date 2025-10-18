const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * @description Modèle Mongoose pour stocker les utilisateurs avec hash de mot de passe
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom est obligatoire"],
    trim: true,
    minlength: [2, "Le nom doit contenir au moins 2 caractères"]
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, "L'email doit être valide"]
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
    select: false // par défaut, le password n'est pas renvoyé
  },
  avatar: {
    type: String,
    default: ''
  },
  isPro: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

/**
 * Middleware pre-save
 * Hash le mot de passe avant de sauvegarder
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Ne hash que si le password est modifié
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Méthode d'instance pour comparer un mot de passe
 * @param {string} enteredPassword - mot de passe fourni par l'utilisateur
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
