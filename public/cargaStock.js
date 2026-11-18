document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.querySelector("form");

    formulario.addEventListener("submit", async (e) => {

        e.preventDefault();

        try {

            // Traemos todos los materiales existentes
            const respuesta = await fetch("/api/materiales");

            if (!respuesta.ok) {
                throw new Error("No se pudieron obtener los materiales");
            }

            const datos = await respuesta.json();

            const materialesBD = datos.materiales;

            const materialesFormulario = [
                {
                    nombre: "EPS X 120-20",
                    stockInicial: Number(document.getElementById("EPS-120-20").value.trim())
                },
                {
                    nombre: "EPS X 92-20",
                    stockInicial: Number(document.getElementById("EPS-92-20").value.trim())
                },
                {
                    nombre: "OSB 9,5 X U",
                    stockInicial: Number(document.getElementById("OSB-9-5").value.trim())
                },
                {
                    nombre: "OSB 18,1 X U",
                    stockInicial: Number(document.getElementById("OSB-18-1").value.trim())
                },
                {
                    nombre: "ADHESIVO VINÍLICO X 20 KG",
                    stockInicial: Number(document.getElementById("adhesivo-vinilico").value.trim())
                },
                {
                    nombre: "Adhesivo poliuretánico POLIKAL",
                    stockInicial: Number(document.getElementById("adhesivo-polikal").value.trim())
                },
                {
                    nombre: "SHS 3,5-40 x 50U",
                    stockInicial: Number(document.getElementById("SHS-3-5-40").value.trim())
                },
                {
                    nombre: "SNK/HBS 6-100 x 100U",
                    stockInicial: Number(document.getElementById("SNK-HBS-6-100").value.trim())
                },
                {
                    nombre: "TUBO POLIURETANO 750 FISCHER",
                    stockInicial: Number(document.getElementById("tubo-poliuretanico").value.trim())
                },
                {
                    nombre: "MEMBRANA ACÚSTICA, rollo 50 m²",
                    stockInicial: Number(document.getElementById("membrana-acustica").value.trim())
                }
            ];

            for (const item of materialesFormulario) {

                if (item.stockInicial === 0) {
                    continue;
                }
                const materialBD = materialesBD.find(
                    material =>
                        material.nombre.toLowerCase() === item.nombre.toLowerCase()
                );

                if (!materialBD) {
                    console.warn(
                        `No se encontró el material ${item.nombre}`
                    );
                    continue;
                }

                await fetch(`/api/materiales/${materialBD._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        stockInicial: Number(item.stockInicial)
                    })
                });
            }

            alert("Stock actualizado correctamente");
            formulario.reset();
        } catch (error) {

            console.error(error);

            alert(
                "Ocurrió un error al actualizar el stock"
            );
        }
    });
});