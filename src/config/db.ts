import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/stock_construccion";

export const conectarDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log("Conectado a MongoDB exitosamente");
  } catch (error) {
    console.warn(
      "⚠️ Advertencia: No se pudo conectar a MongoDB. El servidor funcionará en modo offline con datos de respaldo.",
    );
  }
};
