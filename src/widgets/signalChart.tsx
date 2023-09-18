import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DataPoint } from '../types/signal';

type Props = {
    signal: DataPoint[],
}

const SignalChart  = ({signal}: Props) => {  
  return (
    <div>
      <LineChart width={800} height={300} data={signal}>
        <XAxis dataKey="time" unit="c" type="number" ticks={Array(11).fill(0).map((_, index) => index/10)}/>
        <YAxis />
        <CartesianGrid stroke="#aaa" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="digitalAmplitude" stroke="#82ca9d" name="Цифровой сигнал" dot={false} strokeWidth={4}/>
      </LineChart>
      <LineChart width={800} height={300} data={signal}>
        <XAxis dataKey="time" unit="c" type="number" ticks={Array(11).fill(0).map((_, index) => index/10)}/>
        <YAxis />
        <CartesianGrid stroke="#ccc" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="harmonicAmplitude" stroke="#8884d8" name="Гармонический сигнал" dot={false} strokeWidth={4}/>
      </LineChart>
    </div>
  );
};

export default SignalChart;