import { Request, Response } from "express";
import Material from "../models/Material.js";

export const obtenerMateriales = async (req: Request, res: Response) => {
  try {
    const cantidad = parseInt(req.query.cantidad as string) || 10;
    const desde = parseInt(req.query.from as string) || 0;

    const materiales = await Material.find()
      .skip(desde) // Saltea los primeros "desde" registros
      .limit(cantidad); // Trae solo "cantidad" registros

    const total = await Material.countDocuments(); // Cuantos hay en total

    res.json({
      total,
      cantidad,
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
