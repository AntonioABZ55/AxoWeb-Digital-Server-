const Plan = require('../models/Plan');
const Service = require('../models/Service');

// Crear un nuevo plan
exports.createPlan = async (req, res) => {
  try {
    const {
      name,
      category,
      icon,
      services,
      minPrice,
      maxPrice,
      currency,
      period,
      isPopular,
      description
    } = req.body;

    // ✅ Validar que todos los servicios existen
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
// Obtener todos los planes
exports.getPlans = async (req, res) => {
  try {
    const planes = await Plan.find()
      .populate('services', 'name _id'); // ✅ Solo muestra name e _id de los servicios
    res.json(planes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los planes' });
  }
};
// Obtener los planes por categoria
exports.getPlansByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const planes = await Plan.find({ category })
      .populate('services', 'name _id');

    if (planes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron planes para esta categoría' });
    }

    res.json(planes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los planes por categoría' });
  }
};
// Obtener los planes populares
exports.getPopularPlans = async (req, res) => {
  try {
    const planes = await Plan.find({ isPopular: true })
      .populate('services', 'name _id');

    if (planes.length === 0) {
      return res.status(404).json({ message: 'No hay planes populares disponibles' });
    }

    res.json(planes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los planes populares' });
  }
};
// Obtener un solo plan por ID
exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
      .populate('services', 'name _id'); // ✅ Solo muestra name e _id
    if (!plan) return res.status(404).json({ error: 'Plan no encontrado' });

    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el plan' });
  }
};

// Actualizar un plan
exports.updatePlan = async (req, res) => {
  try {
    const {
      name,
      category,
      icon,
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
        services,
        minPrice,
        maxPrice,
        currency,
        period,
        isPopular,
        description
      },
      { new: true, runValidators: true }
    ).populate('services');

    if (!planActualizado) return res.status(404).json({ error: 'Plan no encontrado' });

    res.json({ message: 'Plan actualizado correctamente', plan: planActualizado });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el plan' });
  }
};

// Eliminar un plan
exports.deletePlan = async (req, res) => {
  try {
    const planEliminado = await Plan.findByIdAndDelete(req.params.id);
    if (!planEliminado) return res.status(404).json({ error: 'Plan no encontrado' });

    res.json({ message: 'Plan eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el plan' });
  }
};