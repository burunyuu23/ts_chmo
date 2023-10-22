import { useEffect, useState } from 'react';
import { DataPoint } from '../types/signal';
import { generateDigitalSignal, generateHarmonicSignal } from '../util/signals';
import SignalChart from '../widgets/signalChart';
import FFTChart from '../widgets/fftChart';
import styles from "./ChartPage.module.scss";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

const ChartPage = () => {
    const pointMarks = [
        {
            value: 63,
            label: '64 Гц',
        },
        {
            value: 127,
            label: '128 Гц',
        },
        {
            value: 255,
            label: '256 Гц',
        },
        {
            value: 511,
            label: '512 Гц',
        },
        {
            value: 1023,
            label: '1024 Гц',
        },
        {
            value: 2047,
            label: '2048 Гц',
        },
        {
            value: 4095,
            label: '4096 Гц',
        },
    ]

    const [harmonicsignal, setHarmonicSignal] = useState<DataPoint[]>([]);
    const [digitalSignal, setDigitalSignal] = useState<DataPoint[]>([]);
    const [frequency, setFrequency] = useState<number>(8);

    const [points, setPoints] = useState(1023);
    
    useEffect(() => {
        const digital = generateDigitalSignal(frequency, points);

        const signal: DataPoint[] = digital.map((digitalDataPoint) => ({
            time: digitalDataPoint.time,
            amplitude: digitalDataPoint.amplitude,
        }));

        setDigitalSignal(signal);
        
    }, [frequency, points]);
  
    useEffect(() => {
        const harmonic = generateHarmonicSignal(frequency, points);

        const signal: DataPoint[] = harmonic.map((harmonicDataPoint) => ({
            time: harmonicDataPoint.time,
            amplitude: harmonicDataPoint.amplitude,
        }));

        setHarmonicSignal(signal);
        
    }, [frequency, points]);
    return (
        <main className={styles.main}>
            <aside>
                <div>
                    <h3>Частота сигнала:</h3>
                    <ButtonGroup variant="contained" aria-label="outlined button group">
                        <Button variant={frequency !== 1 ? "contained" : "outlined"} onClick={() => setFrequency(1)}>1 Гц</Button>
                        <Button variant={frequency !== 2 ? "contained" : "outlined"} onClick={() => setFrequency(2)}>2 Гц</Button>
                        <Button variant={frequency !== 4 ? "contained" : "outlined"} onClick={() => setFrequency(4)}>4 Гц</Button>
                        <Button variant={frequency !== 8 ? "contained" : "outlined"} onClick={() => setFrequency(8)}>8 Гц</Button>
                    </ButtonGroup>
                </div>
                    
                <div>
                    <h3>Частота дискретизации (количество точек в массиве сигнала):</h3>
                    <ButtonGroup variant="contained" aria-label="outlined button group">
                        {pointMarks.map(val => (
                            <Button key={val.value} variant={val.value !== points ? "contained" : "outlined"} onClick={() => setPoints(val.value)}>{val.label}</Button>
                        ))}
                    </ButtonGroup>
                </div>
            </aside>
            <div className={styles.chartPanel}>
                <div className={styles.chart}>
                    <h2>Сигналы (Частота: {frequency} Гц)</h2>
                    <div style={{display: "flex", justifyContent: "end"}}>
                        <SignalChart    signal={digitalSignal}
                                        name="Цифровой сигнал"
                                        color="#82ca9d"/>
                    </div>
                    <FFTChart   signal={digitalSignal}
                                frequency={frequency}
                                name='Спектр цифрового сигнала'
                                color="#82ca9d"/>
                </div>
                <div>
                    <h2>Спектры сигналов (с FFT)</h2>
                    <div className={styles.chart}>
                        <SignalChart    signal={harmonicsignal}
                                        name="Гармонический сигнал"
                                        color="#8884d8"/>
                        <FFTChart   signal={harmonicsignal}
                                    frequency={frequency}
                                    name='Спектр гармонического сигнала'
                                    color="#8884d8"
                                    right/>
                    </div>
                </div>
            </div>
        </main>
    )
};

export default ChartPage;