import { useEffect, useState } from 'react';
import { DataPoint } from '../types/signal';
import { generateDigitalSignal, generateHarmonicSignal } from '../util/signals';
import SignalChart from '../widgets/signalChart';
import FFTChart from '../widgets/fftChart';
import styles from "./ChartPage.module.scss";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Slider from '@mui/material/Slider';
import { useDebounce } from "use-debounce";

const ChartPage = () => {
    const [signal, setSignal] = useState<DataPoint[]>([]);
    const [frequency, setFrequency] = useState<number>(8);
    const pointMarks = [
        {
            value: 10,
            label: '10 Гц',
        },
        {
            value: 200,
            label: '200 Гц',
        },
        {
            value: 500,
            label: '500 Гц',
        },
        {
            value: 1000,
            label: '1 КГц',
        },
        {
            value: 2000,
            label: '2 КГц',
        },
        {
            value: 5000,
            label: '5 КГц',
        },
    ]

    const [points, setPoints] = useState(500);
    const [debouncedPoints] = useDebounce(points, 500)

    const handleSliderPointsChange = (event: Event) => {    
        const target = event.target as HTMLInputElement;
        const value = Number(target.value);
        setPoints(value);
      };
  
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
                        <Button onClick={() => setFrequency(1)}>1 Гц</Button>
                        <Button onClick={() => setFrequency(2)}>2 Гц</Button>
                        <Button onClick={() => setFrequency(4)}>4 Гц</Button>
                        <Button onClick={() => setFrequency(8)}>8 Гц</Button>
                    </ButtonGroup>
                    
                    <div>
                        <h3>Частота дискретизации (количество точек в массиве сигнала):</h3>
                        <Slider
                            className={styles.slider}
                            aria-label="Always visible"
                            defaultValue={500}
                            max={5000}
                            min={10}
                            onChange={handleSliderPointsChange}
                            step={10}
                            marks={pointMarks}
                            valueLabelDisplay="auto"
                        />
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