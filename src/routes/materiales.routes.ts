import { Router } from "express";
import {
  crearMaterial,
  actualizarMaterial,
  obtenerMateriales,
  obtenerMaterialPorId,
} from "../controllers/materiales.controller.js";

const router = Router();

// GET /api/materiales
router.get("/", obtenerMateriales);

// GET /api/materiales/:id
router.get("/:id", obtenerMaterialPorId);

// POST /api/materiales
router.post("/", crearMaterial);

// PUT /api/materiales/:id
router.put("/:id", actualizarMaterial);

export default router;
