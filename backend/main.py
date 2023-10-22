from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import numpy as np
from pydantic import BaseModel
from scipy.signal import hilbert

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class InputSignal(BaseModel):
    signal: list


@app.post("/process_signal/")
async def process_signal(signal_data: InputSignal):
    signal = np.array(signal_data.signal)
    hilbert_transformed_signal = np.abs(hilbert(np.real(signal)))
    return {"hilbert_transformed_signal": hilbert_transformed_signal.tolist()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
