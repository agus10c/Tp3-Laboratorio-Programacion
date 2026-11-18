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

// Actualizar un material
export const actualizarMaterial = async (id: string, body: any) => {
  return await Material.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
};

// Agregar un material
export const agregarMaterial = async (body: any) => {
  return await Material.create(body);
};
