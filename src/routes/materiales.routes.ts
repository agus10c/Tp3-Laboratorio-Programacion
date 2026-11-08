import { Router } from "express";
import {
  agregarMaterial,
  actualizarMaterial,
  obtenerMateriales,
  obtenerMaterialPorId,
} from "../controllers/materiales.controller.js";

const router = Router();

// GET /api/materiales?cantidad=10&from=0
router.get("/", obtenerMateriales);

// GET /api/materiales/:id
router.get("/:id", obtenerMaterialPorId);

// POST /api/materiales
router.post("/", agregarMaterial);

// PUT /api/materiales/:id
router.put("/:id", actualizarMaterial);

export default router;
