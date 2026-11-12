import { Request, Response } from "express";
import mongoose from "mongoose";
import * as proyectosService from "../services/proyectos.service.js";

// Obtener todos los proyectos
export const obtenerProyectos = async (req: Request, res: Response) => {
  try {
    const resultado = await proyectosService.obtenerProyectos();

    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al obtener los proyectos:", error);

    return res.status(500).json({
      mensaje: "Error al obtener los proyectos.",
    });
  }
};

// Obtener un proyecto por ID
export const obtenerProyectoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensaje: "El id del material no es válido.",
      });
    }

    const proyecto = await proyectosService.obtenerProyectoPorId(id);

    if (!proyecto) {
      return res.status(404).json({
        mensaje: "No se encontró el proyecto solicitado.",
      });
    }

    return res.status(200).json(proyecto);
  } catch (error) {
    console.error("Error al obtener el proyecto:", error);

    return res.status(500).json({
      mensaje: "Error al obtener el proyecto.",
    });
  }
};

// Agregar un proyecto
export const agregarProyecto = async (req: Request, res: Response) => {
  try {
    const { nombre, materiales, fecha } = req.body;

    // Validar nombre
    if (typeof nombre !== "string" || !nombre.trim()) {
      return res.status(400).json({
        mensaje: "El nombre del proyecto es obligatorio.",
      });
    }

    // Validar fecha
    if (
      fecha !== undefined &&
      (typeof fecha !== "string" || !Number.isFinite(Date.parse(fecha)))
    ) {
      return res.status(400).json({
        mensaje: "La fecha del proyecto no es válida.",
      });
    }

    // Validar materiales
    if (!Array.isArray(materiales)) {
      return res.status(400).json({
        mensaje: "Los materiales deben enviarse en un array.",
      });
    }

    // Validar cada material
    for (const item of materiales) {
      if (
        !item ||
        typeof item.material !== "string" ||
        !mongoose.isValidObjectId(item.material)
      ) {
        return res.status(400).json({
          mensaje: "El ID de uno de los materiales no es válido.",
        });
      }

      if (
        typeof item.cantidadUsada !== "number" ||
        !Number.isFinite(item.cantidadUsada) ||
        item.cantidadUsada <= 0
      ) {
        return res.status(400).json({
          mensaje: "La cantidad utilizada debe ser un número mayor a cero.",
        });
      }
    }

    const proyecto = await proyectosService.agregarProyecto(
      nombre,
      materiales,
      fecha !== undefined ? new Date(fecha) : undefined,
    );

    if (!proyecto) {
      return res.status(404).json({
        mensaje: "No se encontró uno de los materiales solicitados.",
      });
    }

    return res.status(201).json(proyecto);
  } catch (error) {
    console.error("Error al agregar el proyecto:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        mensaje: error.message,
      });
    }

    return res.status(500).json({
      mensaje: "Error al agregar el proyecto.",
    });
  }
};

// Agregar un material a un proyecto
export const agregarMaterialAProyecto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { materialId, cantidadUsada } = req.body;

    // Validar ID del proyecto
    if (typeof id !== "string" || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        mensaje: "El id del material no es válido.",
      });
    }

    // Validar ID del material
    if (
      typeof materialId !== "string" ||
      !mongoose.isValidObjectId(materialId)
    ) {
      return res.status(400).json({
        mensaje: "El ID del material no es válido.",
      });
    }

    // Validar cantidad utilizada
    if (
      typeof cantidadUsada !== "number" ||
      !Number.isFinite(cantidadUsada) ||
      cantidadUsada <= 0
    ) {
      return res.status(400).json({
        mensaje: "La cantidad utilizada debe ser un número mayor a cero.",
      });
    }

    const proyecto = await proyectosService.agregarMaterialAProyecto(
      id,
      materialId,
      cantidadUsada,
    );

    if (!proyecto) {
      return res.status(404).json({
        mensaje: "No se encontró el proyecto o el material solicitado.",
      });
    }

    return res.status(200).json(proyecto);
  } catch (error) {
    console.error("Error al agregar el material al proyecto:", error);

    return res.status(500).json({
      mensaje: "Error al agregar el material al proyecto.",
    });
  }
};
