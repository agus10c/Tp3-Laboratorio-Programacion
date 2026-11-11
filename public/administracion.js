async function obtenerMateriales() {
  const respuesta = await fetch("/api/materiales");

  if (!respuesta.ok) {
    throw new Error("Error al obtener los materiales");
  }

  return await respuesta.json();
}

async function obtenerProyectos() {
  const respuesta = await fetch("/api/proyectos");

  if (!respuesta.ok) {
    throw new Error("Error al obtener los proyectos");
  }

  return await respuesta.json();
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

    // Cantidad de materiales
    if (cantMateriales) {
      cantMateriales.textContent = datosMateriales.total || listaMateriales.length;
    }

    // Lista de proyectos
    if (listaProyectos && datosProyectos.proyectos) {
      listaProyectos.innerHTML = "";
      datosProyectos.proyectos.forEach((proyecto) => {
        const li = document.createElement("li");
        li.textContent = proyecto.nombre;
        listaProyectos.appendChild(li);
      });
    }

    // Valor total del stock
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

    // Poblar selector directo y tabla de inventario
    poblarSelector(listaMateriales);
    renderizarTabla(listaMateriales);

    // Eventos
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
    console.error("Error al cargar el resumen:", error);
  }
});
