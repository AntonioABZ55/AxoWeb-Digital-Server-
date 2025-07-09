const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { name, lastname, email, password, phone, company } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'El correo ya está registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      lastname,
      email,
      password: hashedPassword,
      phone,
      company
    });

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el registro' });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: user._id, email: user.email, typeUser: user.typeUser },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Obtener perfil
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Actualizar datos de usuario
exports.updateUser = async (req, res) => {
  try {
    const { name, lastname, phone, company } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, lastname, phone, company },
      { new: true }
    ).select('-password');

    res.json({ message: 'Usuario actualizado', user });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Se requieren ambas contraseñas' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Contraseña actual incorrecta' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cambiar contraseña' });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cuenta' });
  }
};





