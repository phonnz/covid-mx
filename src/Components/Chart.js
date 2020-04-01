import React, { Component, Fragment } from 'react';
import { ResponsiveContainer, ReferenceLine, LineChart, Legend, Line, CartesianGrid, XAxis, YAxis, Tooltip, Label } from 'recharts';
import { Flag } from 'semantic-ui-react'
import Mexico from './Flags/Mexico';

class growChart extends Component {
  state = {
    chartData: [
      { name: 'Page 0', mx: 400, },
    ]
  }


  getRandomColor = (country) => {
    if(country.key === "Mexico") return '#de2d1b'
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
        <LineChart width={500} height={450} data={this.props.data} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
          <XAxis dataKey="name" />
          <YAxis  type="number" label={{ value: 'Fallecidos', angle: 0, position: 'insideTopLeft' }} domain={['auto', 'auto']} />
          <ReferenceLine x='3/22/20' stroke="red" label={<Label value="FASE II MX" fill={'white'}  /> } textAnchor={'top'} />
          <CartesianGrid strokeDasharray="25 25" />
          <Tooltip itemStyle={{  backgroundColor: '#363738' }} contentStyle={{backgroundColor: '#363738'}} wrapperStyle={{ backgroundColor: '#363738', border: '1px solid #fff', borderRadius: 3 }} />
          <Legend width="100%" wrapperStyle={{ left: '10', backgroundColor: '#363738', border: '1px solid #d5d5d5', borderRadius: 3 }}/>
          {this.props.countries.map((country, idx) => {

              if(country.key == "Mexico"){
                return (<Line key={idx} type="monotone" dataKey={country.key} stroke={this.getRandomColor(country)} strokeWidth={3} label={country.name} dot={Mexico}  />)
                
              }  else {
                
                return (<Line key={idx} type="monotone" dataKey={country.key }  stroke={this.getRandomColor(country)} strokeWidth={1} label={country.name} dot={false} /> )
              }

          })}
        </LineChart>
        </ResponsiveContainer>

    )
  }

}

export default growChart