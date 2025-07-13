const Plan = require('../models/Plan');
const Service = require('../models/Service');

// Crear un nuevo plan
exports.createPlan = async (req, res) => {
  try {
    const {
      name,
      category,
      icon,
      includes = [],
      services,
      minPrice,
      maxPrice,
      currency,
      period,
      isPopular,
      description
    } = req.body;

    // Validar que los servicios existan
    const foundServices = await Service.find({ _id: { $in: services } });

    if (foundServices.length !== services.length) {
      return res.status(400).json({
        error: 'Uno o más servicios no existen en el sistema'
      });
    }

    const nuevoPlan = await Plan.create({
      name,
      category,
      icon,
      includes,
      services,
      minPrice,
      maxPrice,
      currency,
      period,
      isPopular,
      description
    });

    res.status(201).json({ message: 'Plan creado exitosamente', plan: nuevoPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el plan' });
  }
};

// Obtener todos los planes con allIncludes
exports.getPlans = async (req, res) => {
  try {
    const planes = await Plan.find().populate('services', 'name _id');

    const planesConIncludes = planes.map(plan => ({
      ...plan.toObject(),
      allIncludes: [
        ...plan.includes,
        ...plan.services.map(s => s.name)
      ]
    }));

    res.json(planesConIncludes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los planes' });
  }
};

// Obtener planes por categoría
exports.getPlansByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const planes = await Plan.find({ category }).populate('services', 'name _id');

    if (planes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron planes para esta categoría' });
    }

    const planesConIncludes = planes.map(plan => ({
      ...plan.toObject(),
      allIncludes: [
        ...plan.includes,
        ...plan.services.map(s => s.name)
      ]
    }));

    res.json(planesConIncludes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los planes por categoría' });
  }
};

// Obtener planes populares
exports.getPopularPlans = async (req, res) => {
  try {
    const planes = await Plan.find({ isPopular: true }).populate('services', 'name _id');

    if (planes.length === 0) {
      return res.status(404).json({ message: 'No hay planes populares disponibles' });
    }

    const planesConIncludes = planes.map(plan => ({
      ...plan.toObject(),
      allIncludes: [
        ...plan.includes,
        ...plan.services.map(s => s.name)
      ]
    }));

    res.json(planesConIncludes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los planes populares' });
  }
};

// Obtener un plan por ID
exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).populate('services', 'name _id');
    if (!plan) return res.status(404).json({ error: 'Plan no encontrado' });

    const planConIncludes = {
      ...plan.toObject(),
      allIncludes: [
        ...plan.includes,
        ...plan.services.map(s => s.name)
      ]
    };

    res.json(planConIncludes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el plan' });
  }
};

// Actualizar plan
exports.updatePlan = async (req, res) => {
  try {
    const {
      name,
      category,
      icon,
      includes = [],
      services,
      minPrice,
      maxPrice,
      currency,
      period,
      isPopular,
      description
    } = req.body;

    // Verificar si vienen servicios y validarlos
    if (services && services.length > 0) {
      const foundServices = await Service.find({ _id: { $in: services } });
      if (foundServices.length !== services.length) {
        return res.status(400).json({
          error: 'Uno o más servicios no existen en el sistema'
        });
      }
    }

    const planActualizado = await Plan.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        icon,
        includes,
        services,
        minPrice,
        maxPrice,
        currency,
        period,
        isPopular,
        description
      },
      { new: true, runValidators: true }
    ).populate('services', 'name _id');

    if (!planActualizado) return res.status(404).json({ error: 'Plan no encontrado' });

    const resultado = {
      ...planActualizado.toObject(),
      allIncludes: [
        ...planActualizado.includes,
        ...planActualizado.services.map(s => s.name)
      ]
    };

    res.json({ message: 'Plan actualizado correctamente', plan: resultado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el plan' });
  }
};

// Eliminar plan
exports.deletePlan = async (req, res) => {
  try {
    const planEliminado = await Plan.findByIdAndDelete(req.params.id);
    if (!planEliminado) return res.status(404).json({ error: 'Plan no encontrado' });

    res.json({ message: 'Plan eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el plan' });
  }
};