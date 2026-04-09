require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./interfaces/http/routes/auth');
const dashboardRoutes = require('./interfaces/http/routes/dashboard.routes');
const authMiddleware = require('./interfaces/http/middlewares/authMiddleware');

const DashboardController = require('./interfaces/http/controllers/dashboardController');
const DashboardRepository = require('./infrastructure/repositories/dashboardRepository');

const MedicamentosController = require('./interfaces/http/controllers/medicamentosController');
const MedicamentosRepository = require('./infrastructure/repositories/medicamentosRepository');

const EnfermedadesBaseController = require('./interfaces/http/controllers/enfermedadesBaseController');
const EnfermedadesBaseRepository = require('./infrastructure/repositories/enfermedadesBaseRepository');

const AlergiasController = require('./interfaces/http/controllers/alergiasController');
const AlergiasRepository = require('./infrastructure/repositories/alergiasRepository');

const app = express();

// 🔥 CORS dinámico (IMPORTANTE)
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

app.use(express.json());

// Instancias
const dashboardRepository = new DashboardRepository();
const dashboardController = new DashboardController(dashboardRepository);

const medicamentosRepository = new MedicamentosRepository();
const medicamentosController = new MedicamentosController(medicamentosRepository);

const enfermedadesBaseRepository = new EnfermedadesBaseRepository();
const enfermedadesBaseController = new EnfermedadesBaseController(enfermedadesBaseRepository);

const alergiasRepository = new AlergiasRepository();
const alergiasController = new AlergiasController(alergiasRepository);

// Ruta test
app.get('/', (req, res) => {
  res.json({ mensaje: "API funcionando 🚀" });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/perfil-publico/:id', (req, res) => dashboardController.getPerfilPublico(req, res));

app.put('/api/informacion-medica', authMiddleware, (req, res) => dashboardController.updateInformacionMedica(req, res));
app.post('/api/enfermedades', authMiddleware, (req, res) => enfermedadesBaseController.createEnfermedad(req, res));
app.post('/api/medicamentos', authMiddleware, (req, res) => medicamentosController.createMedicamento(req, res));
app.post('/api/alergias', authMiddleware, (req, res) => alergiasController.createAlergia(req, res));
app.post('/api/contactos', authMiddleware, (req, res) => dashboardController.createContactoEmergencia(req, res));

// Puerto dinámico (clave en Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});