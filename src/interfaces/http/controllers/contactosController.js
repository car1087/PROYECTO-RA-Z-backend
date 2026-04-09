class ContactosController {
    constructor(contactosRepository) {
        this.contactosRepository = contactosRepository;
    }

    async createContacto(req, res) {
        try {
            const { nombre, telefono, parentesco, user_id } = req.body;

            if (!nombre || !telefono || !parentesco || !user_id) {
                return res.status(400).json({ error: 'nombre, telefono, parentesco y user_id son requeridos' });
            }

            const result = await this.contactosRepository.createContacto({
                nombre,
                telefono,
                parentesco,
                user_id
            });

            res.status(201).json({ message: 'Contacto guardado correctamente', id: result.insertId });
        } catch (error) {
            console.error('Error al crear contacto:', error);
            res.status(500).json({ error: 'Error al crear contacto' });
        }
    }

    async getContactos(req, res) {
        try {
            const userId = req.user.id;
            const contactos = await this.contactosRepository.getContactosByUserId(userId);
            res.json(contactos);
        } catch (error) {
            console.error('Error al obtener contactos:', error);
            res.status(500).json({ error: 'Error al obtener contactos' });
        }
    }
}

module.exports = ContactosController;
