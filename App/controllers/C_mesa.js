const Mesa = require("../../models/Mesa");

//Crear Mesa
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
// Modificar Mesa
exports.modificarMesa = async (req, res) => {
    try {
        const { id } = req.params;
        const { fechaMesa, horaMesa, banderaBooleana, Materia, Alumno, estadoActual } = req.body;
        
        const mesaModificada = await Mesa.findByIdAndUpdate(
            id,
            { fechaMesa, horaMesa, banderaBooleana, Materia, Alumno, estadoActual },
            { new: true }
        );
        
        if (!mesaModificada) return res.status(404).json({ message: "Mesa no encontrada" });
        
        res.status(200).json({ message: "Mesa actualizada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error al modificar la mesa" });
    }
};

// Dar de baja una Mesa
exports.darDeBajaMesa = async (req, res) => {
    try {
        const { id } = req.params;
        
        const mesaBaja = await Mesa.findByIdAndUpdate(
            id,
            { estadoActual: 'suspendida' },
            { new: true }
        );
        
        if (!mesaBaja) return res.status(404).json({ message: "Mesa no encontrada" });
        
        res.status(200).json({ message: "Mesa dada de baja correctamente" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error al dar de baja la mesa" });
    }
};

// Mostrar mesas suspendidas
exports.mostrarMesasSuspendidas = async (req, res) => {
    try {
        const mesasSuspendidas = await Mesa.find({ estadoActual: 'suspendida' });
        res.status(200).json(mesasSuspendidas);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error al obtener mesas suspendidas" });
    }
};
