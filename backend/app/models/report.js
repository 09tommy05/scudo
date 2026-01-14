import mongoose from 'mongoose';
const { Schema } = mongoose;


// Schema Segnalazione
const reportSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  created: { type: Date, default: Date.now },
  categoria: {type: String, required: true},
  attachments: {type: [String], default: []},
  status: { type: String, enum: ['da elaborare', 'in lavorazione', 'risolta'], default: 'da elaborare' }
});

// Creazione del modello
const Report = mongoose.model('Report', reportSchema);

export default Report;