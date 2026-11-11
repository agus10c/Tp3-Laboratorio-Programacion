import { Router } from "express";
import {
  obtenerProyectos,
  obtenerProyectoPorId,
  agregarProyecto,
  agregarMaterialAProyecto,
} from "../controllers/proyectos.controller.js";

const router = Router();

// GET /api/proyectos?cantidad=10&from=0
router.get("/", obtenerProyectos);

// GET /api/proyectos/:id
router.get("/:id", obtenerProyectoPorId);

// POST /api/proyectos
router.post("/", agregarProyecto);

// POST /api/proyectos/:id/materiales
router.post("/:id/materiales", agregarMaterialAProyecto);

export default router;
