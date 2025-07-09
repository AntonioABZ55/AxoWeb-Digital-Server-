// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB conectado");
    } catch (error) {
        console.error("Error de conexión a MongoDB", error);
        process.exit(1); // Salir del proceso con un error
    }
};

module.exports = connectDB;