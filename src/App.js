import React, { Component } from 'react';
import Papa from 'papaparse';
import Chart from './Components/Chart';
import RegionData from './Components/RegionData';
import './App.css';

const endpoint =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';

  const countries = [
    "Mexico",
    // "Italy",
    "Thailand",
    "Argentina"
  ]


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonData: null,
      refreshing: false,
    };
  }



  transformData = (data, fields) => {
    fields.shift()
    fields.shift()
    fields.shift()
    fields.shift()
    
    data = (data.filter(row => countries.indexOf(row['Country/Region']) >= 0 ) )
    let  new_data = []
    console.log(data)
    fields.forEach( field => {
      console.log(field,Object.keys(data))
      let new_row = { name: field, amt: 400 }
      data.map(r => {
        new_row[r['Country/Region']] = r[field]
      })
      new_data.push(new_row)
    });
    //   countries.map(country => {
    // })
    return new_data
  }

  reloadData() {
    Papa.parse(endpoint, {
      download: true,
      header: true,
      complete: results => {
        const {
          meta: { fields },
        } = results;
        const { refreshing } = this.state;
        const lastColumn = fields[fields.length - 1];
        if (refreshing === true) { // Triggered via pull-to-refresh
          console.log("Updated via pull-to-refresh")
        }

        // TODO maybe remove everything except identifiers and `lastColumn`
        this.setState({
          jsonData: results.data,
          data: this.transformData(results.data, fields),
          date: lastColumn,
          refreshing: false,
        });
      },
    });
  }

  componentDidMount() {
    this.reloadData();
  }

  onRefresh() {
    // Note: ideally, do some async/setState callback magic instead
    this.setState({
      refreshing: true
    });
    this.reloadData();
  }

  render() {
    const { jsonData, data, date, refreshing } = this.state;

    return (
      <div>

          <RegionData data={jsonData} region="Mexico" emoji="🇲🇽" date={date} />
          <Chart data={data} countries={countries} />
      </div>
      
    );
  }
  
}

export default App;
