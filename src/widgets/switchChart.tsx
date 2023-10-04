import { useState } from 'react';
import styles from "./switchChart.module.scss";
import FFTChart from './fftChart';
import SignalChart from './signalChart';
import { DataPoint } from '../types/signal';
import { ButtonGroup, Button } from '@mui/material';
import { modulatingSineSyntez, fft2, ifft2, modulatingSineFilter, modulatingSquareSynthez, modulatingSquareFilter } from '../util/fft';

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

const switchChart = ({signal, modulatingFreq, carrierFreq ,  color, signalChartName, fftChartName, modulatingType, syntez, filtred}: Props) => {
    const [select, setSelect] = useState<"signal" | "spectre" | "syntez" | "syntez_spectre" | "filtred_spectre" | "filtred">("signal")

    const modulatingSyntez = modulatingType === "sine" ? modulatingSineSyntez : modulatingSquareSynthez
    const modulatingFilter = modulatingType === "sine" ? modulatingSineFilter : modulatingSquareFilter

    if (signal.length === 0)
        return (<div></div>)

    const switchChart = (select: string) => {
        switch(select) {
            case "signal":
                return (<SignalChart    signal={signal}
                                        name={signalChartName}
                                        color={color}/>);
            case "spectre":
                return (<FFTChart   signal={signal}
                                    name={fftChartName}
                                    color={color}
                                    frequency={modulatingFreq}
                                    right/>);
            case "syntez":
                return (<SignalChart    signal={(() => {
                        const spectrum = fft2(signal.map((point) => ([point.amplitude * 2, 0]))); 
                        const syntez = modulatingSyntez(spectrum, carrierFreq, modulatingFreq)
                        
                        const signalFromSpectrum = ifft2(syntez).map((val, index) => ({time: index / signal.length, amplitude: val[0]/spectrum.length}))
                        return signalFromSpectrum;
                    })()}
                                        name={signalChartName}
                                        color={color}/>);
            case "syntez_spectre":
                    return (<FFTChart   signal={(() => {
                        const spectrum = fft2(signal.map((point) => ([point.amplitude * 2, 0]))); 
                        const syntez = modulatingSyntez(spectrum, carrierFreq, modulatingFreq)
                        const signalFromSpectrum = ifft2(syntez).map((val, index) => ({time: index / signal.length, amplitude: val[0]/spectrum.length}))
                        return signalFromSpectrum;
                    })()}
                                        name={fftChartName}
                                        color={color}
                                        frequency={modulatingFreq}
                                        right/>);
            case "filtred_spectre":
                return (<FFTChart   signal={(() => {
                    const spectrum = fft2(signal.map((point) => ([point.amplitude * 2, 0]))); 
                    const syntez = modulatingSyntez(spectrum, carrierFreq, modulatingFreq)
                    const filtred = modulatingFilter(syntez, carrierFreq, modulatingFreq)
                    const signalFromSpectrum = ifft2(filtred).map((val, index) => ({time: index / signal.length, amplitude: val[0]/spectrum.length}))
                    return signalFromSpectrum;
                })()}
                                    name={fftChartName}
                                    color={color}
                                    frequency={modulatingFreq}
                                    right/>);
            case "filtred":
                return (<SignalChart    signal={(() => {
                        const spectrum = fft2(signal.map((point) => ([point.amplitude * 2, 0]))); 
                        const syntez = modulatingSyntez(spectrum, carrierFreq, modulatingFreq)
                        const filtred = modulatingFilter(syntez, carrierFreq, modulatingFreq)
                        
                        const signalFromSpectrum = ifft2(filtred).map((val, index) => ({time: index / signal.length, amplitude: val[0]/spectrum.length}))
                        return signalFromSpectrum;
                    })()}
                                        name={signalChartName}
                                        color={color}/>);
        }
    }

    return (
        <div className={styles.main}>
            <ButtonGroup orientation='vertical'>
                <Button variant={select !== "signal" ? "contained" : "outlined"}  onClick={() => setSelect("signal")}>Сигнал</Button>
                <Button variant={select !== "spectre" ? "contained" : "outlined"}  onClick={() => setSelect("spectre")}>Спектр</Button>
                {syntez === true && (<Button variant={select !== "syntez" ? "contained" : "outlined"}  onClick={() => setSelect("syntez")}>Синтез. сигнал</Button>)}
                {syntez === true && (<Button variant={select !== "syntez_spectre" ? "contained" : "outlined"}  onClick={() => setSelect("syntez_spectre")}>Синтез. спектр</Button>)}
                {filtred === true && (<Button variant={select !== "filtred" ? "contained" : "outlined"}  onClick={() => setSelect("filtred")}>Фильтр. сигнал</Button>)}
                {filtred === true && (<Button variant={select !== "filtred_spectre" ? "contained" : "outlined"}  onClick={() => setSelect("filtred_spectre")}>Фильтр. спектр</Button>)}
            </ButtonGroup>
            {switchChart(select)}
        </div>
    )
}

export default switchChart;