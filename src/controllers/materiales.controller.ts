import { Request, Response } from "express";
import Material from "../models/Material.js";

//obtener todos los materiales
export const obtenerMateriales = async (req: Request, res: Response) => {
  try {
    const desde = parseInt(req.query.from as string) || 0;

    // Si viene "cantidad", la usamos. Si no viene, es null.
    const cantidad = req.query.cantidad
      ? parseInt(req.query.cantidad as string)
      : null;

    let query = Material.find().skip(desde);

    // Solo aplicamos el límite si el usuario mandó "cantidad"
    if (cantidad !== null && !isNaN(cantidad)) {
      query = query.limit(cantidad);
    }

    const materiales = await query;
    const total = await Material.countDocuments();

    res.json({
      total,
      cantidad: cantidad !== null ? cantidad : "todas",
      desde,
      materiales,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los materiales", error });
  }
};

// obtener un material por id
export const obtenerMaterialPorId = async (req: Request, res: Response) => {};

// modificar material
export const actualizarMaterial = async (req: Request, res: Response) => {};

export const agregarMaterial = async (req: Request, res: Response) => {
  try {
    const nuevoMaterial = await Material.create(req.body);
    // 201 significa "Created" (Creado exitosamente)
    res.status(201).json(nuevoMaterial);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al crear el material. Verificá los datos enviados.",
      error,
    });
  }
};
