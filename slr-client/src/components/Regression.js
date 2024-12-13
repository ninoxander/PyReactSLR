import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
Chart as ChartJS,
LineElement,
PointElement,
LinearScale,
CategoryScale,
Title,
Tooltip,
Legend,
} from "chart.js";

ChartJS.register(
LineElement,
PointElement,
LinearScale,
CategoryScale,
Title,
Tooltip,
Legend
);

const Regression = () => {
const [xValues, setXValues] = useState("");
const [yValues, setYValues] = useState("");
const [predictX, setPredictX] = useState("");
const [results, setResults] = useState(null);
const [chartData, setChartData] = useState(null);
const [error, setError] = useState("");

const handleSubmit = async (e) => {
e.preventDefault();
try {
    const response = await axios.post("http://127.0.0.1:9800/regression/", {
    x: xValues.split(",").map(Number),
    y: yValues.split(",").map(Number),
    predict_x: predictX ? parseFloat(predictX) : null,
    });

    const data = response.data;
    setResults(data);

    setChartData({
    labels: data.regression_line.x.map((val) => val.toFixed(2)),
    datasets: [
        {
        label: "Línea de Regresión",
        data: data.regression_line.y,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        },
        {
        label: "Datos Originales",
        data: data.original_data.y,
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderWidth: 0,
        pointRadius: 5,
        pointBackgroundColor: "rgba(255,99,132,1)",
        pointBorderColor: "rgba(255,99,132,1)",
        },
    ],
    });

    setError("");
} catch (err) {
    setError("Error al procesar los datos. Revisa las entradas.");
}
};

return (
<div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
    <h1 className="text-2xl font-bold mb-4 text-center">
        Regresión Lineal Simple
    </h1>
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <label className="block font-medium">
            Valores de X (separados por comas):
        </label>
        <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            value={xValues}
            onChange={(e) => setXValues(e.target.value)}
        />
        </div>
        <div>
        <label className="block font-medium">
            Valores de Y (separados por comas):
        </label>
        <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            value={yValues}
            onChange={(e) => setYValues(e.target.value)}
        />
        </div>
        <div>
        <label className="block font-medium">
            Valor de X para predecir (opcional):
        </label>
        <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            value={predictX}
            onChange={(e) => setPredictX(e.target.value)}
        />
        </div>
        <button
        type="submit"
        className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600"
        >
        Calcular
        </button>
    </form>
    {chartData && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <Line
            data={chartData}
            options={{
            responsive: true,
            plugins: {
                legend: {
                position: "top",
                labels: {
                    color: "white",
                },
                },
                title: {
                display: true,
                text: "Regresión Lineal",
                color: "white",
                },
            },
            scales: {
                x: {
                ticks: {
                    color: "white",
                },
                grid: {
                    color: "rgba(255, 255, 255, 0.2)",
                },
                },
                y: {
                ticks: {
                    color: "white",
                },
                grid: {
                    color: "rgba(255, 255, 255, 0.2)",
                },
                },
            },
            }}
        />
        </div>
    )}
    {error && <p className="text-red-500 mt-4">{error}</p>}
    {results && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg">
        <h2 className="font-bold">Resultados:</h2>
        <p>Intercepto (β₀): {results.coefficients.beta_0.toFixed(4)}</p>
        <p>Pendiente (β₁): {results.coefficients.beta_1.toFixed(4)}</p>
        <p>R²: {results.metrics.r2.toFixed(4)}</p>
        <p>MSE: {results.metrics.mse.toFixed(4)}</p>
        <p>MAE: {results.metrics.mae.toFixed(4)}</p>
        {results.predicted_value !== null && (
            <p>
            Predicción para X={predictX}: {results.predicted_value.toFixed(4)}
            </p>
        )}
        </div>
    )}
    </div>
</div>
);
};

export default Regression;
