import { Router } from "express";
import {
  obtenerProyectos,
  obtenerProyectoPorId,
  agregarProyecto,
} from "../controllers/proyectos.controller";

const router = Router();

router.get("/", obtenerProyectos);

router.get("/:id", obtenerProyectoPorId);

router.put("/:id", agregarProyecto);

export default router;
