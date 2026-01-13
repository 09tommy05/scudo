import mongoose from 'mongoose';
const { Schema } = mongoose;

// Schema Articolo
const articleSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  img: String,               // nome del file immagine
  author: { type: Schema.Types.ObjectId, ref: 'Operator', required: true },
  last_edit: { type: Date, default: Date.now },
  isDraft: { type: Boolean, default: true, required: true },
  short_text: { type: String, required: true },
  categoria: {type: String, required: true}
});

// Creazione del modello
const Article = mongoose.model('Article', articleSchema);

export default Article;