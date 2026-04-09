const express = require('express');
const DashboardController = require('../controllers/dashboardController');
const DashboardRepository = require('../../../infrastructure/repositories/dashboardRepository');
const MedicamentosController = require('../controllers/medicamentosController');
const MedicamentosRepository = require('../../../infrastructure/repositories/medicamentosRepository');
const DatosPersonalesController = require('../controllers/datosPersonalesController');
const DatosPersonalesRepository = require('../../../infrastructure/repositories/datosPersonalesRepository');
const EnfermedadesBaseController = require('../controllers/enfermedadesBaseController');
const EnfermedadesBaseRepository = require('../../../infrastructure/repositories/enfermedadesBaseRepository');
const AlergiasController = require('../controllers/alergiasController');
const AlergiasRepository = require('../../../infrastructure/repositories/alergiasRepository');
const ContactosController = require('../controllers/contactosController');
const ContactosRepository = require('../../../infrastructure/repositories/contactosRepository');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const dashboardRepository = new DashboardRepository();
const dashboardController = new DashboardController(dashboardRepository);
const medicamentosRepository = new MedicamentosRepository();
const medicamentosController = new MedicamentosController(medicamentosRepository);
const datosPersonalesRepository = new DatosPersonalesRepository();
const datosPersonalesController = new DatosPersonalesController(datosPersonalesRepository);
const enfermedadesBaseRepository = new EnfermedadesBaseRepository();
const enfermedadesBaseController = new EnfermedadesBaseController(enfermedadesBaseRepository);
const alergiasRepository = new AlergiasRepository();
const alergiasController = new AlergiasController(alergiasRepository);
const contactosRepository = new ContactosRepository();
const contactosController = new ContactosController(contactosRepository);

// Proteger todas las rutas del dashboard con el middleware de autenticación
router.use(authMiddleware);

// Rutas de información médica
router.get('/informacion-medica',
    (req, res) => dashboardController.getInformacionMedica(req, res)
);

router.post('/informacion-medica',
    (req, res) => dashboardController.updateInformacionMedica(req, res)
);

// Rutas de contactos de emergencia
router.get('/contactos-emergencia',
    (req, res) => dashboardController.getContactosEmergencia(req, res)
);

router.get('/contactos',
    (req, res) => contactosController.getContactos(req, res)
);

router.post('/contactos-emergencia',
    (req, res) => dashboardController.createContactoEmergencia(req, res)
);

// Rutas de datos personales
router.get('/datos-personales',
    (req, res) => datosPersonalesController.getDatosPersonales(req, res)
);

router.post('/datos-personales',
    (req, res) => datosPersonalesController.saveDatosPersonales(req, res)
);

// Rutas de medicamentos
router.get('/medicamentos',
    (req, res) => medicamentosController.getMedicamentos(req, res)
);

router.post('/medicamentos',
    (req, res) => medicamentosController.createMedicamento(req, res)
);

router.put('/medicamentos/:id',
    (req, res) => medicamentosController.updateMedicamento(req, res)
);

router.delete('/medicamentos/:id',
    (req, res) => medicamentosController.deleteMedicamento(req, res)
);

// Rutas de enfermedades base
router.get('/enfermedades-base',
    (req, res) => enfermedadesBaseController.getEnfermedades(req, res)
);

router.post('/enfermedades-base',
    (req, res) => enfermedadesBaseController.createEnfermedad(req, res)
);

router.put('/enfermedades-base/:id',
    (req, res) => enfermedadesBaseController.updateEnfermedad(req, res)
);
router.delete('/enfermedades-base/:id',
    (req, res) => enfermedadesBaseController.deleteEnfermedad(req, res)
);

// Rutas de alergias
router.get('/alergias',
    (req, res) => alergiasController.getAlergias(req, res)
);

router.put('/alergias/:id',
    (req, res) => alergiasController.updateAlergia(req, res)
);
router.post('/alergias',
    (req, res) => alergiasController.createAlergia(req, res)
);

router.delete('/alergias/:id',
    (req, res) => alergiasController.deleteAlergia(req, res)
);

module.exports = router;