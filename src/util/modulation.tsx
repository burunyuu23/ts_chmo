import { DataPoint } from "../types/signal";

export function amplitudeModulation(carrierSignal: number[], modulationSignal: number[]): DataPoint[] {

    return carrierSignal.map((value, index) => {
        const time = index / carrierSignal.length;
        const modulatedAmplitude = value * modulationSignal[index];
        return { time, amplitude: modulatedAmplitude };
    });
}

export function frequencyModulation(
    carrierSignal: number[],
    modulationSignal: number[],
    modulationFrequency: number,
    carrierFrequency: number
): DataPoint[] {
    return carrierSignal.map((_, index) => {
        const time = index / carrierSignal.length;
        
        const phaseModulation = modulationSignal[index] * modulationFrequency;
        const modulatedPhase = 2 * Math.PI * carrierFrequency * time + phaseModulation;
        const modulatedAmplitude = Math.cos(modulatedPhase);
        
        return { time, amplitude: modulatedAmplitude };
    });
}

export function phaseModulation(
    carrierSignal: number[],
    modulationSignal: number[],
    modulationFrequency: number,
    carrierFrequency: number
): DataPoint[] {
    return carrierSignal.map((_, index) => {
        const time = index / carrierSignal.length;
        
        const phaseModulation = modulationSignal[index] * modulationFrequency;
        const modulatedPhase = 2 * Math.PI * (carrierFrequency + phaseModulation) * time;
        const modulatedAmplitude = Math.cos(modulatedPhase);
        
        return { time, amplitude: modulatedAmplitude };
    });
}


// Function for Amplitude Modulation (AM)
export function amplitudeModulation2(carrierSignal: number[], modulatingSignal: number[]): DataPoint[] {
  if (carrierSignal.length !== modulatingSignal.length) {
    throw new Error("Both carrierSignal and modulatingSignal must have the same length.");
  }

  return modulatingSignal.map((modulationValue, index) => {
    const amplitude = (modulationValue) * carrierSignal[index];
    const time = index / carrierSignal.length;
    return { time, amplitude };
  });
}

// Function for Frequency Modulation (FM)
export function frequencyModulation2(
  modulatingFrequency: number,
  carrierFrequency: number,
  duration: number,
  modulationType: "sine" | "square" = "sine",
  phase: number = 0,
  modulatingPhase: number = 0,
  carrierPhase: number = 0
): DataPoint[] {
  const modulatedSignal: DataPoint[] = [];

  const modulatingFunction = modulationType === "sine"
    ? (time: number) => Math.sin(2 * Math.PI * modulatingFrequency * time + phase*modulatingPhase)
    : (time: number) => Math.sin(2 * Math.PI * modulatingFrequency * time + phase*modulatingPhase) >= 0 ? 1 : -1;

  for (let i = 0; i < duration; i++) {
    const time = i / duration;
    const amplitude = Math.cos(2 * Math.PI * (carrierFrequency + modulatingFunction(time)) * time + phase*carrierPhase);
    modulatedSignal.push({ time, amplitude });
  }

  return modulatedSignal;
}

// Function for Phase Modulation (PM)
export function phaseModulation2(
  modulatingFrequency: number,
  carrierFrequency: number,
  duration: number,
  modulationType: "sine" | "square" = "sine",
  phase: number = 0,
  modulatingPhase: number = 0,
  carrierPhase: number = 0
): DataPoint[] {
  const modulatedSignal: DataPoint[] = [];

  const modulatingFunction = modulationType === "sine"
    ? (time: number) => Math.sin(2 * Math.PI * modulatingFrequency * time + phase*modulatingPhase)
    : (time: number) => Math.sin(2 * Math.PI * modulatingFrequency * time + phase*modulatingPhase) >= 0 ? 1 : -1;

  for (let i = 0; i < duration; i++) {
    const time = i / duration;
    const amplitude = Math.cos(2 * Math.PI * carrierFrequency * time + (modulatingFunction(time)) + phase*carrierPhase);
    modulatedSignal.push({ time, amplitude });
  }

  return modulatedSignal;
}