import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400},
{name: 'Page A', uv: 400, pv: 1400, amt: 2400},
{name: 'Page B', uv: 500, pv: 2400, amt: 2500},
{name: 'Page C', uv: 600, pv: 3400, amt: 2600},
{name: 'Page D', uv: 400, pv: 2400, amt: 2700},
{name: 'Page E', uv: 300, pv: 400, amt: 2500}
];

const renderLineChart = () => {
  return (

  
  <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
  </LineChart>
)

}

export default renderLineChart