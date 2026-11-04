import { Router } from "express";

import { agregarMaterial } from "../controllers/materiales.controller.js";

import {
  obtenerMateriales,
  obtenerMaterialPorId,
  actualizarMaterial,
} from "../controllers/materiales.controller";

const router = Router();

// GET /api/materiales
router.get("/", obtenerMateriales);

// GET /api/materiales/:id
router.get("/:id", obtenerMaterialPorId);

// POST /api/materiales
router.post("/", agregarMaterial);

// PUT /api/materiales/:id
router.put("/:id", actualizarMaterial);

export default router;
