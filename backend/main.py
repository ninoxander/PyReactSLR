from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

app = FastAPI()

class RegressionData(BaseModel):
    x: list[float]  
    y: list[float]  
    predict_x: float = None  

@app.get("/")
def home():
    return {
        "name": "SLR API",
        "by": "Daniela Ivette Nava Miranda"
    }

@app.post("/regression/")
def perform_regression(data: RegressionData):
    x = np.array(data.x).reshape(-1, 1)
    y = np.array(data.y)

    # Validar tamaño de los datos
    if len(x) != len(y):
        return {"error": "Las listas de X e Y deben tener la misma longitud"}

    # Crear la matriz de diseño
    X_design = np.hstack((np.ones((x.shape[0], 1)), x))

    # Calcular los coeficientes (beta_0 y beta_1)
    betas = np.linalg.inv(X_design.T @ X_design) @ X_design.T @ y
    beta_0, beta_1 = betas

    # Predicciones para los datos
    y_pred = X_design @ betas

    # Cálculo de métricas
    ss_total = np.sum((y - np.mean(y)) ** 2)  # Suma total de cuadrados
    ss_residual = np.sum((y - y_pred) ** 2)  # Suma de cuadrados residuales
    ss_regression = ss_total - ss_residual  # Suma de cuadrados de la regresión
    r2 = 1 - (ss_residual / ss_total)  # Coeficiente de determinación
    r2_adjusted = 1 - ((1 - r2) * (len(y) - 1) / (len(y) - 2))  # R^2 ajustado
    mse = ss_residual / len(y)  # Error cuadrático medio
    rmse = np.sqrt(mse)  # Raíz del error cuadrático medio
    mae = np.mean(np.abs(y - y_pred))  # Error absoluto medio
    correlation = np.sqrt(r2)  # Coeficiente de correlación

    # Residuos
    residuals = y - y_pred

    # Predicción de un nuevo valor
    predicted_value = None
    if data.predict_x is not None:
        predicted_value = beta_0 + beta_1 * data.predict_x

    # Resumen estadístico de los datos
    x_mean = np.mean(data.x)
    y_mean = np.mean(data.y)
    x_std_dev = np.std(data.x)
    y_std_dev = np.std(data.y)

    # Respuesta
    return {
        "beta_0": beta_0,
        "beta_1": beta_1,
        "r2": r2,
        "r2_adjusted": r2_adjusted,
        "mse": mse,
        "rmse": rmse,
        "mae": mae,
        "correlation": correlation,
        "residuals": residuals.tolist(),
        "x_mean": x_mean,
        "y_mean": y_mean,
        "x_std_dev": x_std_dev,
        "y_std_dev": y_std_dev,
        "predicted_value": predicted_value,
        "diagnostic": "El modelo es adecuado" if r2 > 0.7 else "El modelo puede ser mejorado"
    }

# Iniciar el servidor
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9800)
