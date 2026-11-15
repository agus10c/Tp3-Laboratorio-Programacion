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
                    stockInicial: Number(document.getElementById("EPS-120-20").value) || 0
                },
                {
                    nombre: "EPS X 92-20",
                    stockInicial: Number(document.getElementById("EPS-92-20").value) || 0
                },
                {
                    nombre: "OSB 9,5 X U",
                    stockInicial: Number(document.getElementById("OSB-9-5").value) || 0
                },
                {
                    nombre: "OSB 18,1 X U",
                    stockInicial: Number(document.getElementById("OSB-18-1").value) || 0
                },
                {
                    nombre: "ADHESIVO VINÍLICO X 20 KG",
                    stockInicial: Number(document.getElementById("adhesivo-vinilico").value) || 0
                },
                {
                    nombre: "Adhesivo poliuretánico POLIKAL",
                    stockInicial: Number(document.getElementById("adhesivo-polikal").value) || 0
                },
                {
                    nombre: "SHS 3,5-40 x 50U",
                    stockInicial: Number(document.getElementById("SHS-3-5-40").value) || 0
                },
                {
                    nombre: "SNK/HBS 6-100 x 100U",
                    stockInicial: Number(document.getElementById("SNK-HBS-6-100").value) || 0
                },
                {
                    nombre: "TUBO POLIURETANO 750 FISCHER",
                    stockInicial: Number(document.getElementById("tubo-poliuretanico").value) || 0
                },
                {
                    nombre: "MEMBRANA ACÚSTICA, rollo 50 m²",
                    stockInicial: Number(document.getElementById("membrana-acustica").value) || 0
                }
            ];

            for (const item of materialesFormulario) {

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
                        stockInicial: item.stockInicial
                    })
                });
            }

            alert("Stock actualizado correctamente");

        } catch (error) {

            console.error(error);

            alert(
                "Ocurrió un error al actualizar el stock"
            );
        }
    });
});