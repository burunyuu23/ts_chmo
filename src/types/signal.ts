export type DataPoint = {
    time: number,
    amplitude: number,
    envelope?: number
}
export type DataPointAmplitudes = Omit<DataPoint, "time">

export type Signal = {
    frequency: number,
    amplitude: number,
}