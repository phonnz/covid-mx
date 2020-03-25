import React, { Component, Fragment } from 'react';
import { ResponsiveContainer, ReferenceLine, LineChart, Legend, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';




class growChart extends Component {
  state = {
    chartData: [
      { name: 'Page 0', mx: 400, },
    ]
  }


  getRandomColor = (country) => {
    if(country === "Mexico") return '#de2d1b'
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }



  render() {

    return (
      <ResponsiveContainer height={400}>
        <LineChart width={500} height={400} data={this.props.data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <ReferenceLine x="3/23/2020" stroke="red" label="Fase II MX" />
          <CartesianGrid strokeDasharray="25 25" />
          <Tooltip />
          <Legend />
          {this.props.countries.map(country => {
            return (
              <Line type="monotone" dataKey={country} stroke={this.getRandomColor(country)} />
            )
          })}
        </LineChart>
        </ResponsiveContainer>

    )
  }

}

export default growChart