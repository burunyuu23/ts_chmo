import { useEffect, useState } from 'react';
import styles from "./Task2Page.module.scss";
import { generateDigitalSignal, generateHarmonicSignal } from '../util/signals';
import { DataPoint } from '../types/signal';
import SignalChart from '../widgets/signalChart';
import { Button, ButtonGroup, MenuItem, Select } from '@mui/material';
import { amplitudeModulation2, frequencyModulation2, phaseModulation2 } from '../util/modulation';
import SwitchChart from '../widgets/switchChart';

type Props = {
}

const Task2Page = ({}: Props) => {
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

    const frequencies = [1, 2, 4, 8, 16, 32, 64]

    const [modulatingSignal, setModulatingSignal] = useState<DataPoint[]>([]);
    const [carrierSignal, setCarrierSignal] = useState<DataPoint[]>([]);

    const [modulatingFrequency, setModulatingFrequency] = useState<number>(1);
    const [carrierFrequency, setCarrierFrequency] = useState<number>(2);

    const [points, setPoints] = useState(1023);

    const [modulatingType, setModulatingType] = useState<"sine" | "square">("square");
    const [carrierType, setCarrierType] = useState<"sine" | "square">("sine");


    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const handleModulatingChange = (e) => {
        setModulatingType(e.target.value);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const handleCarrierChange = (e) => {
        setCarrierType(e.target.value);
    }

    const [time, setTime] = useState(0);
    const [carrierTime, setCarrierTime] = useState(0.25)
    const [modulatingTime, setModulatingTime] = useState(0)

    const [frame, setFrame] = useState<number | null>(null);

    const updateTime = () => {
        setTime(prev => prev + 0.1);
        setFrame(requestAnimationFrame(updateTime));
        
        if (frame !== null && frame > 1000) {
            cancelAnimationFrame(frame);
        }
    }

    useEffect(() => {
        if (frame === null) {
            updateTime();
        }
    }, [])
  
    
    useEffect(() => {
        const carrier = carrierType == "sine" ? generateHarmonicSignal(carrierFrequency, points, time * carrierTime * carrierFrequency) : generateDigitalSignal(carrierFrequency, points, time * carrierTime * carrierFrequency);

        const signal: DataPoint[] = carrier.map((digitalDataPoint) => ({
            time: digitalDataPoint.time,
            amplitude: digitalDataPoint.amplitude,
        }));

        setCarrierSignal(signal);
        
    }, [carrierFrequency, carrierType, points, time, carrierTime]);

    useEffect(() => {
        const modulating = modulatingType == "sine" ? generateHarmonicSignal(modulatingFrequency, points, time * modulatingTime * modulatingFrequency) : generateDigitalSignal(modulatingFrequency, points, time * modulatingTime * modulatingFrequency);

        const signal: DataPoint[] = modulating.map((harmonicDataPoint) => ({
            time: harmonicDataPoint.time,
            amplitude: harmonicDataPoint.amplitude
        }));

        setModulatingSignal(signal);
        
    }, [modulatingFrequency, modulatingType, points, time, modulatingTime]);

    return (
    <div className={styles.main}>
            
        <div className={styles.chartPanel}>
            <div className={styles.chart}><aside>
                <div className={styles.settingsPanel}>
                    <div className={styles.settingsPanelText}>
                        <div className={styles.modulatingText}>
                            <h3>Частота модулирующего </h3> 
                            <Select
                                className={styles.select}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={modulatingType}
                                label="Тип сигнала"
                                onChange={handleModulatingChange}
                            > 
                                <MenuItem value={"sine"}>гармонического</MenuItem>
                                <MenuItem value={"square"}>цифрового</MenuItem>
                            </Select>  
                            <h3>сигнала:</h3>
                        </div>
                        <ButtonGroup variant="contained" aria-label="outlined button group">
                            {frequencies.map(val => (
                            <Button variant={modulatingFrequency !== val ? "contained" : "outlined"} onClick={() => setModulatingFrequency(val)}>{val} Гц</Button>
                            ))}
                        </ButtonGroup>
                    </div>
                    <div className={styles.settingsPanelText}>
                        <div className={styles.modulatingText}>
                            <h3>Частота несущего </h3> 
                            <Select
                                className={styles.select}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={carrierType}
                                label="Тип сигнала"
                                onChange={handleCarrierChange}
                            > 
                                <MenuItem value={"sine"}>гармонического</MenuItem>
                            </Select>  
                            <h3>сигнала:</h3>
                        </div>
                        <ButtonGroup variant="contained" aria-label="outlined button group">
                            {frequencies.map(val => (
                            <Button variant={carrierFrequency !== val ? "contained" : "outlined"} onClick={() => setCarrierFrequency(val)}>{val} Гц</Button>
                            ))}
                        </ButtonGroup>
                    </div>
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
                <h2>Сигналы</h2>
                <div className={styles.charts}>
                    <ButtonGroup className={styles.chartsButtonGroup} variant="contained" aria-label="outlined button group" orientation='vertical'>
                        <Button variant={modulatingTime !== 0 ? "contained" : "outlined"} onClick={() => setModulatingTime(0)}>STOP</Button>
                        <Button variant={modulatingTime !== 0.25 ? "contained" : "outlined"} onClick={() => setModulatingTime(0.25)}>0.25x</Button>
                        <Button variant={modulatingTime !== 0.5 ? "contained" : "outlined"} onClick={() => setModulatingTime(0.5)}>0.5x</Button>
                        <Button variant={modulatingTime !== 0.75 ? "contained" : "outlined"} onClick={() => setModulatingTime(0.75)}>0.75x</Button>
                        <Button variant={modulatingTime !== 1 ? "contained" : "outlined"} onClick={() => setModulatingTime(1)}>1x</Button>
                    </ButtonGroup>
                    <SignalChart signal={modulatingSignal} name="Модулирующий сигнал" color="#82ca9d"/>
                </div>
                <div className={styles.charts}>
                    <ButtonGroup className={styles.chartsButtonGroup} variant="contained" aria-label="outlined button group" orientation='vertical'>
                        <Button variant={carrierTime !== 0 ? "contained" : "outlined"} onClick={() => setCarrierTime(0)}>STOP</Button>
                        <Button variant={carrierTime !== 0.25 ? "contained" : "outlined"} onClick={() => setCarrierTime(0.25)}>0.25x</Button>
                        <Button variant={carrierTime !== 0.5 ? "contained" : "outlined"} onClick={() => setCarrierTime(0.5)}>0.5x</Button>
                        <Button variant={carrierTime !== 0.75 ? "contained" : "outlined"} onClick={() => setCarrierTime(0.75)}>0.75x</Button>
                        <Button variant={carrierTime !== 1 ? "contained" : "outlined"} onClick={() => setCarrierTime(1)}>1x</Button>
                    </ButtonGroup>
                    <SignalChart signal={carrierSignal} name="Несущий сигнал" color="#8884d8"/>
                </div>
            </div>
            <div className={styles.modulatedCharts}>
                <hr style={{position: "absolute", height: "100%", left: "-1.5%"}}/>
                <SwitchChart    signal={amplitudeModulation2(carrierSignal.map(val => val.amplitude), modulatingSignal.map(val => val.amplitude))} 
                                modulatingFreq={modulatingFrequency}
                                carrierFreq={carrierFrequency}
                                color={'#5e76e2'} 
                                signalChartName={'Амплитудная модуляция'}      
                                fftChartName={'Спектр амплитудной модуляции'}
                                modulatingType={modulatingType}
                                syntez
                                filtred/>
                <SwitchChart    signal={frequencyModulation2(modulatingFrequency, carrierFrequency, carrierSignal.length, modulatingType, time, modulatingTime, carrierTime)}
                                modulatingFreq={modulatingFrequency}
                                carrierFreq={carrierFrequency}
                                color={'#d88884'} 
                                signalChartName={'Частотная модуляция'}      
                                fftChartName={'Спектр частотной модуляции'}/>
                <SwitchChart    signal={phaseModulation2(modulatingFrequency, carrierFrequency, carrierSignal.length, modulatingType, time, modulatingTime * modulatingFrequency, carrierTime * carrierFrequency)}
                                modulatingFreq={modulatingFrequency}
                                carrierFreq={carrierFrequency}
                                color={'#d8c384'} 
                                signalChartName={'Фазовая модуляция'}      
                                fftChartName={'Спектр фазовой модуляции'}/>
            </div>
        </div>
    </div>
    )
}

export default Task2Page;