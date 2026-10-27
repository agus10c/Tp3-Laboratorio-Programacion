import express from "express";
import path from "path";
import dotenv from "dotenv";
import { conectarDB } from "./config/db.js";
import materialesRoutes from "./routes/materiales.routes.js";
import proyectosRoutes from "./routes/proyectos.routes.js";
dotenv.config();

export const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use("/api/materiales", materialesRoutes);
app.use("/api/proyectos", proyectosRoutes);
app.use(express.static(path.join(process.cwd(), "public")));

async function iniciarServidor() {
  await conectarDB();

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

iniciarServidor();
