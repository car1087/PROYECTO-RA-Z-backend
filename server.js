const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// RUTA DE PRUEBA (Puesta arriba de todo para que no falle)
app.get("/test", (req, res) => {
  res.json({ status: "ok", mensaje: "Conexión exitosa con Carlos" });
});

// Ruta principal
app.get("/", (req, res) => {
  res.send("Servidor Backend de Carlos funcionando correctamente!");
});

// Intento de cargar rutas (si falla, el servidor seguirá vivo por las rutas de arriba)
try {
    // Prueba con esta ruta si el archivo está en la raíz según tu foto
    const authRoutes = require('./authRoutes'); 
    app.use('/api/auth', authRoutes);
} catch (e) {
    console.log("Aún no se encuentra el archivo authRoutes, pero el test funcionará.");
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});