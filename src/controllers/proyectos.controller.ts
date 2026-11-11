import { Request, Response } from "express";
import mongoose from "mongoose";
import Material from "../models/Material.js";
import Proyecto from "../models/Proyecto.js";
import { PROYECTOS_INICIALES } from "../data/materialesIniciales.js";

export const obtenerProyectos = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        total: PROYECTOS_INICIALES.length,
        proyectos: PROYECTOS_INICIALES,
        modoOffline: true,
      });
    }

    const proyectos = await Proyecto.find().sort({ fecha: -1 });
    const total = proyectos.length;

    return res.json({
      total,
      proyectos,
    });
  } catch (error) {
    console.warn("Error en consulta DB proyectos, usando datos de respaldo:", error);
    return res.json({
      total: PROYECTOS_INICIALES.length,
      proyectos: PROYECTOS_INICIALES,
      modoOffline: true,
    });
  }
};

export const obtenerProyectoPorId = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    if (mongoose.connection.readyState !== 1) {
      const proyecto = PROYECTOS_INICIALES.find(
        (p) => p._id === id || p.nombre === id,
      );
      if (!proyecto) {
        return res.status(404).json({
          mensaje: "No se encontró el proyecto solicitado.",
        });
      }
      return res.json(proyecto);
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        //400 bad request
        mensaje: "El id del proyecto no es válido.",
      });
    }

    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({
        //404 not found
        mensaje: "No se encontró el proyecto solicitado.",
      });
    }

    return res.json(proyecto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      //500 internal server error
      mensaje: "Error al obtener el proyecto.",
    });
  }
};

export const agregarProyecto = async (req: Request, res: Response) => {
  try {
    const { nombre } = req.body || {};

    if (typeof nombre !== "string" || nombre.trim() === "") {
      return res.status(400).json({
        //400 bad request
        mensaje:
          "El campo 'nombre' es obligatorio y debe ser un texto no vacío.",
      });
    }

    const proyecto = await Proyecto.create({
      nombre: nombre.trim(),
      materiales: [],
    });

    return res.status(201).json(proyecto); //201 created
  } catch (error) {
    console.error(error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        //400 bad request
        mensaje: "Los datos del proyecto no son válidos.",
      });
    }

    return res.status(500).json({
      //500 internal server error
      mensaje: "Error al crear el proyecto.",
    });
  }
};

export const agregarMaterialAProyecto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { materialId, cantidadUsada } = req.body || {};

    // Validar ID del proyecto
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        //400 bad request
        mensaje: "El ID del proyecto no es válido.",
      });
    }

    // Validar ID del material
    if (
      typeof materialId !== "string" ||
      !mongoose.isValidObjectId(materialId)
    ) {
      return res.status(400).json({
        //400 bad request
        mensaje: "El ID del material no es válido.",
      });
    }

    // Validar cantidad
    if (
      typeof cantidadUsada !== "number" ||
      !Number.isFinite(cantidadUsada) ||
      cantidadUsada <= 0
    ) {
      return res.status(400).json({
        //400 bad request
        mensaje: "La cantidad utilizada debe ser un número mayor a 0.",
      });
    }

    // Buscar proyecto
    const proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({
        //404 not found
        mensaje: "No se encontró el proyecto solicitado.",
      });
    }

    // Buscar material
    const material = await Material.findById(materialId);

    if (!material) {
      return res.status(404).json({
        //404 not found
        mensaje: "No se encontró el material solicitado.",
      });
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

    return res.status(200).json(proyecto); //200 OK
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      //500 internal server error
      mensaje: "Error al agregar el material al proyecto.",
    });
  }
};
