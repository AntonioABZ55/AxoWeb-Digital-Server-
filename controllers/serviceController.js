const Service = require('../models/Service');

// Crear un nuevo servicio
exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Obtener todos los servicios
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener servicio por ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Obtener servicios por categoría
exports.getServicesByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const services = await Service.find({ category: new RegExp(`^${category}$`, 'i') }); // insensible a mayúsculas
    if (services.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontraron servicios para esta categoría' });
    }
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Actualizar servicio
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Eliminar servicio
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Servicio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
