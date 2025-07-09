
// models/usuario.js
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor ingrese su nombre']
  },
  lastname: {
    type: String,
    required: [true, 'Por favor ingrese su apellido']
  },
  email: {
    type: String,
    required: [true, 'Por favor ingrese su correo electrónico'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un correo válido']
  },
  password: {
    type: String,
    required: [true, 'Por favor ingrese una contraseña'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    default: ''
  },
  company: {
    type: String,
    default: ''
  },
  typeUser: {
    type: String,
    enum: ['cliente', 'administrador'],
    default: 'cliente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const user = mongoose.model('User', usuarioSchema);

module.exports = user;
