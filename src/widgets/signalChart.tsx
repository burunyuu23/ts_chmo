import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DataPoint } from '../types/signal';

type Props = {
    signal: DataPoint[],
    color: string,
    name: string
}

const SignalChart  = ({signal, color, name}: Props) => {  
  const max = Math.ceil(Math.max(...signal.map(val => val.amplitude)));
  return (
    <div>
      <LineChart width={800} height={300} data={signal}>
        <XAxis dataKey="time" unit="c" type="number" interval={0}  ticks={Array(11).fill(0).map((_, index) => index/10)}/>
        <YAxis type="number" interval={0}  ticks={Array(5).fill(0).map((_, index) => max - max*index/2)}/>
        <CartesianGrid stroke="#aaa" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="amplitude" stroke={color} name={name} dot={false} strokeWidth={4}/>
      </LineChart>
    </div>
  );
};

export default SignalChart;