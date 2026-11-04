// public/administracion.js

document.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.querySelector(".tabla-inventario tbody");
  const inputBuscar = document.getElementById("buscar-material");
  const selectRapido = document.getElementById("selector-directo");

  const txtCantMateriales = document.getElementById("cant-materiales");
  const txtValorTotal = document.getElementById("valor-total-stock");

  let materiales = [];

  async function cargarMateriales() {
    try {
      const respuesta = await fetch("/api/materiales?cantidad=100");

      if (!respuesta.ok) throw new Error("Error al consultar la API");

      const data = await respuesta.json();
      // La API devuelve { total, cantidad, desde, materiales }
      materiales = data.materiales;

      actualizarTarjetas(data.total);
      renderizarTabla();
      llenarSelector();
    } catch (error) {
      console.error("Error:", error);
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">No se pudo conectar con el servidor. Verificá que el backend esté corriendo.</td></tr>`;
    }
  }

  function renderizarTabla(filtro = "") {
    tbody.innerHTML = "";
    const filtrados = materiales.filter((mat) => {
      const texto =
        `${mat.nombre} ${mat.codigo} ${mat.categoria}`.toLowerCase();
      return texto.includes(filtro.toLowerCase());
    });

    if (filtrados.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem;">No se encontraron materiales.</td></tr>`;
      return;
    }

    const fragment = document.createDocumentFragment();

    filtrados.forEach((mat) => {
      const stockReal =
        (mat.stockInicial || 0) + (mat.compras || 0) - (mat.enUso || 0);
      const costoTotal = stockReal * (mat.costoUnitario || 0);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <th scope="row">
          <a href="detalle.html?id=${mat._id}">${mat.nombre}</a>
        </th>
        <td>${mat.stockInicial}</td>
        <td>${mat.compras}</td>
        <td>${mat.enUso}</td>
        <td>${stockReal}</td>
        <td>$${costoTotal.toLocaleString("es-AR")}</td>
      `;
      fragment.appendChild(tr);
    });

    tbody.appendChild(fragment);
  }

  function llenarSelector() {
    selectRapido.innerHTML = `<option value="">— Elegir material —</option>`;
    materiales.forEach((mat) => {
      const op = document.createElement("option");
      op.value = mat._id;
      op.textContent = `${mat.codigo} - ${mat.nombre}`;
      selectRapido.appendChild(op);
    });
  }

  // 5. Actualizar las tarjetas de arriba (Resumen)
  function actualizarTarjetas(totalMateriales) {
    // Cantidad de materiales
    txtCantMateriales.textContent = totalMateriales;

    // Valor total del stock (sumando todos los costos totales)
    const valorTotal = materiales.reduce((acc, mat) => {
      const stockReal =
        (mat.stockInicial || 0) + (mat.compras || 0) - (mat.enUso || 0);
      return acc + stockReal * mat.costoUnitario;
    }, 0);

    txtValorTotal.textContent = `$${valorTotal.toLocaleString("es-AR")}`;

    // Proyectos activos (extraemos las palabras "Proyecto X" de los strings)
    const proyectosSet = new Set();
    materiales.forEach((mat) => {
      if (mat.proyectosAsignados) {
        const matches = mat.proyectosAsignados.match(/Proyecto [A-Z]/g);
        if (matches) matches.forEach((p) => proyectosSet.add(p));
      }
    });

    listaProyectos.innerHTML = "";
    Array.from(proyectosSet)
      .sort()
      .forEach((proyecto) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${proyecto}</strong>`;
        listaProyectos.appendChild(li);
      });
  }

  // 6. Eventos de búsqueda y selector
  inputBuscar.addEventListener("input", (e) => {
    renderizarTabla(e.target.value);
  });

  selectRapido.addEventListener("change", (e) => {
    if (e.target.value) {
      window.location.href = `detalle.html?id=${e.target.value}`;
    }
  });

  cargarMateriales();
});
