import mongoose from 'mongoose';
const { Schema } = mongoose;

// Schema Articolo
const articleSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  img: String,               // nome del file immagine
  author: { type: Schema.Types.ObjectId, ref: 'Operator', required: true },
  last_edit: { type: Date, default: Date.now },
  short_text: String,
  categoria: String
});

// Creazione del modello
const Article = mongoose.model('Article', articleSchema);

export default Article;