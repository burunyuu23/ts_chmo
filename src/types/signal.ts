export type DataPoint = {
    time: number,
    harmonicAmplitude: number,
    digitalAmplitude: number,
}

export type DataPointAmplitudes = Omit<DataPoint, "time">

export type HarmonicDataPoint = Omit<DataPoint, "digitalAmplitude">;
export type DigitalDataPoint = Omit<DataPoint, "harmonicAmplitude">;

export type Signal = {
    frequency: number,
    amplitude: DataPointAmplitudes
}