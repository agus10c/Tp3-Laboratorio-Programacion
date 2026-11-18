// Formato de moneda
const formatoMoneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

// Obtener todos los materiales
async function obtenerMateriales() {
  const respuesta = await fetch("/api/materiales");

  if (!respuesta.ok) {
    throw new Error("Error al obtener los materiales");
  }

  return await respuesta.json();
}

// Buscar un material por ID
async function buscarMaterial(id) {
  const respuesta = await fetch(`/api/materiales/${id}`);

  if (!respuesta.ok) {
    throw new Error("Error al buscar el material");
  }

  return await respuesta.json();
}

// Obtener todos los proyectos
async function obtenerProyectos() {
  const respuesta = await fetch("/api/proyectos");

  if (!respuesta.ok) {
    throw new Error("Error al obtener los proyectos");
  }

  return await respuesta.json();
}

// Mostrar materiales en la tabla
function mostrarMateriales(materiales, cuerpoTabla, filtro = "") {
  cuerpoTabla.innerHTML = "";

  // Filtrar materiales si se recibió un filtro
  const materialesFiltrados = materiales.filter((material) => {
    return (
      material.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      material.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
      material.categoria.toLowerCase().includes(filtro.toLowerCase())
    );
  });

  materialesFiltrados.forEach((material) => {
    const fila = document.createElement("tr");

    const stockReal = material.stockInicial + material.compras - material.enUso;

    const costoTotal = stockReal * material.costoUnitario;

    fila.innerHTML = `
    <th scope="row">
      <a href="detalle.html?id=${material._id}">
        ${material.nombre}
      </a>
     </th>
      <td>${material.stockInicial}</td>
       <td>
         <input type="number" id="compras-${material._id}" value="${material.compras}" min="0">
          <button type="button" class="guardar-compra" data-id="${material._id}"> Guardar </button>
        </td>
  <td>${material.enUso}</td>
  <td>${stockReal}</td>
  <td>${formatoMoneda.format(costoTotal)}</td>
`;

    cuerpoTabla.appendChild(fila);
  });
}

async function actualizarCompras(id, cantidad) {
  const respuesta = await fetch(`/api/materiales/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      compras: cantidad,
    }),
  });

  if (!respuesta.ok) {
    throw new Error("Error al actualizar las compras");
  }

  return await respuesta.json();
}

// Calcular el valor total del stock
function calcularTotalStock(materiales, elemento) {
  const total = materiales.reduce((acumulador, material) => {
    const stockReal = material.stockInicial + material.compras - material.enUso;

    return acumulador + stockReal * material.costoUnitario;
  }, 0);

  elemento.textContent = formatoMoneda.format(total);
}

// Cuando se carga el HTML
document.addEventListener("DOMContentLoaded", async () => {
  const cantMateriales = document.querySelector("#cant-materiales");
  const listaProyectos = document.querySelector("#lista-proyectos");
  const valorTotalStock = document.querySelector("#valor-total-stock");
  const cuerpoTabla = document.querySelector(".tabla-inventario tbody");
  const buscador = document.querySelector("#buscar-material");

  try {
    // Obtener materiales y proyectos
    const [datosMateriales, datosProyectos] = await Promise.all([
      obtenerMateriales(),
      obtenerProyectos(),
    ]);

    // Mostrar cantidad de materiales
    cantMateriales.textContent = datosMateriales.total;

    // Mostrar lista de proyectos
    listaProyectos.innerHTML = "";

    datosProyectos.proyectos.forEach((proyecto) => {
      const li = document.createElement("li");

      li.textContent = proyecto.nombre;

      listaProyectos.appendChild(li);
    });

    // Mostrar todos los materiales inicialmente
    mostrarMateriales(datosMateriales.materiales, cuerpoTabla);

    // Calcular valor total del stock
    calcularTotalStock(datosMateriales.materiales, valorTotalStock);

    // Buscador de materiales
    buscador.addEventListener("input", () => {
      const filtro = buscador.value.trim();

      mostrarMateriales(datosMateriales.materiales, cuerpoTabla, filtro);
    });

    // Evento para guardar las compras
    cuerpoTabla.addEventListener("click", async (event) => {
      const boton = event.target.closest(".guardar-compra");

      if (!boton) {
        return;
      }

      const id = boton.dataset.id;

      const input = document.querySelector(`#compras-${id}`);

      const cantidad = Number(input.value);

      // Validar cantidad
      if (
        input.value.trim() === "" ||
        !Number.isFinite(cantidad) ||
        cantidad < 0
      ) {
        alert("Ingrese una cantidad válida.");
        return;
      }

      try {
        // Actualizar en el backend
        const materialActualizado = await actualizarCompras(id, cantidad);

        // Actualizar material en el array local
        const material = datosMateriales.materiales.find((m) => m._id === id);

        if (material) {
          material.compras = materialActualizado.compras;
        }

        // Actualizar tabla y total
        mostrarMateriales(
          datosMateriales.materiales,
          cuerpoTabla,
          buscador.value.trim(),
        );

        calcularTotalStock(datosMateriales.materiales, valorTotalStock);

        alert("Compras actualizadas correctamente.");
      } catch (error) {
        console.error("Error al actualizar las compras:", error);
        alert("No se pudieron actualizar las compras.");
      }
    });
  } catch (error) {
    console.error("Error al cargar la administración:", error);
  }
});
