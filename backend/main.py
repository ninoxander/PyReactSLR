from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np

app = FastAPI()

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
            "/regression/": "Realiza cálculos de regresión lineal simple y devuelve datos para graficar"
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
    x_min, x_max = min(data.x), max(data.x)
    x_range = np.linspace(x_min, x_max, 100)
    y_line = beta_0 + beta_1 * x_range
    predicted_value = None
    if data.predict_x is not None:
        predicted_value = beta_0 + beta_1 * data.predict_x

    return {
        "coefficients": {"beta_0": beta_0, "beta_1": beta_1},
        "metrics": {
            "r2": 1 - (np.sum((y - y_pred) ** 2) / np.sum((y - np.mean(y)) ** 2)),
            "mse": np.mean((y - y_pred) ** 2),
            "mae": np.mean(np.abs(y - y_pred)),
        },
        "original_data": {"x": data.x, "y": data.y},
        "regression_line": {"x": x_range.tolist(), "y": y_line.tolist()},
        "predicted_value": predicted_value,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=9800)
