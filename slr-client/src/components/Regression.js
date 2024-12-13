import React, { useState } from "react";
import axios from "axios";

const Regression = () => {
const [xValues, setXValues] = useState("");
const [yValues, setYValues] = useState("");
const [predictX, setPredictX] = useState("");
const [results, setResults] = useState(null);
const [error, setError] = useState("");

const handleSubmit = async (e) => {
e.preventDefault();
try {
    const response = await axios.post("http://127.0.0.1:9800/regression/", {
    x: xValues.split(",").map(Number),
    y: yValues.split(",").map(Number),
    predict_x: predictX ? parseFloat(predictX) : null,
    });
    setResults(response.data);
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
    {error && <p className="text-red-500 mt-4">{error}</p>}
    {results && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg">
        <h2 className="font-bold">Resultados:</h2>
        <p>Intercepto (β₀): {results.beta_0.toFixed(4)}</p>
        <p>Pendiente (β₁): {results.beta_1.toFixed(4)}</p>
        <p>R²: {results.r2.toFixed(4)}</p>
        <p>R² Ajustado: {results.r2_adjusted.toFixed(4)}</p>
        <p>MSE: {results.mse.toFixed(4)}</p>
        <p>RMSE: {results.rmse.toFixed(4)}</p>
        <p>MAE: {results.mae.toFixed(4)}</p>
        {results.predicted_value !== null && (
            <p>
            Predicción para X={predictX}:{" "}
            {results.predicted_value.toFixed(4)}
            </p>
        )}
        </div>
    )}
    </div>
</div>
);
};

export default Regression;
