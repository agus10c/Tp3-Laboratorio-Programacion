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
  },
];

const PROYECTOS_FALLBACK = [
  { nombre: "Proyecto A" },
  { nombre: "Proyecto B" },
  { nombre: "Proyecto C" },
];

async function obtenerMateriales() {
  try {
    const respuesta = await fetch("/api/materiales");
    if (!respuesta.ok) throw new Error("Error HTTP al obtener materiales");
    return await respuesta.json();
  } catch (err) {
    console.warn("Usando materiales de respaldo locales:", err);
    return { materiales: MATERIALES_FALLBACK, total: MATERIALES_FALLBACK.length };
  }
}

async function obtenerProyectos() {
  try {
    const respuesta = await fetch("/api/proyectos");
    if (!respuesta.ok) throw new Error("Error HTTP al obtener proyectos");
    return await respuesta.json();
  } catch (err) {
    console.warn("Usando proyectos de respaldo locales:", err);
    return { proyectos: PROYECTOS_FALLBACK, total: PROYECTOS_FALLBACK.length };
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const cantMateriales = document.querySelector("#cant-materiales");
  const listaProyectos = document.querySelector("#lista-proyectos");
  const valorTotalStock = document.querySelector("#valor-total-stock");
  const selectorDirecto = document.querySelector("#selector-directo");
  const buscarMaterial = document.querySelector("#buscar-material");
  const tbodyInventario = document.querySelector(".tabla-inventario tbody");

  const formatoMoneda = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  const formatoNumero = new Intl.NumberFormat("es-AR");

  let listaMateriales = [];

  function renderizarTabla(materiales) {
    if (!tbodyInventario) return;
    tbodyInventario.innerHTML = "";

    if (materiales.length === 0) {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td colspan="6" style="text-align: center; padding: 1.5rem; color: #666;">
          No se encontraron materiales.
        </td>
      `;
      tbodyInventario.appendChild(fila);
      return;
    }

    materiales.forEach((material) => {
      const stockInicial = Number(material.stockInicial) || 0;
      const compras = Number(material.compras) || 0;
      const enUso = Number(material.enUso) || 0;
      const stockReal = Math.max(0, stockInicial + compras - enUso);
      const costoTotal = stockReal * (Number(material.costoUnitario) || 0);

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <th scope="row">
          <a href="detalle.html?id=${encodeURIComponent(material._id || material.codigo)}" title="Ver detalle de ${material.nombre}">
            ${material.nombre}
          </a>
        </th>
        <td style="text-align: right;">${formatoNumero.format(stockInicial)}</td>
        <td style="text-align: right;">${formatoNumero.format(compras)}</td>
        <td style="text-align: right; color: #b45309; font-weight: 600;">${formatoNumero.format(enUso)}</td>
        <td style="text-align: right; font-weight: 700; color: #0b6c2c;">${formatoNumero.format(stockReal)}</td>
        <td style="text-align: right;">${formatoMoneda.format(costoTotal)}</td>
      `;
      tbodyInventario.appendChild(fila);
    });
  }

  function poblarSelector(materiales) {
    if (!selectorDirecto) return;
    selectorDirecto.innerHTML = "";

    const opcionDefault = document.createElement("option");
    opcionDefault.value = "";
    opcionDefault.textContent = "-- Seleccionar material para ver detalle --";
    selectorDirecto.appendChild(opcionDefault);

    materiales.forEach((material) => {
      const opt = document.createElement("option");
      opt.value = material._id || material.codigo;
      opt.textContent = `${material.codigo} - ${material.nombre}`;
      selectorDirecto.appendChild(opt);
    });
  }

  try {
    const [datosMateriales, datosProyectos] = await Promise.all([
      obtenerMateriales(),
      obtenerProyectos(),
    ]);

    listaMateriales = datosMateriales.materiales || [];

    if (cantMateriales) {
      cantMateriales.textContent = datosMateriales.total || listaMateriales.length;
    }

    if (listaProyectos && datosProyectos.proyectos) {
      listaProyectos.innerHTML = "";
      datosProyectos.proyectos.forEach((proyecto) => {
        const li = document.createElement("li");
        li.textContent = proyecto.nombre;
        listaProyectos.appendChild(li);
      });
    }

    const totalStock = listaMateriales.reduce((total, material) => {
      const stockReal =
        (Number(material.stockInicial) || 0) +
        (Number(material.compras) || 0) -
        (Number(material.enUso) || 0);

      return total + Math.max(0, stockReal) * (Number(material.costoUnitario) || 0);
    }, 0);

    if (valorTotalStock) {
      valorTotalStock.textContent = formatoMoneda.format(totalStock);
    }

    poblarSelector(listaMateriales);
    renderizarTabla(listaMateriales);

    if (selectorDirecto) {
      selectorDirecto.addEventListener("change", (e) => {
        const id = e.target.value;
        if (id) {
          window.location.href = `detalle.html?id=${encodeURIComponent(id)}`;
        }
      });
    }

    if (buscarMaterial) {
      buscarMaterial.addEventListener("input", (e) => {
        const busqueda = e.target.value.trim().toLowerCase();
        const filtrados = listaMateriales.filter((m) => {
          const texto = `${m.nombre} ${m.codigo} ${m.categoria}`.toLowerCase();
          return texto.includes(busqueda);
        });
        renderizarTabla(filtrados);
      });
    }
  } catch (error) {
    console.error("Error al cargar administración:", error);
  }
});
