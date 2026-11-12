import mongoose, { Schema, Document } from "mongoose";

export interface IProyecto extends Document {
  nombre: string;
  fecha: Date;
  materiales: Array<{
    material: mongoose.Types.ObjectId;
    cantidadUsada: number;
  }>;
}

const ProyectoSchema: Schema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    fecha: { type: Date, default: Date.now },
    materiales: [
      {
        material: {
          type: Schema.Types.ObjectId,
          ref: "Material",
          required: true,
        },
        cantidadUsada: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    default: [],
  },
  {
    versionKey: false,
  },
);

export default mongoose.model<IProyecto>("Proyecto", ProyectoSchema);
