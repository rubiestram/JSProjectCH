document.addEventListener('DOMContentLoaded', function () {
    const nombreInput = document.getElementById('nombre');
    const montoSelect = document.getElementById('monto');
    const duracionInput = document.getElementById('duracion');
    const calcularButton = document.getElementById('calcular');
    const resultadoDiv = document.getElementById('resultado');
    const graficoInteresCanvas = document.getElementById('graficoInteres');

    calcularButton.addEventListener('click', function () {
        const nombre = nombreInput.value.trim();
        const monto = parseInt(montoSelect.value);
        const duracion = parseInt(duracionInput.value);

        if (!nombre || isNaN(monto) || isNaN(duracion) || monto < 1000 || monto > 50000 || duracion <= 0) {
            resultadoDiv.textContent = 'Por favor ingrese datos válidos.';
            return;
        }

        const pagoMensual = calcularPagoMensual(monto, duracion);
        resultadoDiv.textContent = `${nombre}, el pago mensual será de ${pagoMensual.toFixed(2)} pesos.`;

        cargarTasasInteres().then(data => {
            const datosInteres = data.map(tasa => tasa.tasa);
            const duraciones = data.map(tasa => `${tasa.duracion} meses`);
            mostrarGraficoInteres(graficoInteresCanvas, duraciones, datosInteres);
        }).catch(error => {
            console.error('Error al cargar las tasas de interés:', error);
        });
    });

    function calcularPagoMensual(monto, duracion) {
        const tasaInteres = 10; // Tasa de interés fija
        const tasaInteresMensual = tasaInteres / 100 / 12;
        const totalPagos = duracion;
        const base = Math.pow(1 + tasaInteresMensual, totalPagos);
        const pagoMensual = (monto * base * tasaInteresMensual) / (base - 1);
        return pagoMensual;
    }

    function cargarTasasInteres() {
        return new Promise((resolve, reject) => {
            fetch('tasas_interes.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al cargar las tasas de interés.');
                    }
                    return response.json();
                })
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    }

    function mostrarGraficoInteres(canvas, etiquetas, datos) {
        const ctx = canvas.getContext('2d');
        const grafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: etiquetas,
                datasets: [{
                    label: 'Tasa de interés (%)',
                    data: datos,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});
