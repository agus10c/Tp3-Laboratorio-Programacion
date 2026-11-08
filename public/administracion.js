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

  try {
    const [datosMateriales, datosProyectos] = await Promise.all([
      obtenerMateriales(),
      obtenerProyectos(),
    ]);

    // Cantidad de materiales
    cantMateriales.textContent = datosMateriales.total;

    // Lista de proyectos
    listaProyectos.innerHTML = "";

    datosProyectos.proyectos.forEach((proyecto) => {
      const li = document.createElement("li");
      li.textContent = proyecto.nombre;
      listaProyectos.appendChild(li);
    });

    // Valor total del stock
    const totalStock = datosMateriales.materiales.reduce((total, material) => {
      const stockReal =
        material.stockInicial + material.compras - material.enUso;

      return total + stockReal * material.costoUnitario;
    }, 0);

    const formatoMoneda = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    });

    valorTotalStock.textContent = formatoMoneda.format(totalStock);
  } catch (error) {
    console.error("Error al cargar el resumen:", error);
  }
});
