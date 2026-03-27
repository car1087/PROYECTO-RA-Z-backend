const express = require('express');
const authRoutes = require('../interfaces/http/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Tus rutas principales van aquí
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));