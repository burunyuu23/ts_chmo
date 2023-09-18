import { useEffect, useState } from "react";
import { positiveFrequenciesSpectrum } from "../util/fft";
import { DataPoint, DataPointAmplitudes, Signal } from "../types/signal";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button, ButtonGroup } from "@mui/material";
import styles from "./fftChart.module.scss"

type Props = {
  signal: DataPoint[],
    frequency: number
}

const FFTChart = ({ signal, frequency }: Props) => {
    const [spectrum, setSpectrum] = useState<Signal[]>([]);
    const [frequencyScale, setFrequencyScale] = useState<number>(2);
    const maxFrequencyScale = 16;
    const minFrequencyScale = 1;
  
    useEffect(() => {
      const amplitudes: DataPointAmplitudes[] = signal.map((point) => ({harmonicAmplitude: point.harmonicAmplitude, digitalAmplitude: point.digitalAmplitude}));

      console.log(amplitudes);
      
      // const fftSignal = fft(amplitudes, frequency);

      const spectrumHarmonic = positiveFrequenciesSpectrum(signal.map((point) => ([point.harmonicAmplitude, 0])));
      const spectrumDigital = positiveFrequenciesSpectrum(signal.map((point) => ([point.digitalAmplitude, 0])));
      // spectrumDigital[0] = [0, 0];
    
      setSpectrum(spectrumDigital.map((_, index) => {
        if (index === 0 ) {
          return (
            ({frequency: index, amplitude: {
              harmonicAmplitude: 0, 
              digitalAmplitude: 0
            }})
          )
        }
        return ({frequency: index, amplitude: {
          harmonicAmplitude: Math.sqrt(spectrumHarmonic[index][0]**2 + spectrumHarmonic[index][1]**2)/spectrumDigital.length, 
          digitalAmplitude: Math.sqrt(spectrumDigital[index][0]**2 + spectrumDigital[index][1]**2)/spectrumDigital.length
        }})
      }
      ).slice(0, 10 * frequencyScale + 1));
    }, [signal, frequency, frequencyScale]);   

    const handlePlus = () => {
      setFrequencyScale(prev => prev < maxFrequencyScale ? prev*2 : prev)
    }  

    const handleMinus = () => {
      setFrequencyScale(prev => prev > minFrequencyScale ? prev/2 : prev)
    }
  
    return (
        <div className={styles.firstChart}>
        <div>
          <LineChart width={800} height={300} data={spectrum}>
            <XAxis dataKey="frequency" unit="Гц" type="number" interval={frequencyScale - 1} ticks={Array(10*frequencyScale + 1).fill(0).map((_, index) => index)}/>
            <YAxis />
            <CartesianGrid stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amplitude.digitalAmplitude" stroke="#82ca9d" name="Спектр цифрового сигнала" dot={false} strokeWidth={2} />
          </LineChart>
        
        <LineChart width={800} height={300} data={spectrum}>
            <XAxis dataKey="frequency" unit="Гц" type="number" interval={frequencyScale - 1} ticks={Array(10*frequencyScale + 1).fill(0).map((_, index) => index)}/>
          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amplitude.harmonicAmplitude" stroke="#8884d8" name="Спектр гармонического сигнала" dot={false} strokeWidth={2} />
        </LineChart>
      </div>
          <ButtonGroup orientation="vertical" >
            <Button className={styles.button} variant={frequencyScale !== maxFrequencyScale ? "contained" : "outlined"} onClick={handlePlus}>+</Button>
            <Button className={styles.button} variant={frequencyScale !== minFrequencyScale ? "contained" : "outlined"} onClick={handleMinus}>-</Button>
          </ButtonGroup>
        </div>
    );
  };
  
  export default FFTChart;