import {all, create} from 'mathjs';

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
        const twiddleFactor = [Math.cos(angle), Math.sin(angle)] as ComplexNumber;
        twiddleFactors.push(twiddleFactor);
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

export function fft1D(inputData: ComplexNumber[]): ComplexNumber[] {
    const math = create(all);

    // Преобразуйте входные данные в формат, подходящий для mathjs
    const complexArray = inputData.map((value) => math.complex(value[0], value[1]));

    // Выполните FFT с использованием mathjs
    const fftResult = math.fft(complexArray);

    // Преобразуйте результат обратно в числовой массив
    const outputData: ComplexNumber[] = fftResult.map((value) => [value.re, value.im]);

    return outputData;
}

export function ifft2(spectrum: ComplexNumber[]): number[] {
    if (spectrum.length === 0)
        return []

    const math = create(all);

    // Преобразуйте входные данные в формат, подходящий для mathjs
    const complexArray = spectrum.map((value) => math.complex(value[0], value[1]));


    // Выполните IFFT с использованием mathjs
    const ifftResult = math.ifft(complexArray);

    // Преобразуйте результат обратно в числовой массив
    const outputData = ifftResult.map((value) => value.re);

    return outputData;
}

export function ifft22(signal: ComplexNumber[]): number[] {
    const N = signal.length;
    const ifftResult: number[] = [];

    for (let k = 0; k < N; k++) {
        let re = 0;

        for (let n = 0; n < N; n++) {
            const angle = (2 * Math.PI * k * n) / N;
            re += signal[n][0] * Math.cos(angle) + signal[n][1] * Math.sin(angle);
        }

        re /= N;

        ifftResult.push(re);
    }

    return ifftResult;
}

export const modulatingSineSyntez = (modulatedSpectrum: ComplexNumber[], carrierFreq: number, modulatingFreq: number) => {
    const spectrumSize = modulatedSpectrum.length;
    const spectrum = [...modulatedSpectrum];

    spectrum[modulatingFreq] = modulatedSpectrum[Math.abs(carrierFreq - modulatingFreq)]
    spectrum[spectrumSize - modulatingFreq] = modulatedSpectrum[Math.abs(carrierFreq - modulatingFreq)]

    if (Math.abs(carrierFreq - modulatingFreq) !== modulatingFreq) {
        spectrum[Math.abs(carrierFreq - modulatingFreq)] = [0, 0]
        if (carrierFreq !== modulatingFreq)
            spectrum[spectrumSize - Math.abs(carrierFreq - modulatingFreq)] = [0, 0]
    }
    spectrum[Math.abs(carrierFreq + modulatingFreq)] = [0, 0]
    spectrum[spectrumSize - Math.abs(carrierFreq + modulatingFreq)] = [0, 0]

    return spectrum;
};

export const modulatingSineFilter = (modulatedSpectrum: ComplexNumber[], carrierFreq: number, modulatingFreq: number) => {
    const spectrumSize = modulatedSpectrum.length;
    const spectrum = [...modulatedSpectrum];
    const range = Math.log2(carrierFreq * modulatingFreq ** 2);
    for (let index = 0; index < range; index++) {
        spectrum[carrierFreq] = [0, 0]
        spectrum[spectrumSize - carrierFreq] = [0, 0]
        if (carrierFreq - index > 0)
            spectrum[carrierFreq - index] = [0, 0]
        spectrum[carrierFreq + index] = [0, 0]
        spectrum[spectrumSize - carrierFreq - index] = [0, 0]
        if (spectrumSize - carrierFreq + index < spectrumSize)
            spectrum[spectrumSize - carrierFreq + index] = [0, 0]
        if (carrierFreq !== modulatingFreq) {
            spectrum[spectrumSize - Math.abs(carrierFreq - modulatingFreq)] = [0, 0]
        }

        if (Math.abs(carrierFreq + modulatingFreq) - index > 0)
            spectrum[Math.abs(carrierFreq + modulatingFreq - index)] = [0, 0]
        spectrum[Math.abs(carrierFreq + modulatingFreq + index)] = [0, 0]
        if (spectrumSize - Math.abs(carrierFreq + modulatingFreq) - index < spectrumSize)
            spectrum[spectrumSize - Math.abs(carrierFreq + modulatingFreq) - index] = [0, 0]
        spectrum[spectrumSize - Math.abs(carrierFreq + modulatingFreq) + index] = [0, 0]
    }
    return spectrum;
}

export const modulatingSquareSynthez = (modulatedSpectrum: ComplexNumber[], _: number, modulatingFreq: number) => {
    const spectrumSize = modulatedSpectrum.length;
    const spectrum = [...modulatedSpectrum];

    for (let index = 0; index < spectrumSize; index++) {
        if (!(((index / modulatingFreq) % 2 === 1) || index === modulatingFreq)) {
            spectrum[index] = [0, 0]
        }
    }

    return spectrum;
};

export const modulatingSquareFilter = (modulatedSpectrum: ComplexNumber[], carrierFreq: number, modulatingFreq: number) => {
    const spectrumSize = modulatedSpectrum.length;
    const spectrum = [...modulatedSpectrum];

    const range = 2;
    for (let index = 0; index < range; index++) {
        // Уберите боковые полосы, оставив только несущую частоту и её отраженные боковые полосы
        spectrum[carrierFreq] = [0, 0];
        spectrum[spectrumSize - carrierFreq] = [0, 0];
        spectrum[carrierFreq - index] = [0, 0];
        spectrum[spectrumSize - carrierFreq + index] = [0, 0];
        spectrum[carrierFreq + index] = [0, 0];
        spectrum[spectrumSize - carrierFreq - index] = [0, 0];

        // Уберите отраженные боковые полосы
        spectrum[Math.abs(carrierFreq + modulatingFreq - index)] = [0, 0];
        spectrum[Math.abs(carrierFreq + modulatingFreq + index)] = [0, 0];
        spectrum[spectrumSize - Math.abs(carrierFreq + modulatingFreq - index)] = [0, 0];
        spectrum[spectrumSize - Math.abs(carrierFreq + modulatingFreq + index)] = [0, 0];
    }

    return spectrum;
};


export type     ComplexNumber = [number, number];

export function complexAdd(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    return [a[0] + b[0], a[1] + b[1]];
}

export function complexSubtract(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    return [a[0] - b[0], a[1] - b[1]];
}

export function complexMultiply(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    const realPart = a[0] * b[0] - a[1] * b[1];
    const imaginaryPart = a[0] * b[1] + a[1] * b[0];
    return [realPart, imaginaryPart];
}

export function complexDivide(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    const realPart = (a[0] * b[0] + a[1] * b[1]) / (b[0] * b[0] + b[1] * b[1]);
    const imaginaryPart = (a[1] * b[0] - a[0] * b[1]) / (b[0] * b[0] + b[1] * b[1]);
    return [realPart, imaginaryPart];
}

export function complexDivideByConjugate(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    const conjugateB = [b[0], -b[1]];

    const realPart = (a[0] * conjugateB[0] + a[1] * conjugateB[1]) / (b[0] * b[0] + b[1] * b[1]);
    const imaginaryPart = (a[1] * conjugateB[0] - a[0] * conjugateB[1]) / (b[0] * b[0] + b[1] * b[1]);

    return [realPart, imaginaryPart];
}