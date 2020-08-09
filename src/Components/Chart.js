import React, { Component } from 'react';
import { ResponsiveContainer, ReferenceLine, LineChart, Legend, Line, CartesianGrid, XAxis, YAxis, Tooltip, Label } from 'recharts';
// import {  } from 'semantic-ui-react'
import Flag from './Flags/Flag';


class growChart extends Component {
  state = {
    chartData: [
      { name: 'Page 0', mx: 5000, },
    ]
  }

  render() {

    return (
      <ResponsiveContainer minHeight={550} height={'80%'} >
        <LineChart width={500} height={450} data={this.props.data} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
          <XAxis dataKey="name" />
          <YAxis  type="number" label={{ value: 'Fallecidos', angle: 90, position: 'insideLeft', fill: 'white' }} domain={['dataMin', dataMax => (this.props.max*1.05) ]} />
          <ReferenceLine x='3/22/20' stroke="red" label={<Label value="F-II-MX" fill={'red'} position={'insideTopLeft'} /> }  />
          <ReferenceLine x='3/17/20' stroke="red" label={<Label value="F-I-AR" fill={'red'} position={'insideTopLeft'} /> }  />
          <ReferenceLine x='3/20/20' stroke="red" label={<Label value="F-II-AR" fill={'red'} position={'insideTopLeft'} /> }  />
          
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip itemStyle={{  backgroundColor: '#363738' }} contentStyle={{backgroundColor: '#363738'}} wrapperStyle={{ backgroundColor: '#363738', border: '1px solid #fff', borderRadius: 3 }} />
          <Legend  wrapperStyle={{ left: '10', backgroundColor: '#363738', border: '1px solid #d5d5d5', borderRadius: 3 }}/>
          {this.props.countries.map((country, idx) => {
              if(country.key === "Mexico"){
              return (<Line key={idx} type="monotone" dataKey={country.key} stroke={country.color} strokeWidth={3} dot={<Flag currentDate={this.props.date} />} />)
                
              }  else if(country.key === "mx-centinela"){
                return (<Line key={idx} type="monotone" dataKey={country.key} stroke={country.color} strokeWidth={3} dot={<Flag currentDate={this.props.date} />} />)
              }else{
                
                return (<Line key={idx} type="monotone" dataKey={country.key }  stroke={country.color} strokeWidth={1.1} dot={<Flag currentDate={this.props.date} />}  /> )
              }

          })}
        </LineChart>
        </ResponsiveContainer>

    )
  }

}

export default growChart
