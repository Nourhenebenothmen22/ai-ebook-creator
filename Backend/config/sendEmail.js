const transporter = require('./mail.config');

/**
 * @desc Envoie un email via le service configuré (Mailtrap, Gmail, etc.)
 * @param {Object} options - Données nécessaires pour l'envoi de l'email
 * @param {string} options.to - Adresse du destinataire
 * @param {string} options.subject - Sujet de l'email
 * @param {string} options.html - Contenu HTML du message
 */
const sendEmail = async (options) => {
  const mailOptions = {
    from: `"AI-Book-Creator" <no-reply@ai-book-creator.com>`, // ton app
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📨 Email envoyé à ${options.to}`);
};

module.exports = sendEmail;
