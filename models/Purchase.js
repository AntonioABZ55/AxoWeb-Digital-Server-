const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.ObjectId,
    ref: 'Usuario',
    required: [true, 'La compra debe estar asociada a un usuario']
  },
  tipo: {
    type: String,
    enum: ['servicio', 'plan'],
    required: true
  },
  item: {
    type: mongoose.Schema.ObjectId,
    refPath: 'tipo',
    required: [true, 'La compra debe incluir un servicio o plan']
  },
  fechaCompra: {
    type: Date,
    default: Date.now
  },
  fechaVencimiento: {
    type: Date,
    required: [true, 'Debe especificar una fecha de vencimiento']
  },
  estado: {
    type: String,
    enum: ['activo', 'vencido', 'cancelado', 'mantenimiento'],
    default: 'activo'
  }
});

const Compra = mongoose.model('Compra', compraSchema);

module.exports = Compra;