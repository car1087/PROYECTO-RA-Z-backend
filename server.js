const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.get("/test", (req, res) => {
  res.json({ status: "ok", mensaje: "Conexión exitosa con Carlos" });
});

app.get("/", (req, res) => {
  res.send("Servidor Backend de Carlos funcionando correctamente!");
});

try {
    const authRoutes = require('./authRoutes'); 
    app.use('/api/auth', authRoutes);
} catch (e) {
    console.log("Archivo authRoutes no encontrado, pero el servidor sigue vivo.");
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});