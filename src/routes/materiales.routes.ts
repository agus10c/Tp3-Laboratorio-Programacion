import { Router } from "express";
import {
  obtenerMateriales,
  obtenerMaterialPorId,
  actualizarMaterial,
} from "../controllers/materiales.controller";

const router = Router();

router.get("/", obtenerMateriales);

router.get("/:id", obtenerMaterialPorId);

router.put("/:id", actualizarMaterial);

export default router;
