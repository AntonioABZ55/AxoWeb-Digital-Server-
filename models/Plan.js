const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del plan es obligatorio']
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria']
  },
  icon: {
    type: String,
    required: [true, 'La URL del icono es obligatoria']
  },
  includes: {
    type: [String],
    default: [],
    required: [false]
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [false]
    }
  ],
  minPrice: {
    type: Number,
    required: [true, 'El precio mínimo es obligatorio']
  },
  maxPrice: {
    type: Number,
    required: [true, 'El precio máximo es obligatorio']
  },
  currency: {
    type: String,
    enum: {
      values: ['MXN', 'USD', 'EUR'],
      message: 'La moneda debe ser MXN, USD o EUR'
    },
    required: [true, 'La moneda es obligatoria']
  },
  period: {
  type: String,
  required: [true, 'El período de pago es obligatorio']
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: [true, 'La descripción del plan es obligatoria']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Plan = mongoose.model('Plan', planSchema);
module.exports = Plan;
