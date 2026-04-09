require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./interfaces/http/routes/auth');
const dashboardRoutes = require('./interfaces/http/routes/dashboard.routes');
const contactosRoutes = require('./interfaces/http/routes/contactosRoutes');
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
const projectRoot = '/Users/user/Desktop/proyecto sena/proyectosena';

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(projectRoot, 'public')));

// Instantiate controllers and repositories
const dashboardRepository = new DashboardRepository();
const dashboardController = new DashboardController(dashboardRepository);
const medicamentosRepository = new MedicamentosRepository();
const medicamentosController = new MedicamentosController(medicamentosRepository);
const enfermedadesBaseRepository = new EnfermedadesBaseRepository();
const enfermedadesBaseController = new EnfermedadesBaseController(enfermedadesBaseRepository);
const alergiasRepository = new AlergiasRepository();
const alergiasController = new AlergiasController(alergiasRepository);

app.get('/', (req, res) => {
    res.sendFile(path.join(projectRoot, 'index.html'), (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error loading index.html');
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', contactosRoutes);

// Ruta pública para perfil público
app.get('/api/perfil-publico/:id', (req, res) => dashboardController.getPerfilPublico(req, res));

// Additional routes for saving medical data
app.put('/api/informacion-medica', authMiddleware, (req, res) => dashboardController.updateInformacionMedica(req, res));
app.post('/api/enfermedades', authMiddleware, (req, res) => enfermedadesBaseController.createEnfermedad(req, res));
app.post('/api/medicamentos', authMiddleware, (req, res) => medicamentosController.createMedicamento(req, res));
app.post('/api/alergias', authMiddleware, (req, res) => alergiasController.createAlergia(req, res));

module.exports = app;