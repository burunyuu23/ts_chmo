export function fft2(signal: ComplexNumber[]): ComplexNumber[] {
  const N = signal.length;
  
  if (N <= 1) {
    return signal;
  }

  const evenSignal: ComplexNumber[] = [];
  const oddSignal: ComplexNumber[] = [];
  for (let i = 0; i < N; i++) {
    if (i % 2 === 0) {
      evenSignal.push(signal[i]);
    } else {
      oddSignal.push(signal[i]);
    }
  }

  const evenSpectrum = fft2(evenSignal);
  const oddSpectrum = fft2(oddSignal);

  const twiddleFactors: ComplexNumber[] = [];
  for (let k = 0; k < N / 2; k++) {
    const angle = (-2 * Math.PI * k) / N;
    twiddleFactors.push([Math.cos(angle), Math.sin(angle)]);
  }

  const spectrum: ComplexNumber[] = new Array(N);
  for (let k = 0; k < N / 2; k++) {
    const t = complexMultiply(twiddleFactors[k], oddSpectrum[k]);
    spectrum[k] = complexAdd(evenSpectrum[k], t);
    spectrum[k + N / 2] = complexSubtract(evenSpectrum[k], t);
  }

  return spectrum;
}

export function positiveFrequenciesSpectrum(signal: ComplexNumber[]): ComplexNumber[] {
  const N = signal.length;
  const spectrum = fft2(signal);

  const positiveSpectrum = new Array(N / 2);
  for (let k = 0; k < N / 2; k++) {
    positiveSpectrum[k] = spectrum[k];
  }

  return positiveSpectrum;
}


export type ComplexNumber = [number, number];

function complexAdd(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return [a[0] + b[0], a[1] + b[1]];
}

function complexSubtract(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return [a[0] - b[0], a[1] - b[1]];
}

function complexMultiply(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  const realPart = a[0] * b[0] - a[1] * b[1];
  const imaginaryPart = a[0] * b[1] + a[1] * b[0];
  return [realPart, imaginaryPart];
}