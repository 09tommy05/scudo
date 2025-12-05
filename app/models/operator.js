import mongoose from 'mongoose';
const { Schema } = mongoose;


const operatorSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true},
  role: {type: String, enum: ['reporter', 'editor','admin'], default: 'reporter'},
  isActive: { type: Boolean, default: true }
});

// Creazione del modello
const Operator = mongoose.model('Operator', operatorSchema);

export default Operator;