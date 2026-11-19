import Material from "../models/Material.js";

// Obtener todos los materiales
export const obtenerMateriales = async () => {
  const materiales = await Material.find();

  return {
    total: materiales.length,
    materiales,
  };
};

// Obtener un material por ID
export const obtenerMaterialPorId = async (id: string) => {
  return await Material.findById(id);
};

// Crea un material en la base de datos
export const crearMaterial = async (body: any) => {
  return await Material.create(body);
};

// Actualizar un material
export const actualizarMaterial = async (id: string, body: any) => {
  return await Material.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
};

// Actualizar cantidad en uso de un material
export const actualizarEnUso = async (id: string, cantidad: number) => {
  return await Material.findByIdAndUpdate(
    id,
    {
      $inc: { enUso: cantidad },
    },
    {
      new: true,
      runValidators: true,
    },
  );
};
