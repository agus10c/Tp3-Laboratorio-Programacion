/**
 * Detalle del Material - Lógica de Cliente y Conexión con API REST (TP3)
 */

// Formateadores de moneda y cantidades
const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

const formatoNumero = new Intl.NumberFormat("es-AR");

// Estado en memoria de la página
let todosLosMateriales = [];
let todosLosProyectos = [];
let materialActual = null;

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
 * Peticiones a la API REST de TP3
 */
async function obtenerMaterialesAPI() {
  const res = await fetch("/api/materiales");
  if (!res.ok) {
    throw new Error(`Error ${res.status}: No se pudo cargar los materiales`);
  }
  return await res.json();
}

async function obtenerMaterialPorIdAPI(id) {
  const res = await fetch(`/api/materiales/${encodeURIComponent(id)}`);
  if (!res.ok) {
    throw new Error(`Error ${res.status}: Material no encontrado`);
  }
  return await res.json();
}

async function obtenerProyectosAPI() {
  try {
    const res = await fetch("/api/proyectos");
    if (!res.ok) return { proyectos: [] };
    return await res.json();
  } catch (err) {
    console.warn("No se pudieron cargar los proyectos:", err);
    return { proyectos: [] };
  }
}

/**
 * Mostrar u ocultar mensaje de estado (cargando / error)
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
 * Cargar y poblar el <select> desplegable
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
 * Renderizar en pantalla los detalles del material
 */
function renderizarMaterial(mat) {
  if (!mat) return;
  materialActual = mat;

  // Actualizar título de la pestaña
  document.title = `${mat.nombre} - Detalle del Material`;

  // Cálculos de existencias e inventario
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

  // Imagen del material
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

  // Encabezado técnico
  if (elDetCodigo) elDetCodigo.textContent = mat.codigo || "—";
  if (elDetCategoria) elDetCategoria.textContent = mat.categoria || "—";
  if (elDetNombre) elDetNombre.textContent = mat.nombre || "—";
  if (elDetDescripcion) {
    elDetDescripcion.textContent =
      mat.descripcion || "Sin descripción técnica cargada.";
  }

  // Grilla de datos técnicos
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

  // Tarjetas de métricas
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

  // Sincronizar el selector desplegable
  if (elSelectorDirecto && mat._id) {
    elSelectorDirecto.value = mat._id;
  }

  ocultarEstado();
}

/**
 * Seleccionar un material por su ID o código
 */
async function cargarMaterialPorIdentificador(idOcodigo, actualizarUrl = true) {
  if (!idOcodigo) return;

  // Buscar primero en el arreglo ya cargado
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

  // Si no está en memoria, consultar la API directamente
  try {
    mostrarEstado("Cargando detalles del material...", "cargando");
    const mat = await obtenerMaterialPorIdAPI(idOcodigo);
    renderizarMaterial(mat);
    if (actualizarUrl) sincronizarUrl(mat._id || mat.codigo);
  } catch (error) {
    console.error("Error al obtener material:", error);
    mostrarEstado(
      "No se encontró el material solicitado en el catálogo.",
      "error",
    );
  }
}

/**
 * Sincronizar el parámetro ?id=... en la barra de direcciones
 */
function sincronizarUrl(id) {
  const url = new URL(window.location);
  url.searchParams.set("id", id);
  window.history.pushState({ id }, "", url);
}

/**
 * Inicialización al cargar el DOM
 */
document.addEventListener("DOMContentLoaded", async () => {
  mostrarEstado("Cargando catálogo y detalles...", "cargando");

  try {
    const [datosMateriales, datosProyectos] = await Promise.all([
      obtenerMaterialesAPI(),
      obtenerProyectosAPI(),
    ]);

    todosLosMateriales = datosMateriales.materiales || [];
    todosLosProyectos = datosProyectos.proyectos || [];

    if (todosLosMateriales.length === 0) {
      mostrarEstado(
        "No hay materiales registrados en la base de datos.",
        "error",
      );
      poblarSelector([], null);
      return;
    }

    // Detectar parámetro ?id=... o ?codigo=...
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

    // Si no vino parámetro o no se encontró en la lista, tomar el primero
    if (!materialInicial) {
      materialInicial = todosLosMateriales[0];
    }

    poblarSelector(todosLosMateriales, materialInicial._id);
    renderizarMaterial(materialInicial);

    // Evento de cambio en el selector desplegable
    if (elSelectorDirecto) {
      elSelectorDirecto.addEventListener("change", (e) => {
        const idSeleccionado = e.target.value;
        cargarMaterialPorIdentificador(idSeleccionado, true);
      });
    }

    // Soporte para navegación con botones Atrás / Adelante del navegador
    window.addEventListener("popstate", (e) => {
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
    console.error("Error inicializando la página de detalle:", error);
    mostrarEstado(
      "No se pudo conectar con el servidor o cargar los datos de inventario.",
      "error",
    );
  }
});
