export type DataPoint = {
    time: number,
    amplitude: number,
}
export type DataPointAmplitudes = Omit<DataPoint, "time">

export type Signal = {
    frequency: number,
    amplitude: number
}