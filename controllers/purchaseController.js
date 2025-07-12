const Purchase = require('../models/Purchase');
const Plan = require('../models/Plan');
const Service = require('../models/Service');

exports.createPurchase = async (req, res) => {
  try {
    const { client, plan, service } = req.body;

    // Verificar que venga uno solo
    if (!client || (!plan && !service) || (plan && service)) {
      return res.status(400).json({ error: 'Debes enviar cliente y un único plan o servicio' });
    }

    // Validar si el plan o servicio existe
    if (plan) {
      const existingPlan = await Plan.findById(plan);
      if (!existingPlan) {
        return res.status(404).json({ error: 'El plan especificado no existe' });
      }
    }

    if (service) {
      const existingService = await Service.findById(service);
      if (!existingService) {
        return res.status(404).json({ error: 'El servicio especificado no existe' });
      }
    }

    // Crear fechas
    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setFullYear(now.getFullYear() + 1);

    // Crear compra
    const newPurchase = new Purchase({
      client,
      plan: plan || null,
      service: service || null,
      purchaseDate: now,
      dueDate,
      status: 'activo'
    });

    await newPurchase.save();
    res.status(201).json(newPurchase);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear la compra', details: err.message });
  }
};

// Obtener todas las compras (solo admin)
exports.getAllPurchases = async (req, res) => {
  try {
    if (req.user.typeUser !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado: solo administradores' });
    }

    const purchases = await Purchase.find()
      .populate('client', 'name email')
      .populate('plan', 'name')
      .populate('service', 'name');

    // Opcional: transformar la respuesta
    const formatted = purchases.map(p => ({
      _id: p._id,
      clientName: p.client?.name,
      clientEmail: p.client?.email,
      planName: p.plan?.name || null,
      serviceName: p.service?.name || null,
      status: p.status,
      purchaseDate: p.purchaseDate,
      dueDate: p.dueDate
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener compras', details: err.message });
  }
};

// Obtener compras por cliente o para manejo de filttro de un admin
exports.getPurchasesByClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    if (req.user.typeUser !== 'administrador' && req.user._id.toString() !== clientId) {
      return res.status(403).json({ error: 'No autorizado para ver estas compras' });
    }

    const purchases = await Purchase.find({ client: clientId })
      .populate('plan', 'name')
      .populate('service', 'name');

    const formatted = purchases.map(p => ({
      _id: p._id,
      planName: p.plan?.name || null,
      serviceName: p.service?.name || null,
      status: p.status,
      purchaseDate: p.purchaseDate,
      dueDate: p.dueDate
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener compras del cliente', details: err.message });
  }
};

// Cambiar estado de una compra
exports.updatePurchaseStatus = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const { status } = req.body;

    const validStatuses = ['activo', 'inactivo', 'cancelado', 'mantenimiento', 'desarrollo', 'vencido'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) return res.status(404).json({ error: 'Compra no encontrada' });

    if (req.user.typeUser === 'admin') {
      purchase.status = status;
    } else if (req.user._id === purchase.client.toString()) {
      if (status !== 'cancelado') {
        return res.status(403).json({ error: 'Solo puedes cancelar tu propia compra' });
      }
      purchase.status = 'cancelado';
    } else {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await purchase.save();
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar estado', details: err.message });
  }
};

// Eliminar compra (solo admin)
exports.deletePurchase = async (req, res) => {
  try {
    if (req.user.typeUser !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden eliminar compras' });
    }

    const { purchaseId } = req.params;
    const deleted = await Purchase.findByIdAndDelete(purchaseId);
    if (!deleted) return res.status(404).json({ error: 'Compra no encontrada' });

    res.json({ message: 'Compra eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar compra', details: err.message });
  }
};

// Actualizar automáticamente compras vencidas (solo admin)
exports.updateExpiredPurchases = async (req, res) => {
  try {
    if (req.user.typeUser !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden ejecutar esta acción' });
    }

    const now = new Date();
    const result = await Purchase.updateMany(
      { dueDate: { $lt: now }, status: { $ne: 'vencido' } },
      { $set: { status: 'vencido' } }
    );

    res.json({ message: 'Compras vencidas actualizadas', modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar compras vencidas', details: err.message });
  }
};