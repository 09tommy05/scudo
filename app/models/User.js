import mongoose from 'mongoose';
const { Schema } = mongoose;


const userSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true}, //se lo spid e CIE vanno, questo campo non serve più
  cf: { type: String, required: true, unique: true }, // codice fiscale
});

// Creazione del modello
const User = mongoose.model('User', userSchema);

export default User;