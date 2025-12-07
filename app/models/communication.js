import mongoose from 'mongoose';
const { Schema } = mongoose;

// Schema Articolo
const communicationSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Operator', required: true },
  publication: { type: Date, default: Date.now },
  isDraft: { type: Boolean, default: true, required: true },
  short_text: { type: String, required: true },
  categoria: {type: String, required: true},
  importance: { type: String, enum: ['basso rischio', 'medio rischio', 'alto rischio'], default: 'medio rischio', required: true}
});

// Creazione del modello
const Communication = mongoose.model('Communication', communicationSchema);

export default Communication;