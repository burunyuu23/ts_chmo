import {ComplexNumber} from "./fft.ts";
import {DataPoint} from "../types/signal.ts";
import axios from "axios";

export function synthesizeAM(spectrum: ComplexNumber[]): ComplexNumber[] {

    const lowerCutoff = 64;


    for (let i = 0; i < spectrum.length; i++) {
        const amplitude = Math.sqrt(spectrum[i][0] ** 2 + spectrum[i][1] ** 2);

        if ((amplitude <= lowerCutoff)) {
            spectrum[i] = [0,0]
        }
    }
    return spectrum;
}

export class Service {

    static envelope = async (signal: DataPoint[]): Promise<{hilbert_transformed_signal: number[]}> => {
        const s = signal.map(val => val.amplitude)

        const ans: {hilbert_transformed_signal: number[]} = await axios.post<{ hilbert_transformed_signal: number[] }>('http://localhost:8001/process_signal/',{ signal: s })
            .then(req => req.data);
        return ans
    }

}

