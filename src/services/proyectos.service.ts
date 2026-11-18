import Material from "../models/Material.js";
import Proyecto from "../models/Proyecto.js";

// Obtener todos los proyectos
export const obtenerProyectos = async () => {
  const proyectos = await Proyecto.find().sort({ fecha: -1 });

  return {
    total: proyectos.length,
    proyectos,
  };
};

// Obtener un proyecto por ID
export const obtenerProyectoPorId = async (id: string) => {
  return await Proyecto.findById(id);
};

// Agregar un proyecto
export const agregarProyecto = async (nombre: string) => {
  return await Proyecto.create({
    nombre: nombre.trim(),
    materiales: [],
  });
};

// Agregar un material a un proyecto
export const agregarMaterialAProyecto = async (
  id: string,
  materialId: string,
  cantidadUsada: number,
) => {
  // Buscar proyecto
  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    return null;
  }

  // Buscar material
  const material = await Material.findById(materialId);

  if (!material) {
    return null;
  }

  // Agregar material al proyecto
  proyecto.materiales.push({
    material: material._id,
    cantidadUsada,
  });

  await proyecto.save();

  // Actualizar cantidad en uso del material
  await Material.findByIdAndUpdate(materialId, {
    $inc: { enUso: cantidadUsada },
  });

  return proyecto;
};
