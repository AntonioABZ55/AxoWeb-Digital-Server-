const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor ingrese el nombre del servicio'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Por favor ingrese la descripción del servicio']
  },
  icon: { 
    type: String,
    default: 'default.jpg'
  },
  priceMin: {
    type: Number,
    required: [true, 'Por favor ingrese el precio mínimo del servicio']
  },
  priceMax: {
    type: Number,
    required: [true, 'Por favor ingrese el precio máximo del servicio']
  },
  currency: {
    type: String,
    enum: ['MXN', 'USD', 'EUR', 'Otro'],
    default: 'MXN'
  },
  category: {
    type: String,
    required: [true, 'Por favor indique la categoría del servicio'],
    trim: true
  },
  developmentTime: {
    type: String,
    default: 'depende del proyecto',
    trim: true
  },
  includes: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Service = mongoose.model('Service', servicioSchema);

module.exports = Service;
