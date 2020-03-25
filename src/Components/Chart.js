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
        <LineChart width={800} height={500} data={this.props.data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <XAxis dataKey="Date" />
          <YAxis />
          <CartesianGrid strokeDasharray="10 10" />
          <Tooltip />
          <Legend />
          {this.props.countries.map(country => {
            return (
              <Line type="monotone" dataKey={country} stroke={this.getRandomColor()} />
            )
          })}
        </LineChart>


    )
  }

}

export default growChart