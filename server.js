const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// 1. RUTA DE PRUEBA (Prioritaria)
app.get("/test", (req, res) => {
  res.json({ status: "ok", mensaje: "Conexión exitosa con Carlos" });
});

// 2. Ruta principal
app.get("/", (req, res) => {
  res.send("Servidor Backend de Carlos funcionando correctamente!");
});

// 3. Intento de cargar rutas de autenticación
try {
    // Si tu archivo authRoutes.js está en la raíz, esta ruta es correcta
    const authRoutes = require('./authRoutes'); 
    app.use('/api/auth', authRoutes);
} catch (e) {
    console.log("Archivo authRoutes no encontrado, pero el servidor sigue vivo.");
}

// 4. Configuración del puerto para Railway
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});