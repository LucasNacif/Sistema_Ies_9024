const Mesa = require("../../models/Mesa");
const Materia = require("../../models/Materia");

//Crear Mesa
exports.crearMesa = async (req, res) => {
    try {
        const {
            fechaMesa,
            horaMesa,
            Materia
        } = req.body;

        const nuevaMesa = new Mesa({
            fechaMesa,
            horaMesa,
            Materia,
            Alumno: [],
            estadoActual: 'activa'
        });

        await nuevaMesa.save();
        res.status(201).json({
            success: true,
            message: "Mesa creada exitosamente"
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Error al crear la mesa"
        });
    }
};
// Modificar Mesa
exports.modificarMesa = async (req, res) => {
    try {
        const { id } = req.params;
        const { fechaMesa, horaMesa, Materia, estadoActual } = req.body;

        const mesaModificada = await Mesa.findByIdAndUpdate(
            id,
            { fechaMesa, horaMesa, Materia, estadoActual },
            { new: true }
        );

        if (!mesaModificada) return res.status(404).json({ message: "Mesa no encontrada" });

        res.status(200).json({ message: "Mesa actualizada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error al modificar la mesa" });
    }
};
//Obtener Mesas
exports.obtenerMesa = async (req, res) => {
    try {
        const mesasActivas = await Mesa.find().populate("Materia").populate('Alumno');
        const materiasDiponibles = await Materia.find();

        res.status(200).render("Admin_Mesa", { mesasActivas, materiasDiponibles })
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error al obtener mesas activas" });
    }
}