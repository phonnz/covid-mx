import React, { Component } from 'react';
import { Container, Grid, GridColumn } from 'semantic-ui-react'
import Papa from 'papaparse';
import Chart from './Components/Chart';
import RegionData from './Components/RegionData';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

const endpoint =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';

  const countries = [
    "Argentina",
    // "Bolivia",
    "Ecuador",
    "Peru",
    "Mexico",
    // "Italy",
    "Thailand",
  ]


  const otherCountries = [
    "Spain",
    "Italy",
    
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
    // console.log(data)
    fields.forEach( field => {
      // console.log(field,Object.keys(data))
      let new_row = { name: field, amt: 2500 }
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

        

        this.setState({
          jsonData: results.data,
          data: this.transformData(results.data, countries, fields),
          secondSegment: this.transformData(results.data, countries, ( fields.slice(45, -1)) ),
          thirdSegment: this.transformData(results.data, otherCountries, fields),
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
    const { jsonData, data, date, refreshing, secondSegment, thirdSegment } = this.state;

    return (
      <Container fluid>
          <RegionData data={jsonData} region="Mexico" emoji="🇲🇽" date={date} />
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={8}>
                <Chart data={data} countries={countries}  />
              </Grid.Column>
              <Grid.Column width={8}>
                <Chart data={secondSegment} countries={countries} />
                
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={8}>
                <Chart data={thirdSegment} countries={otherCountries} />
              </Grid.Column>
              <Grid.Column width={8}>
                
              </Grid.Column>
            </Grid.Row>
          </Grid>
      </Container>
      
    );
  }
  
}

export default App;
