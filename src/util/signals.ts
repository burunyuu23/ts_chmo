import { DataPoint } from "../types/signal";

export const generateHarmonicSignal = (frequency: number, length: number, phase?: number): DataPoint[] => {
    const signal: DataPoint[] = [];

    for (let i = 0; i <= length; i++) {
        const time = i / length;
        signal.push(generateMomentHarmonicSignal(frequency, time, phase));
    }
    return signal;
};

export const generateMomentHarmonicSignal = (frequency: number, time: number, phase?: number): DataPoint => {
    return {time: time, amplitude: Math.sin(2 * Math.PI * frequency * time + (phase ?? 0) + Math.PI/2)};
};

export const generateDigitalSignal = (frequency: number, duration: number, phase?: number): DataPoint[] => {
    const signal: DataPoint[] = [];

    // const randomPhase = (Math.random() - 0.5) * frequency;
  
    for (let i = 0; i <= duration; i++) {
        const time = i / duration;
        signal.push(generateMomentDigitalSignal(frequency, time, phase));
    }
  
    return signal;
}

export const generateMomentDigitalSignal = (frequency: number, time: number, phase?: number): DataPoint => {
    return {time: time, amplitude: Math.sin(2 * Math.PI * frequency * time + (phase ?? 0)) >= 0 ? 1 : 0};
};