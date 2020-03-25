import React, { Component } from 'react';
import { Container, Grid, GridColumn } from 'semantic-ui-react'
import Papa from 'papaparse';
import Chart from './Components/Chart';
import RegionData from './Components/RegionData';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

const endpoint =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

  const similarCountries = [
    "Argentina",
    "Brazil",
    "Colombia",
    "Ecuador",
    "Peru",
    "Mexico",
  ]

  const ngCountries = [
    "Italy",
    "Spain",
    "Brazil",
    "United Kingdom",
    "Germany",
    "Sweden",
    "Mexico",
  ]

  const extraCountries = [
    "Argentina",
    "Ecuador",
    "Paraguay",
    "Peru",
    "Mexico",
  ]

  const wdCountries = [
    "Korea, South",
    "Australia",
    "Germany",
    "Singapore",
    "Taiwan*",
    "Peru",
    "Mexico",
  ]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonData: null,
      refreshing: false,
    };
  }



  transformData = (data, countries, fields) => {
    fields.shift()
    fields.shift()
    fields.shift()
    fields.shift()
    
    data = (data.filter(row => countries.indexOf(row['Country/Region']) >= 0 ) )
    let  new_data = []
    
    fields.forEach( field => {
      let new_row = { name: field, amt: 2500 }
      data.map(r => {
        new_row[r['Country/Region']] = r[field]
      })
      new_data.push(new_row)
    });
    
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
        if (refreshing === true) { 
          console.log("Updated via pull-to-refresh")
        }

        

        this.setState({
          jsonData: results.data,
          similarData: this.transformData(results.data, similarCountries, fields.slice(50, fields.length)),
          wdData: this.transformData(results.data, wdCountries, fields.slice(35, fields.length) ),
          ngData: this.transformData(results.data, ngCountries, fields.slice(40, fields.length)),
          extraData: this.transformData(results.data, extraCountries, fields.slice(55, fields.length)),
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
    const { jsonData, 
      date, 
      similarData,
      wdData,
      ngData,
      extraData 
      } = this.state;

    return (
      <Container fluid>
          <RegionData data={jsonData} region="Mexico" emoji="🇲🇽" date={date} />
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={8}>
                <h2>Países similares en LatAm</h2>
                <Chart data={similarData} countries={similarCountries}  />
              </Grid.Column>
              <Grid.Column width={8}>
                <h2>Países que consiguen aplanar la curva</h2>
                <Chart data={wdData} countries={wdCountries} />
                
              </Grid.Column>
            </Grid.Row>
            <Grid.Row >
              <Grid.Column width={8}>
                <h2>Países con acciones diferentes al resto del mundo</h2>
                <Chart data={ngData} countries={ngCountries} />
              </Grid.Column>
              <Grid.Column width={8}>
                <h2>Países con acciones en etapas tempranas</h2>
                <Chart data={extraData} countries={extraCountries} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
      </Container>
      
    );
  }
  
}

export default App;
