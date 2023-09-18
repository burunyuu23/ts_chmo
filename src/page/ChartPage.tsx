import { useEffect, useState } from 'react';
import { DataPoint } from '../types/signal';
import { generateDigitalSignal, generateHarmonicSignal } from '../util/signals';
import SignalChart from '../widgets/signalChart';
import FFTChart from '../widgets/fftChart';
import styles from "./ChartPage.module.scss";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useDebounce } from "use-debounce";

const ChartPage = () => {
    const [signal, setSignal] = useState<DataPoint[]>([]);
    const [frequency, setFrequency] = useState<number>(8);
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

    const [points, setPoints] = useState(1023);
    const [debouncedPoints] = useDebounce(points, 500)
  
    useEffect(() => {
        const harmonic = generateHarmonicSignal(frequency, debouncedPoints);
        const digital = generateDigitalSignal(frequency, debouncedPoints);

        const signal: DataPoint[] = harmonic.map((harmonicDataPoint, index) => ({
            time: harmonicDataPoint.time,
            harmonicAmplitude: harmonicDataPoint.harmonicAmplitude,
            digitalAmplitude: digital[index].digitalAmplitude,
        }));

        setSignal(signal);
        
    }, [frequency, debouncedPoints]);
    return (
        <main className={styles.main}>
            <aside>
                <h2>Панель управления</h2>
                    <h3>Частота сигнала:</h3>
                    <ButtonGroup variant="contained" aria-label="outlined button group">
                        <Button variant={frequency !== 1 ? "contained" : "outlined"} onClick={() => setFrequency(1)}>1 Гц</Button>
                        <Button variant={frequency !== 2 ? "contained" : "outlined"} onClick={() => setFrequency(2)}>2 Гц</Button>
                        <Button variant={frequency !== 4 ? "contained" : "outlined"} onClick={() => setFrequency(4)}>4 Гц</Button>
                        <Button variant={frequency !== 8 ? "contained" : "outlined"} onClick={() => setFrequency(8)}>8 Гц</Button>
                    </ButtonGroup>
                    
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
                    <SignalChart signal={signal} />
                </div>
                <div className={styles.chart}>
                    <h2>Спектры сигналов (с FFT)</h2>
                    <FFTChart signal={signal} frequency={frequency}/> 
                </div>
            </div>
        </main>
    )
};

export default ChartPage;