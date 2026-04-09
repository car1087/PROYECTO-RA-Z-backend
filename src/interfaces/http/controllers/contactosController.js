class ContactosController {
    constructor(contactosRepository) {
        this.contactosRepository = contactosRepository;
    }

    async createContacto(req, res) {
        try {
            const userId = req.user.id;
            const { nombre, telefono, relacion } = req.body;

            if (!nombre || !telefono || !relacion) {
                return res.status(400).json({ message: 'nombre, telefono y relacion son requeridos', error: 'nombre, telefono y relacion son requeridos' });
            }

            const result = await this.contactosRepository.createContacto({
                nombre,
                telefono,
                relacion,
                user_id: userId
            });

            res.status(201).json({ message: 'Contacto guardado correctamente', id: result.insertId });
        } catch (error) {
            console.error('Error al crear contacto:', error);
            res.status(500).json({ message: 'Error al crear contacto', error: 'Error al crear contacto' });
        }
    }

    async getContactos(req, res) {
        try {
            const userId = req.user.id;
            const contactos = await this.contactosRepository.getContactosByUserId(userId);
            res.json({ contactos });
        } catch (error) {
            console.error('Error al obtener contactos:', error);
            res.status(500).json({ message: 'Error al obtener contactos', error: 'Error al obtener contactos' });
        }
    }
}

module.exports = ContactosController;
