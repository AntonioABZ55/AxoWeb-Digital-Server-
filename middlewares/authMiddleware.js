const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "Acceso denegado. No hay token." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ msg: "Usuario no encontrado." });
    }

    next();
  } catch (error) {
    res.status(401).json({ msg: "Token no válido." });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.typeUser !== "administrador") {
    return res.status(403).json({ msg: "No tienes permisos para esta acción." });
  }
  next();
};

module.exports = { authMiddleware, isAdmin };