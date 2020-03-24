import React, { Component, Fragment } from 'react';
import { AreaChart, Area, LineChart, Legend, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';




class growChart extends Component {
  state = {
    chartData: [
      { name: 'Page 0', mx: 400, },
    ]
  }


  getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }



  render() {

    return (


        <AreaChart width={800} height={500} data={this.props.data} margin={{ top: 55, right: 5, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {this.props.countries.map(country => {
            return (
              <Area type="monotone" dataKey={country} stroke={this.getRandomColor()} stackId="1" fill={this.getRandomColor()} />
            )
          })}
        </AreaChart>

    )
  }

}

export default growChart