import {useEffect, useState} from 'react';
import styles from "./switchChart.module.scss";
import FFTChart from './fftChart';
import SignalChart from './signalChart';
import {DataPoint} from '../types/signal';
import {Button, ButtonGroup} from '@mui/material';
import {fft2, ifft2} from '../util/fft';
import {Service, synthesizeAM} from "../util/demodulation.ts";
import EnvelopeChart from "./envelopeChart.tsx";

type Props = {
    signal: DataPoint[],
    modulatingFreq: number,
    carrierFreq: number,
    color: string,
    signalChartName: string,
    fftChartName: string,
    modulatingType?: "sine" | "square",
    syntez?: boolean,
    filtred?: boolean
}

const SwitchChart = ({signal, modulatingFreq, carrierFreq, color, signalChartName, fftChartName, syntez, filtred}: Props) => {
    const [select, setSelect] = useState<"signal" | "spectre" | "syntez" | "syntez_spectre" | "filtred_spectre" | "filtred">("signal")

    const [syntezSignal, setSyntezSignal] = useState<DataPoint[]>([]);
    const [envelopeSignal, setEnvelopeSignal] = useState<DataPoint[]>([]);
    const [threshold] = useState<number>(0.5);


    useEffect(() => {

        const spectrum = fft2(signal.map((point) => [point.amplitude, 0]));
        const syntez = synthesizeAM(spectrum)

        setSyntezSignal(ifft2(syntez).map((val, index) => ({time: index / signal.length, amplitude: val/1.15})))
    }, [signal]);

    useEffect(() => {
        Service.envelope(syntezSignal)
            .then(data => {
                setEnvelopeSignal(data.hilbert_transformed_signal.map((val, index): DataPoint => ({
                    time: index / syntezSignal.length,
                    amplitude: syntezSignal[index].amplitude,
                    envelope: val
                })))
            })
    }, [syntezSignal]);

    if (signal.length === 0)
        return (<div></div>)

    const switchChart = (select: string) => {
        switch (select) {
            case "signal":
                return (<SignalChart signal={signal}
                                     name={signalChartName}
                                     color={color}/>);
            case "spectre":
                return (<FFTChart signal={signal}
                                  name={fftChartName}
                                  color={color}
                                  frequency={modulatingFreq}
                                  carrierFrequency={carrierFreq}
                                  right/>);
            case "syntez":
                return <EnvelopeChart signal={envelopeSignal}
                                      name={"Синтезированный сигнал"}
                                      secondName={'Огибающая'}
                                      color={color}
                />;
            case "syntez_spectre":
                return (<FFTChart signal={envelopeSignal}
                                  name={fftChartName}
                                  color={color}
                                  frequency={modulatingFreq}
                                  carrierFrequency={carrierFreq}
                                  right/>);
            case "filtred":
                return <EnvelopeChart signal={envelopeSignal.map((dataPoint) => (
                    {
                        time: dataPoint.time,
                        amplitude: Number(dataPoint.envelope! >= threshold),
                        envelope: dataPoint.envelope
                    }))}
                                      name={"Отфильтрованный сигнал"}
                                      secondName={"Огибающая"}
                                      color={color}
                />;
            case "filtred_spectre":
                return (<FFTChart signal={envelopeSignal.map((dataPoint) => (
                    {
                        time: dataPoint.time,
                        amplitude: Number(dataPoint.envelope! >= threshold),
                        envelope: dataPoint.envelope
                    }))}
                                  name={fftChartName}
                                  color={color}
                                  frequency={modulatingFreq}
                                  carrierFrequency={carrierFreq}
                                  right/>);
        }
    }

    return (
        <div className={styles.main}>
            <ButtonGroup orientation='vertical'>
                <Button variant={select !== "signal" ? "contained" : "outlined"} onClick={() => setSelect("signal")}>Сигнал</Button>
                <Button variant={select !== "spectre" ? "contained" : "outlined"} onClick={() => setSelect("spectre")}>Спектр</Button>
                {syntez === true && (
                    <Button variant={select !== "syntez" ? "contained" : "outlined"} onClick={() => setSelect("syntez")}>Синтез. сигнал</Button>)}
                {syntez === true && (
                    <Button variant={select !== "syntez_spectre" ? "contained" : "outlined"} onClick={() => setSelect("syntez_spectre")}>Синтез.
                        спектр</Button>)}
                {filtred === true && (
                    <Button variant={select !== "filtred" ? "contained" : "outlined"} onClick={() => setSelect("filtred")}>Фильтр. сигнал</Button>)}
                {filtred === true && (
                    <Button variant={select !== "filtred_spectre" ? "contained" : "outlined"} onClick={() => setSelect("filtred_spectre")}>Фильтр.
                        спектр</Button>)}
            </ButtonGroup>
            {switchChart(select)}
        </div>
    )
}

export default SwitchChart;