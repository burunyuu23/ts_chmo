import { DigitalDataPoint, HarmonicDataPoint } from "../types/signal";

export const generateHarmonicSignal = (frequency: number, length: number): HarmonicDataPoint[] => {
    const signal: HarmonicDataPoint[] = [];

    for (let i = 0; i <= length; i++) {
        const time = i / length;
        const harmonicAmplitude = Math.sin(2 * Math.PI * frequency * time);
        signal.push({time, harmonicAmplitude });
    }
    return signal;
};

export const generateDigitalSignal = (frequency: number, duration: number): DigitalDataPoint[] => {
    const signal: DigitalDataPoint[] = [];
    const numSamples = Math.floor(frequency * duration);
  
    for (let i = 0; i <= numSamples; i++) {
        const time = i / duration;
        const digitalAmplitude = (Math.sin(2 * Math.PI * frequency * time) > 0) ? 1 : 0;
        signal.push({ time, digitalAmplitude });
    }
  
    return signal;
}