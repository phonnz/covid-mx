import React, { Component } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';




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
        {this.props.countries.map(country => {
          return (
            <Line type="monotone" dataKey={country} stroke={this.getRandomColor()} />
          )
        })}

        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="Date" />
        <YAxis />
        <Tooltip />
      </LineChart>
    )
  }

}

export default growChart