import mongoose, { Schema, Document } from "mongoose";

// 1. La interfaz: Le dice a TypeScript qué campos tiene un Material
export interface IMaterial extends Document {
  codigo: string;
  nombre: string;
  categoria: string;
  unidadPresentacion?: string; // El '?' significa que es opcional
  stockInicial: number;
  compras: number;
  enUso: number;
  costoUnitario: number;
  fechaConteo?: string;
  imagen?: string;
  descripcion?: string;
  proyectosAsignados?: string;
}

// 2. El esquema: Le dice a MongoDB cómo guardar y validar los datos
const MaterialSchema: Schema = new Schema({
  codigo: { type: String, required: true, unique: true },
  nombre: { type: String, required: true, unique: true },
  categoria: { type: String, required: true },
  unidadPresentacion: { type: String },
  stockInicial: { type: Number, default: 0, min: 0 },
  compras: { type: Number, default: 0, min: 0 },
  enUso: { type: Number, default: 0, min: 0 },
  costoUnitario: { type: Number, required: true, min: 0 },
  fechaConteo: { type: String },
  imagen: { type: String },
  descripcion: { type: String },
  proyectosAsignados: { type: String },
});

export default mongoose.model<IMaterial>("Material", MaterialSchema);
