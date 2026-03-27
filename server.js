const express = require('express');
const cors = require('cors');

// Ruta corregida según tu estructura de carpetas
const authRoutes = require('./src/interfaces/http/routes/authRoutes');

const app = express();

// 1. Configuración de CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// 2. Tus rutas
app.use('/api/auth', authRoutes);

// 3. Ruta de prueba
app.get("/test", (req, res) => {
  res.json({ status: "ok" });
});

// 4. Ruta principal
app.get("/", (req, res) => {
  res.send("Servidor Backend de Carlos funcionando!");
});

// 5. Puerto dinámico para Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});