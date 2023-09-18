import { useEffect, useState } from "react";
import { fft } from "../util/fft";
import { DataPoint, DataPointAmplitudes, Signal } from "../types/signal";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

type Props = {
  signal: DataPoint[],
    frequency: number
}

const FFTChart = ({ signal, frequency }: Props) => {
    const [spectrum, setSpectrum] = useState<Signal[]>([]);
  
    useEffect(() => {
      const amplitudes: DataPointAmplitudes[] = signal.map((point) => ({harmonicAmplitude: point.harmonicAmplitude, digitalAmplitude: point.digitalAmplitude}));

      const fftSignal = fft(amplitudes, frequency);
    
      setSpectrum(fftSignal);
      
    }, [signal, frequency]);
  
    return (
      <div>
        <LineChart width={800} height={300} data={spectrum}>
          <XAxis dataKey="frequency" unit="Гц" type="number" tickCount={2*10 + 1} ticks={Array(2*10 + 1).fill(0).map((val, index) => index*frequency/10)}/>
          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amplitude.digitalAmplitude" stroke="#82ca9d" name="Спектр цифрового сигнала" dot={false} strokeWidth={2} />
        </LineChart>
        <LineChart width={800} height={300} data={spectrum}>
          <XAxis dataKey="frequency" unit="Гц" type="number" tickCount={2*10 + 1} ticks={Array(2*10 + 1).fill(0).map((val, index) => index*frequency/10)}/>
          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amplitude.harmonicAmplitude" stroke="#8884d8" name="Спектр гармонического сигнала" dot={false} strokeWidth={2} />
        </LineChart>
      </div>
    );
  };
  
  export default FFTChart;