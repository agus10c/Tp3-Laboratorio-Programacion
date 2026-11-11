/**
 * Detalle del Material - Lógica de Cliente y Conexión con API REST (TP3)
 * Soporta funcionamiento en línea con MongoDB y modo fuera de línea con datos de respaldo.
 */

// Datos de respaldo para funcionamiento sin base de datos activa
const MATERIALES_FALLBACK = [
  {
    _id: "673000000000000000000001",
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
    _id: "673000000000000000000002",
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
    _id: "673000000000000000000003",
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
    _id: "673000000000000000000004",
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
    _id: "673000000000000000000005",
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
    _id: "673000000000000000000006",
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
    _id: "673000000000000000000007",
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
    _id: "673000000000000000000008",
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
    _id: "673000000000000000000009",
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
    _id: "673000000000000000000010",
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

const PROYECTOS_FALLBACK = [
  {
    _id: "673000000000000000000101",
    nombre: "Proyecto A",
    materiales: [
      { material: "673000000000000000000001", cantidadUsada: 70 },
      { material: "673000000000000000000003", cantidadUsada: 40 },
      { material: "673000000000000000000005", cantidadUsada: 10 },
      { material: "673000000000000000000006", cantidadUsada: 15 },
      { material: "673000000000000000000007", cantidadUsada: 100 },
      { material: "673000000000000000000009", cantidadUsada: 25 },
      { material: "673000000000000000000010", cantidadUsada: 12 },
    ],
  },
  {
    _id: "673000000000000000000102",
    nombre: "Proyecto B",
    materiales: [
      { material: "673000000000000000000002", cantidadUsada: 90 },
      { material: "673000000000000000000003", cantidadUsada: 25 },
      { material: "673000000000000000000004", cantidadUsada: 30 },
      { material: "673000000000000000000006", cantidadUsada: 15 },
      { material: "673000000000000000000007", cantidadUsada: 70 },
      { material: "673000000000000000000008", cantidadUsada: 50 },
      { material: "673000000000000000000009", cantidadUsada: 20 },
    ],
  },
  {
    _id: "673000000000000000000103",
    nombre: "Proyecto C",
    materiales: [
      { material: "673000000000000000000001", cantidadUsada: 50 },
      { material: "673000000000000000000002", cantidadUsada: 60 },
      { material: "673000000000000000000004", cantidadUsada: 10 },
      { material: "673000000000000000000005", cantidadUsada: 8 },
      { material: "673000000000000000000007", cantidadUsada: 50 },
      { material: "673000000000000000000008", cantidadUsada: 40 },
      { material: "673000000000000000000010", cantidadUsada: 8 },
    ],
  },
];

// Formateadores
const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

const formatoNumero = new Intl.NumberFormat("es-AR");

// Estado
let todosLosMateriales = [];
let todosLosProyectos = [];
let materialActual = null;
let esModoOffline = false;

// Elementos del DOM
const elSelectorDirecto = document.getElementById("selector-directo");
const elMensajeEstado = document.getElementById("mensaje-estado");
const elFichaMaterial = document.getElementById("ficha-material");

// Ficha técnica
const elDetImagen = document.getElementById("det-imagen");
const elDetInsigniaCat = document.getElementById("det-insignia-cat");
const elDetCodigo = document.getElementById("det-codigo");
const elDetCategoria = document.getElementById("det-categoria");
const elDetNombre = document.getElementById("det-nombre");
const elDetDescripcion = document.getElementById("det-descripcion");
const elDetCodigoVal = document.getElementById("det-codigo-val");
const elDetCategoriaVal = document.getElementById("det-categoria-val");
const elDetUnidadVal = document.getElementById("det-unidad-val");
const elDetFechaVal = document.getElementById("det-fecha-val");
const elDetUbicacionVal = document.getElementById("det-ubicacion-val");
const elDetCostoVal = document.getElementById("det-costo-val");
const elDetValorTotalVal = document.getElementById("det-valor-total-val");

// Tarjetas de métricas
const elDetStockFisico = document.getElementById("det-stock-fisico");
const elDetUnidadFisico = document.getElementById("det-unidad-fisico");
const elDetStockInicialCompras = document.getElementById(
  "det-stock-inicial-compras",
);
const elDetStockComprometido = document.getElementById(
  "det-stock-comprometido",
);
const elDetUnidadComprometido = document.getElementById(
  "det-unidad-comprometido",
);
const elDetProyectosComprometidos = document.getElementById(
  "det-proyectos-comprometidos",
);
const elDetStockDisponible = document.getElementById("det-stock-disponible");
const elDetUnidadDisponible = document.getElementById("det-unidad-disponible");
const elDetPorcentajeDisp = document.getElementById("det-porcentaje-disp");
const elDetBarraDisp = document.getElementById("det-barra-disp");

/**
 * Peticiones a la API REST de TP3 con respaldo automático
 */
async function obtenerMaterialesAPI() {
  try {
    const res = await fetch("/api/materiales");
    if (!res.ok) throw new Error("API materiales respondió con error");
    const data = await res.json();
    if (data.modoOffline) esModoOffline = true;
    return data;
  } catch (err) {
    console.warn("Fallo en /api/materiales, usando datos locales:", err);
    esModoOffline = true;
    return { materiales: MATERIALES_FALLBACK, total: MATERIALES_FALLBACK.length, modoOffline: true };
  }
}

async function obtenerMaterialPorIdAPI(id) {
  try {
    const res = await fetch(`/api/materiales/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error("API material no encontrado");
    return await res.json();
  } catch (err) {
    console.warn(`Fallo al consultar /api/materiales/${id}, buscando localmente:`, err);
    const encontrado = MATERIALES_FALLBACK.find(
      (m) =>
        m._id === id ||
        m.codigo.toLowerCase() === String(id).toLowerCase() ||
        m.nombre.toLowerCase() === String(id).toLowerCase(),
    );
    if (encontrado) return encontrado;
    throw err;
  }
}

async function obtenerProyectosAPI() {
  try {
    const res = await fetch("/api/proyectos");
    if (!res.ok) throw new Error("API proyectos respondió con error");
    return await res.json();
  } catch (err) {
    return { proyectos: PROYECTOS_FALLBACK, total: PROYECTOS_FALLBACK.length, modoOffline: true };
  }
}

/**
 * Mensajes de estado
 */
function mostrarEstado(mensaje, tipo = "cargando") {
  if (!elMensajeEstado) return;
  elMensajeEstado.className = `mensaje-estado ${tipo}`;
  elMensajeEstado.textContent = mensaje;
  elMensajeEstado.classList.remove("oculto");
}

function ocultarEstado() {
  if (!elMensajeEstado) return;
  elMensajeEstado.classList.add("oculto");
  elMensajeEstado.textContent = "";
}

/**
 * Poblar el <select> desplegable
 */
function poblarSelector(materiales, idSeleccionado) {
  if (!elSelectorDirecto) return;
  elSelectorDirecto.innerHTML = "";

  if (materiales.length === 0) {
    const optVacia = document.createElement("option");
    optVacia.value = "";
    optVacia.textContent = "No hay materiales registrados";
    elSelectorDirecto.appendChild(optVacia);
    return;
  }

  materiales.forEach((mat) => {
    const opt = document.createElement("option");
    opt.value = mat._id || mat.codigo;
    opt.textContent = `${mat.codigo} - ${mat.nombre}`;
    if (mat._id === idSeleccionado || mat.codigo === idSeleccionado) {
      opt.selected = true;
    }
    elSelectorDirecto.appendChild(opt);
  });
}

/**
 * Resolver proyectos en los que se utiliza este material
 */
function resolverProyectosAsignados(material) {
  if (!material) return "Sin proyectos asignados";

  const idMat = String(material._id || "");
  const codMat = String(material.codigo || "").toLowerCase();

  const proyectosConUso = todosLosProyectos.filter((p) => {
    if (!Array.isArray(p.materiales)) return false;
    return p.materiales.some((item) => {
      const refId =
        typeof item.material === "object" && item.material !== null
          ? String(item.material._id || "")
          : String(item.material || "");
      return (
        refId === idMat ||
        (item.material &&
          typeof item.material.codigo === "string" &&
          item.material.codigo.toLowerCase() === codMat)
      );
    });
  });

  if (proyectosConUso.length > 0) {
    return proyectosConUso
      .map((p) => {
        const item = p.materiales.find((m) => {
          const refId =
            typeof m.material === "object" && m.material !== null
              ? String(m.material._id || "")
              : String(m.material || "");
          return refId === idMat;
        });
        const cant = item ? item.cantidadUsada : "?";
        const unidad = material.unidadCorta || "u";
        return `${p.nombre} (${cant} ${unidad})`;
      })
      .join(" · ");
  }

  if (material.proyectosAsignados && material.proyectosAsignados.trim() !== "") {
    return material.proyectosAsignados;
  }

  return "Sin proyectos asignados";
}

/**
 * Renderizar detalles del material
 */
function renderizarMaterial(mat) {
  if (!mat) return;
  materialActual = mat;

  document.title = `${mat.nombre} - Detalle del Material`;

  const stockInicial = Number(mat.stockInicial) || 0;
  const compras = Number(mat.compras) || 0;
  const stockFisico = stockInicial + compras;
  const enUso = Number(mat.enUso) || 0;
  const stockDisponible = Math.max(0, stockFisico - enUso);
  const porcentajeDisponible =
    stockFisico > 0 ? Math.round((stockDisponible / stockFisico) * 100) : 0;
  const costoUnitario = Number(mat.costoUnitario) || 0;
  const valorTotalInventario = stockDisponible * costoUnitario;
  const unidadCorta = mat.unidadCorta || "u";

  if (elDetImagen) {
    const rutaImagen = mat.imagen
      ? mat.imagen.startsWith("img/")
        ? mat.imagen
        : `img/${mat.imagen}`
      : "img/EPS X 120-20.jpg";

    elDetImagen.src = rutaImagen;
    elDetImagen.alt = `Fotografía de ${mat.nombre}`;
    elDetImagen.onerror = () => {
      elDetImagen.src = "img/EPS X 120-20.jpg";
    };
  }

  if (elDetInsigniaCat) {
    elDetInsigniaCat.textContent = mat.categoria || "Material";
  }

  if (elDetCodigo) elDetCodigo.textContent = mat.codigo || "—";
  if (elDetCategoria) elDetCategoria.textContent = mat.categoria || "—";
  if (elDetNombre) elDetNombre.textContent = mat.nombre || "—";
  if (elDetDescripcion) {
    elDetDescripcion.textContent =
      mat.descripcion || "Sin descripción técnica cargada.";
  }

  if (elDetCodigoVal) elDetCodigoVal.textContent = mat.codigo || "—";
  if (elDetCategoriaVal) elDetCategoriaVal.textContent = mat.categoria || "—";
  if (elDetUnidadVal) {
    elDetUnidadVal.textContent =
      mat.unidadPresentacion || `Unidad estándar (${unidadCorta})`;
  }
  if (elDetFechaVal) {
    elDetFechaVal.textContent = mat.fechaConteo || "No registrada";
  }
  if (elDetUbicacionVal) {
    elDetUbicacionVal.textContent = mat.ubicacion || "Depósito Central";
  }
  if (elDetCostoVal) {
    elDetCostoVal.textContent = formatoMoneda.format(costoUnitario);
  }
  if (elDetValorTotalVal) {
    elDetValorTotalVal.textContent = formatoMoneda.format(valorTotalInventario);
  }

  if (elDetStockFisico) {
    elDetStockFisico.textContent = formatoNumero.format(stockFisico);
  }
  if (elDetUnidadFisico) {
    elDetUnidadFisico.textContent = unidadCorta;
  }
  if (elDetStockInicialCompras) {
    elDetStockInicialCompras.textContent = `Inicial: ${formatoNumero.format(
      stockInicial,
    )} · Compras: ${formatoNumero.format(compras)}`;
  }

  if (elDetStockComprometido) {
    elDetStockComprometido.textContent = formatoNumero.format(enUso);
  }
  if (elDetUnidadComprometido) {
    elDetUnidadComprometido.textContent = unidadCorta;
  }
  if (elDetProyectosComprometidos) {
    elDetProyectosComprometidos.textContent = resolverProyectosAsignados(mat);
  }

  if (elDetStockDisponible) {
    elDetStockDisponible.textContent = formatoNumero.format(stockDisponible);
  }
  if (elDetUnidadDisponible) {
    elDetUnidadDisponible.textContent = unidadCorta;
  }

  if (elDetPorcentajeDisp) {
    elDetPorcentajeDisp.textContent = `${porcentajeDisponible}% disponible`;
  }
  if (elDetBarraDisp) {
    elDetBarraDisp.style.width = `${porcentajeDisponible}%`;
    const progressbar = elDetBarraDisp.closest('[role="progressbar"]');
    if (progressbar) {
      progressbar.setAttribute("aria-valuenow", String(porcentajeDisponible));
    }
  }

  if (elSelectorDirecto && mat._id) {
    elSelectorDirecto.value = mat._id;
  }

  if (esModoOffline) {
    mostrarEstado(
      "⚠️ Modo sin conexión a base de datos: mostrando datos locales de respaldo.",
      "aviso",
    );
  } else {
    ocultarEstado();
  }
}

/**
 * Seleccionar un material por su ID o código
 */
async function cargarMaterialPorIdentificador(idOcodigo, actualizarUrl = true) {
  if (!idOcodigo) return;

  const enMemoria = todosLosMateriales.find(
    (m) =>
      m._id === idOcodigo ||
      (m.codigo && m.codigo.toLowerCase() === String(idOcodigo).toLowerCase()),
  );

  if (enMemoria) {
    renderizarMaterial(enMemoria);
    if (actualizarUrl) sincronizarUrl(enMemoria._id || enMemoria.codigo);
    return;
  }

  try {
    const mat = await obtenerMaterialPorIdAPI(idOcodigo);
    renderizarMaterial(mat);
    if (actualizarUrl) sincronizarUrl(mat._id || mat.codigo);
  } catch (error) {
    console.error("Error al obtener material:", error);
    mostrarEstado("No se encontró el material solicitado.", "error");
  }
}

function sincronizarUrl(id) {
  const url = new URL(window.location);
  url.searchParams.set("id", id);
  window.history.pushState({ id }, "", url);
}

/**
 * Inicialización al cargar el DOM
 */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const [datosMateriales, datosProyectos] = await Promise.all([
      obtenerMaterialesAPI(),
      obtenerProyectosAPI(),
    ]);

    todosLosMateriales = datosMateriales.materiales || [];
    todosLosProyectos = datosProyectos.proyectos || [];

    if (todosLosMateriales.length === 0) {
      todosLosMateriales = MATERIALES_FALLBACK;
      esModoOffline = true;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id") || urlParams.get("codigo");

    let materialInicial = null;
    if (idParam) {
      materialInicial = todosLosMateriales.find(
        (m) =>
          m._id === idParam ||
          (m.codigo &&
            m.codigo.toLowerCase() === String(idParam).toLowerCase()),
      );
    }

    if (!materialInicial) {
      materialInicial = todosLosMateriales[0];
    }

    poblarSelector(todosLosMateriales, materialInicial._id);
    renderizarMaterial(materialInicial);

    if (elSelectorDirecto) {
      elSelectorDirecto.addEventListener("change", (e) => {
        const idSeleccionado = e.target.value;
        cargarMaterialPorIdentificador(idSeleccionado, true);
      });
    }

    window.addEventListener("popstate", () => {
      const urlParamsActual = new URLSearchParams(window.location.search);
      const idActual =
        urlParamsActual.get("id") || urlParamsActual.get("codigo");
      if (idActual) {
        cargarMaterialPorIdentificador(idActual, false);
      } else if (todosLosMateriales.length > 0) {
        renderizarMaterial(todosLosMateriales[0]);
      }
    });
  } catch (error) {
    console.warn("Inicializando con datos de respaldo locales:", error);
    todosLosMateriales = MATERIALES_FALLBACK;
    todosLosProyectos = PROYECTOS_FALLBACK;
    esModoOffline = true;
    poblarSelector(todosLosMateriales, todosLosMateriales[0]._id);
    renderizarMaterial(todosLosMateriales[0]);
  }
});
