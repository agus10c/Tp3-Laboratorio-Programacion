import { Request, Response } from "express";
import mongoose from "mongoose";
import * as materialesService from "../services/materiales.service.js";

const CAMPOS_NUMERICOS = [
  "stockInicial",
  "compras",
  "enUso",
  "costoUnitario",
] as const;

// Obtener todos los materiales
export const obtenerMateriales = async (req: Request, res: Response) => {
  try {
    const datos = await materialesService.obtenerMateriales();

    return res.json(datos);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al obtener los materiales.",
    });
  }
};

// Obtener un material por ID
export const obtenerMaterialPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensaje: "El id del material no es válido.",
      });
    }

    const material = await materialesService.obtenerMaterialPorId(id);

    if (!material) {
      return res.status(404).json({
        mensaje: "No se encontró el material solicitado.",
      });
    }

    return res.json(material);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al obtener el material.",
    });
  }
};

// Actualizar un material
export const actualizarMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensaje: "El id del material no es válido.",
      });
    }

    for (const campo of CAMPOS_NUMERICOS) {
      const valor = body[campo];

      if (valor !== undefined && (!Number.isFinite(valor) || valor < 0)) {
        return res.status(400).json({
          mensaje: `El campo '${campo}' debe ser un número mayor o igual a 0.`,
        });
      }
    }

    const material = await materialesService.actualizarMaterial(id, body);

    if (!material) {
      return res.status(404).json({
        mensaje: "No se encontró el material solicitado.",
      });
    }

    return res.json(material);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al actualizar el material.",
    });
  }
};

// Agregar un material
export const agregarMaterial = async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const { codigo, nombre, categoria } = body;

    if (typeof codigo !== "string" || codigo.trim() === "") {
      return res.status(400).json({
        mensaje: "El campo 'codigo' es obligatorio.",
      });
    }

    if (typeof nombre !== "string" || nombre.trim() === "") {
      return res.status(400).json({
        mensaje: "El campo 'nombre' es obligatorio.",
      });
    }

    if (typeof categoria !== "string" || categoria.trim() === "") {
      return res.status(400).json({
        mensaje: "El campo 'categoria' es obligatorio.",
      });
    }

    for (const campo of CAMPOS_NUMERICOS) {
      const valor = body[campo];

      if (valor !== undefined && (!Number.isFinite(valor) || valor < 0)) {
        return res.status(400).json({
          mensaje: `El campo '${campo}' debe ser un número mayor o igual a 0.`,
        });
      }
    }

    const nuevoMaterial = await materialesService.agregarMaterial(body);

    return res.status(201).json(nuevoMaterial);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al crear el material.",
    });
  }
};
