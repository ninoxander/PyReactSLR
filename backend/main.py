from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

class RegressionData(BaseModel):
    x: list[float]
    y: list[float]
    predict_x: float = None

@app.get("/")
def home():
    return {
        "message": "Bienvenido a la API de Regresión Lineal Simple",
        "author": "Daniela Ivette Nava Miranda",
        "endpoints": {
            "/": "Información básica de la API",
            "/regression/": "Realiza cálculos de regresión lineal simple"
        }
    }

@app.post("/regression/")
def perform_regression(data: RegressionData):
    x = np.array(data.x).reshape(-1, 1)
    y = np.array(data.y)

    if len(x) != len(y):
        return {"error": "Las listas de X e Y deben tener la misma longitud"}

    X_design = np.hstack((np.ones((x.shape[0], 1)), x))
    betas = np.linalg.inv(X_design.T @ X_design) @ X_design.T @ y
    beta_0, beta_1 = betas
    y_pred = X_design @ betas

    ss_total = np.sum((y - np.mean(y)) ** 2)
    ss_residual = np.sum((y - y_pred) ** 2)
    r2 = 1 - (ss_residual / ss_total)
    r2_adjusted = 1 - ((1 - r2) * (len(y) - 1) / (len(y) - 2))
    mse = ss_residual / len(y)
    rmse = np.sqrt(mse)
    mae = np.mean(np.abs(y - y_pred))
    correlation = np.sqrt(r2)
    residuals = y - y_pred

    predicted_value = None
    if data.predict_x is not None:
        predicted_value = beta_0 + beta_1 * data.predict_x

    x_mean = np.mean(data.x)
    y_mean = np.mean(data.y)
    x_std_dev = np.std(data.x)
    y_std_dev = np.std(data.y)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9800)
