import { Request, Response } from "express";
import mongoose from "mongoose";
import Material from "../models/Material.js";
import { MATERIALES_INICIALES } from "../data/materialesIniciales.js";

const CAMPOS_NUMERICOS = [
  "stockInicial",
  "compras",
  "enUso",
  "costoUnitario",
] as const;

export const obtenerMateriales = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        total: MATERIALES_INICIALES.length,
        materiales: MATERIALES_INICIALES,
        modoOffline: true,
      });
    }

    const materiales = await Material.find();
    const total = materiales.length;

    return res.json({
      total,
      materiales,
    });
  } catch (error) {
    console.warn("Error en consulta DB, usando datos de respaldo:", error);
    return res.json({
      total: MATERIALES_INICIALES.length,
      materiales: MATERIALES_INICIALES,
      modoOffline: true,
    });
  }
};

export const obtenerMaterialPorId = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    if (mongoose.connection.readyState !== 1) {
      const material = MATERIALES_INICIALES.find(
        (m) =>
          m._id === id ||
          m.codigo.toLowerCase() === id.toLowerCase() ||
          m.nombre.toLowerCase() === id.toLowerCase(),
      );

      if (!material) {
        return res.status(404).json({
          mensaje: "No se encontró el material solicitado.",
        });
      }

      return res.json(material);
    }

    let material = null;

    if (mongoose.isValidObjectId(id)) {
      material = await Material.findById(id);
    } else {
      material = await Material.findOne({ codigo: id });
    }

    if (!material) {
      // Buscar en datos iniciales como fallback
      const fallback = MATERIALES_INICIALES.find(
        (m) =>
          m._id === id ||
          m.codigo.toLowerCase() === id.toLowerCase() ||
          m.nombre.toLowerCase() === id.toLowerCase(),
      );
      if (fallback) return res.json(fallback);

      return res.status(404).json({
        mensaje: "No se encontró el material solicitado.",
      });
    }

    return res.json(material);
  } catch (error) {
    console.error(error);
    const id = String(req.params.id);
    const fallback = MATERIALES_INICIALES.find(
      (m) =>
        m._id === id ||
        m.codigo.toLowerCase() === id.toLowerCase(),
    );
    if (fallback) return res.json(fallback);

    return res.status(500).json({
      mensaje: "Error al obtener el material.",
    });
  }
};

export const actualizarMaterial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
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

    const material = await Material.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

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

    const nuevoMaterial = await Material.create(body);
    return res.status(201).json(nuevoMaterial);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      mensaje: "Error al crear el material.",
    });
  }
};
