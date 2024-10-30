const Mesa = require("../../models/Mesa");

exports.crearMesa = async (req, res) => {
    try {
        const {
            fechaMesa,
            horaMesa,
            banderaBooleana,
            Materia,
            Alumno,
            estadoActual
        } = req.body;

        const nuevaMesa = new Mesa({
            fechaMesa,
            horaMesa,
            banderaBooleana,
            Materia,
            Alumno: Alumno || [],  
            estadoActual: estadoActual || 'activa'
        });

        await nuevaMesa.save();
        res.status(201).json({ message: "Mesa agregada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error al agregar mesa" });
    }
};