const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'User', // O el modelo que uses para clientes
    required: true
  },
  plan: {
    type: Schema.Types.ObjectId,
    ref: 'Plan',
    default: null
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    default: null
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['activo', 'inactivo', 'cancelado', 'mantenimiento', 'desarrollo', 'vencido'],
    default: 'activo'
  }
});
