const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }, // petit résumé du chapitre
  content: { type: String, required: true },
});

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // référence à l'utilisateur qui a créé le livre
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    chapters: [chapterSchema], // tableau de chapitres intégrés
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
