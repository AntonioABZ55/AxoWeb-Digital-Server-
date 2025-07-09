const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");


// Rutas
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const planRoutes= require("./routes/planRoutes");

// Configurar variables de entorno
dotenv.config();
console.log("MONGODB_URI:", process.env.MONGODB_URI);

const passport = require("passport");
require("./config/passport"); // ← Configuración de estrategia Google

// Conectar a MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar Passport (sin sesiones)
app.use(passport.initialize());

// Rutas
app.use("/api/users", userRoutes);    // Registro, login, perfil, etc.
app.use("/auth", authRoutes);         // Google OAuth
app.use("/api/services", serviceRoutes); // ✅ Servicios (solo admins)
app.use("/api/plans", planRoutes); // Planes 

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Bienvenido al backend de AxoWeb Digital");
});

// Manejo básico de errores (opcional)
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

