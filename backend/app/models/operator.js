import mongoose from 'mongoose';
const { Schema } = mongoose;


const operatorSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true},
  role: {type: String, enum: ['reporter', 'editor','admin'], default: 'reporter', required: true},
  isActive: { type: Boolean, default: false, required: true },
  activationToken: { type: String, default: null },
  tokenExp: { type: Date }
});

// Creazione del modello
const Operator = mongoose.model('Operator', operatorSchema);

export default Operator;