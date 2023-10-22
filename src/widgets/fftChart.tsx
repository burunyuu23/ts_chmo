import { useEffect, useState } from "react";
import {fft2} from "../util/fft";
import { DataPoint, Signal } from "../types/signal";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button, ButtonGroup } from "@mui/material";
import styles from "./fftChart.module.scss"

type Props = {
  signal: DataPoint[],
  frequency: number,
  name: string,
  color: string,
  right?: boolean
}

const FFTChart = ({ signal, frequency, name, color, right}: Props) => {
    const [spectrum, setSpectrum] = useState<Signal[]>([]);
    const [frequencyScale, setFrequencyScale] = useState<number>(1);
    const maxFrequencyScale = 128;
    const minFrequencyScale = 1;

    const frequencyScaleArray = Array(Math.log2(maxFrequencyScale) + 1).fill(0).map((_, index) => 2 ** index)
    
  
    useEffect(() => {
      const spectrum = fft2(signal.map((point) => ([point.amplitude, 0])));
    
      setSpectrum(spectrum.map((_, index) => {
        if (index === 0 )
          return ({frequency: index, amplitude: 0})

        return ({frequency: index, amplitude: Math.sqrt(spectrum[index][0]**2 + spectrum[index][1]**2)/spectrum.length})
      }
      ).slice(0, 10 * frequencyScale + 1));
    }, [signal, frequency, frequencyScale]);   

    const handlePlus = () => {
      setFrequencyScale(prev => prev < maxFrequencyScale ? prev*2 : prev)
    }  

    const handleMinus = () => {
      setFrequencyScale(prev => prev > minFrequencyScale ? prev/2 : prev)
    }

    const buttonPanel = (
      <ButtonGroup className={styles.buttonGroup} orientation="vertical" >
        <Button className={[styles.button, styles.buttonFirst].join(" ")} variant={frequencyScale !== maxFrequencyScale ? "contained" : "outlined"} onClick={handlePlus}>↑</Button>
            {frequencyScaleArray.reverse().map((val, index) => {         
              if (
                (frequencyScaleArray.indexOf(frequencyScale) === (frequencyScaleArray.length - 1)  && index >= (frequencyScaleArray.length - 3))
              || (frequencyScaleArray.indexOf(frequencyScale) === 0  && index <= 2)
              || (index >= frequencyScaleArray.indexOf(frequencyScale) && index - frequencyScaleArray.indexOf(frequencyScale) <= 1) 
              || (index <= frequencyScaleArray.indexOf(frequencyScale) && frequencyScaleArray.indexOf(frequencyScale) - index <= 1))
                return (<Button key={val} className={styles.button} variant={frequencyScale !== val ? "contained" : "outlined"} onClick={() => setFrequencyScale(val)}>{val} Гц</Button>);
            }
              )}
        <Button className={[styles.button, styles.buttonLast].join(" ")} variant={frequencyScale !== minFrequencyScale ? "contained" : "outlined"} onClick={handleMinus}>↓</Button>
      </ButtonGroup>
    )
  
    return (
        <div className={styles.firstChart}>
         {!right ? buttonPanel : ""}
          <div>
            <LineChart width={800} height={300} data={spectrum}>
              <XAxis dataKey="frequency" unit="Гц" type="number" interval={frequencyScale - 1} ticks={Array(10*frequencyScale).fill(0).map((_, index) => index)}/>
              <YAxis />
              <CartesianGrid stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amplitude" stroke={color} name={name} dot={false} strokeWidth={2} />
            </LineChart>
          </div>
          {right ? buttonPanel : ""}
        </div>
    );
  };
  
  export default FFTChart;