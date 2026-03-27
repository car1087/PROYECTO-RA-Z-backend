const express = require('express');
const cors = require('cors');
const authRoutes = require('../interfaces/http/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

// Configuración de CORS (Vital para Vercel)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Reemplaza en Railway con la URL de Vercel
  credentials: true, // Permite el paso de la cookie del token
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Tus rutas principales van aquí
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));