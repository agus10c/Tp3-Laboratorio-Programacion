import mongoose from "mongoose";
import dotenv from "dotenv";
import Material from "../models/Material.js";
import Proyecto from "../models/Proyecto.js";
import { conectarDB } from "../config/db.js";

dotenv.config();

const MATERIALES_INICIALES = [
  {
    codigo: "MAT-EPS-12020",
    nombre: "EPS X 120-20",
    categoria: "Aislaciones Térmicas",
    stockInicial: 300,
    compras: 50,
    enUso: 120,
    costoUnitario: 18500,
    fechaConteo: "25/09/2026",
    ubicacion: "Pasillo A - Estantería 01",
    unidadPresentacion: "Placa (120 x 20 mm - Espesor 20 mm)",
    unidadCorta: "placas",
    imagen: "img/EPS X 120-20.jpg",
    descripcion:
      "Placa de Poliestireno Expandido (EPS) de alta densidad para aislación térmica y acústica. Brinda máxima eficiencia energética en muros perimetrales y techos livianos, con absorción nula de humedad.",
    proyectosAsignados: "Proyecto A (70 u) · Proyecto C (50 u)",
  },
  {
    codigo: "MAT-EPS-09220",
    nombre: "EPS X 92-20",
    categoria: "Aislaciones Térmicas",
    stockInicial: 350,
    compras: 70,
    enUso: 150,
    costoUnitario: 14200,
    fechaConteo: "25/09/2026",
    ubicacion: "Pasillo A - Estantería 02",
    unidadPresentacion: "Placa (92 x 20 mm - Espesor 20 mm)",
    unidadCorta: "placas",
    imagen: "img/EPS X 92-20.webp",
    descripcion:
      "Placa de EPS dimensionada para tabiquería interior en steel framing y dry-wall. Optimiza los tiempos de montaje sin requerir cortes adicionales entre perfiles galvanizados.",
    proyectosAsignados: "Proyecto B (90 u) · Proyecto C (60 u)",
  },
  {
    codigo: "MAT-OSB-0950U",
    nombre: "OSB 9,5 X U",
    categoria: "Paneles Estructurales",
    stockInicial: 150,
    compras: 30,
    enUso: 65,
    costoUnitario: 28900,
    fechaConteo: "26/09/2026",
    ubicacion: "Sector B - Racks de Placas 01",
    unidadPresentacion: "Placa / Unidad (1.22 m x 2.44 m x 9.5 mm)",
    unidadCorta: "unidades",
    imagen: "img/OSB 9,5 X U.webp",
    descripcion:
      "Tablero estructural de virutas de madera orientadas (OSB) de 9.5 mm. Ideal para rigidización y arriostramiento en diafragmas verticales, cerramientos perimetrales y cielorrasos.",
    proyectosAsignados: "Proyecto A (40 u) · Proyecto B (25 u)",
  },
  {
    codigo: "MAT-OSB-1810U",
    nombre: "OSB 18,1 X U",
    categoria: "Paneles Estructurales",
    stockInicial: 80,
    compras: 15,
    enUso: 40,
    costoUnitario: 46700,
    fechaConteo: "26/09/2026",
    ubicacion: "Sector B - Racks de Placas 02",
    unidadPresentacion: "Placa / Unidad (1.22 m x 2.44 m x 18.1 mm)",
    unidadCorta: "unidades",
    imagen: "img/OSB 18,1 X U.webp",
    descripcion:
      "Tablero estructural de gran espesor y resistencia mecánica superior. Diseñado específicamente para soporte de cargas pesadas en entrepisos transitables y bases de techo estructural.",
    proyectosAsignados: "Proyecto B (30 u) · Proyecto C (10 u)",
  },
  {
    codigo: "MAT-ADH-VIN20",
    nombre: "ADHESIVO VINÍLICO X 20 KG",
    categoria: "Adhesivos y Selladores",
    stockInicial: 40,
    compras: 10,
    enUso: 18,
    costoUnitario: 52000,
    fechaConteo: "27/09/2026",
    ubicacion: "Sector C - Químicos y Pastas",
    unidadPresentacion: "Balde x 20 kg",
    unidadCorta: "baldes",
    imagen: "img/ADHESIVO VINÍLICO X 20 KG.webp",
    descripcion:
      "Adhesivo vinílico concentrado base acuosa de alta viscosidad y rápido agarre inicial, formulado para encolado estructural de paneles de madera, machimbre y tableros OSB.",
    proyectosAsignados: "Proyecto A (10 baldes) · Proyecto C (8 baldes)",
  },
  {
    codigo: "MAT-ADH-POLIK",
    nombre: "Adhesivo poliuretánico POLIKAL",
    categoria: "Adhesivos y Selladores",
    stockInicial: 70,
    compras: 15,
    enUso: 30,
    costoUnitario: 16500,
    fechaConteo: "27/09/2026",
    ubicacion: "Sector C - Estantería 03",
    unidadPresentacion: "Envase / Pote x 1 kg",
    unidadCorta: "envases",
    imagen: "img/Adhesivo poliuretánico POLIKAL.jpg",
    descripcion:
      "Adhesivo monocomponente a base de poliuretano reactivo POLIKAL de altísimo poder ligante. Clasificación D4 resistente al agua, intemperie y vibraciones mecánicas continuas.",
    proyectosAsignados: "Proyecto A (15 u) · Proyecto B (15 u)",
  },
  {
    codigo: "MAT-FIJ-SHS35",
    nombre: "SHS 3,5-40 x 50U",
    categoria: "Fijaciones y Tornillería",
    stockInicial: 500,
    compras: 100,
    enUso: 220,
    costoUnitario: 4200,
    fechaConteo: "28/09/2026",
    ubicacion: "Pasillo D - Gaveta 12",
    unidadPresentacion: "Caja x 50 unidades",
    unidadCorta: "cajas",
    imagen: "img/SHS 3,5-40 x 50U.avif",
    descripcion:
      "Tornillos autoperforantes y autorroscantes fosfatizados punta aguja de 3,5 mm x 40 mm con cabeza trompeta, diseñados para fijación precisa de placas a perfilería de chapa liviana.",
    proyectosAsignados: "Proyecto A (100 cj) · Proyecto B (70 cj) · Proyecto C (50 cj)",
  },
  {
    codigo: "MAT-FIJ-SNK61",
    nombre: "SNK/HBS 6-100 x 100U",
    categoria: "Fijaciones y Tornillería",
    stockInicial: 250,
    compras: 60,
    enUso: 90,
    costoUnitario: 9800,
    fechaConteo: "28/09/2026",
    ubicacion: "Pasillo D - Gaveta 18",
    unidadPresentacion: "Caja x 100 unidades",
    unidadCorta: "cajas",
    imagen: "img/SNK-HBS 6-100 x 100U.webp",
    descripcion:
      "Tornillos estructurales de fijación pesada SNK/HBS 6 x 100 mm cincados amarillos con tratamiento anticorrosión y fresado bajo cabeza para embutido perfecto en madera maciza.",
    proyectosAsignados: "Proyecto B (50 cj) · Proyecto C (40 cj)",
  },
  {
    codigo: "MAT-ESP-FIS75",
    nombre: "TUBO POLIURETANO 750 FISCHER",
    categoria: "Adhesivos y Selladores",
    stockInicial: 100,
    compras: 40,
    enUso: 45,
    costoUnitario: 13400,
    fechaConteo: "28/09/2026",
    ubicacion: "Sector C - Estantería 05",
    unidadPresentacion: "Tubo aerosol 750 ml (Pack 12x6 + 9u = 81u)",
    unidadCorta: "tubos",
    imagen: "img/TUBO POLIURETANO 750 FISCHER.webp",
    descripcion:
      "Espuma expansiva monocomponente de poliuretano Fischer 750 ml para sellado térmico y acústico, aislamiento y relleno de cavidades en vanos de carpinterías de puertas y ventanas.",
    proyectosAsignados: "Proyecto A (25 u) · Proyecto B (20 u)",
  },
  {
    codigo: "MAT-AIS-ACU50",
    nombre: "MEMBRANA ACÚSTICA, rollo 50 m²",
    categoria: "Aislaciones Acústicas",
    stockInicial: 50,
    compras: 15,
    enUso: 20,
    costoUnitario: 68000,
    fechaConteo: "29/09/2026",
    ubicacion: "Pasillo E - Racks de Rollos",
    unidadPresentacion: "Rollo continuo de 50 m²",
    unidadCorta: "rollos",
    imagen: "img/MEMBRANA ACÚSTICA, rollo 50 m².webp",
    descripcion:
      "Membrana fonoabsorbente viscoelástica bicapa para atenuación de ruidos de impacto en entrepisos y disminución de transmisión aérea en tabiquería liviana.",
    proyectosAsignados: "Proyecto A (12 rollos) · Proyecto C (8 rollos)",
  },
];

async function seed() {
  await conectarDB();

  console.log("Limpiando colecciones...");
  await Material.deleteMany({});
  await Proyecto.deleteMany({});

  console.log("Insertando materiales iniciales...");
  const materialesCreados = await Material.insertMany(MATERIALES_INICIALES);
  console.log(`Se insertaron ${materialesCreados.length} materiales.`);

  const mapPorCodigo = new Map<string, mongoose.Types.ObjectId>();
  materialesCreados.forEach((m) => {
    mapPorCodigo.set(m.codigo, m._id as mongoose.Types.ObjectId);
  });

  console.log("Insertando proyectos con asignación de materiales...");
  await Proyecto.create([
    {
      nombre: "Proyecto A",
      fecha: new Date(),
      materiales: [
        { material: mapPorCodigo.get("MAT-EPS-12020"), cantidadUsada: 70 },
        { material: mapPorCodigo.get("MAT-OSB-0950U"), cantidadUsada: 40 },
        { material: mapPorCodigo.get("MAT-ADH-VIN20"), cantidadUsada: 10 },
        { material: mapPorCodigo.get("MAT-ADH-POLIK"), cantidadUsada: 15 },
        { material: mapPorCodigo.get("MAT-FIJ-SHS35"), cantidadUsada: 100 },
        { material: mapPorCodigo.get("MAT-ESP-FIS75"), cantidadUsada: 25 },
        { material: mapPorCodigo.get("MAT-AIS-ACU50"), cantidadUsada: 12 },
      ],
    },
    {
      nombre: "Proyecto B",
      fecha: new Date(),
      materiales: [
        { material: mapPorCodigo.get("MAT-EPS-09220"), cantidadUsada: 90 },
        { material: mapPorCodigo.get("MAT-OSB-0950U"), cantidadUsada: 25 },
        { material: mapPorCodigo.get("MAT-OSB-1810U"), cantidadUsada: 30 },
        { material: mapPorCodigo.get("MAT-ADH-POLIK"), cantidadUsada: 15 },
        { material: mapPorCodigo.get("MAT-FIJ-SHS35"), cantidadUsada: 70 },
        { material: mapPorCodigo.get("MAT-FIJ-SNK61"), cantidadUsada: 50 },
        { material: mapPorCodigo.get("MAT-ESP-FIS75"), cantidadUsada: 20 },
      ],
    },
    {
      nombre: "Proyecto C",
      fecha: new Date(),
      materiales: [
        { material: mapPorCodigo.get("MAT-EPS-12020"), cantidadUsada: 50 },
        { material: mapPorCodigo.get("MAT-EPS-09220"), cantidadUsada: 60 },
        { material: mapPorCodigo.get("MAT-OSB-1810U"), cantidadUsada: 10 },
        { material: mapPorCodigo.get("MAT-ADH-VIN20"), cantidadUsada: 8 },
        { material: mapPorCodigo.get("MAT-FIJ-SHS35"), cantidadUsada: 50 },
        { material: mapPorCodigo.get("MAT-FIJ-SNK61"), cantidadUsada: 40 },
        { material: mapPorCodigo.get("MAT-AIS-ACU50"), cantidadUsada: 8 },
      ],
    },
  ]);

  console.log("Proyectos insertados exitosamente.");
  console.log("Seed completado.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error durante el seed:", err);
  process.exit(1);
});
