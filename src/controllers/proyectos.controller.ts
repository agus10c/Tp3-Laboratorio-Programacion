import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  obtenerProyectos as obtenerProyectosService,
  obtenerProyectoPorId as obtenerProyectoPorIdService,
  agregarProyecto as agregarProyectoService,
  agregarMaterialAProyecto as agregarMaterialAProyectoService,
} from "../services/proyectos.service.js";

// Obtener todos los proyectos
export const obtenerProyectos = async (req: Request, res: Response) => {
  try {
    const resultado = await obtenerProyectosService();

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

    const proyecto = await obtenerProyectoPorIdService(id);

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
    const { nombre } = req.body;

    // Validar nombre
    if (typeof nombre !== "string" || !nombre.trim()) {
      return res.status(400).json({
        mensaje: "El nombre del proyecto es obligatorio.",
      });
    }

    const proyecto = await agregarProyectoService(nombre);

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

    const proyecto = await agregarMaterialAProyectoService(
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
