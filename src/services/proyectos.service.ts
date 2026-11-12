import Material from "../models/Material.js";
import Proyecto from "../models/Proyecto.js";
import * as materialesService from "./materiales.service.js";

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
export const agregarProyecto = async (
  nombre: string,
  materiales: Array<{
    material: string;
    cantidadUsada: number;
  }> = [],
  fecha?: Date,
) => {
  // Verificar que existan todos los materiales
  for (const item of materiales) {
    const material = await Material.findById(item.material);

    if (!material) {
      return null;
    }
  }

  // Crear proyecto
  const proyecto = await Proyecto.create({
    nombre: nombre.trim(),
    fecha,
    materiales: materiales.map((item) => ({
      material: item.material,
      cantidadUsada: item.cantidadUsada,
    })),
  });

  // Actualizar cantidad en uso de cada material
  for (const item of materiales) {
    await materialesService.actualizarEnUso(item.material, item.cantidadUsada);
  }

  return proyecto;
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
  await materialesService.actualizarEnUso(materialId, cantidadUsada);

  return proyecto;
};
