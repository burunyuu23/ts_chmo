import { DataPointAmplitudes, Signal } from "../types/signal";

export function fft(signal: DataPointAmplitudes[], frequency: number): Signal[] {
  const N = signal.length;
  const spectrum: Signal[] = [];

  for (let n = 0; n <= N*2; n++) {
    let sumReal = {harmonicAmplitude: 0, digitalAmplitude: 0};
    let sumImag = {harmonicAmplitude: 0, digitalAmplitude: 0};

    for (let t = 0; t < N; t++) {
      const angle = (2 * Math.PI * n * t) / N;
      sumReal.digitalAmplitude += signal[t].digitalAmplitude * Math.cos(angle);
      sumImag.digitalAmplitude -= signal[t].digitalAmplitude * Math.sin(angle);
      sumReal.harmonicAmplitude += signal[t].harmonicAmplitude * Math.cos(angle);
      sumImag.harmonicAmplitude -= signal[t].harmonicAmplitude * Math.sin(angle);
    }

    const digitalAmplitude = Math.sqrt(sumReal.digitalAmplitude ** 2 + sumImag.digitalAmplitude ** 2) / N;
    const harmonicAmplitude = Math.sqrt(sumReal.harmonicAmplitude ** 2 + sumImag.harmonicAmplitude ** 2) / N;
    
    spectrum.push({frequency: Number((n * frequency / N).toFixed(2)), amplitude: {harmonicAmplitude: harmonicAmplitude, digitalAmplitude: digitalAmplitude}});
  }

  return spectrum;
}