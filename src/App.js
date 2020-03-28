import React, { Component } from 'react';
import { Container, Grid, GridColumn } from 'semantic-ui-react'
import Papa from 'papaparse';
import axios from 'axios'
import Chart from './Components/Chart';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

const {countries } = require('./countries')
const hopkins_confirmed =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
const owid_tests_date = 'https://opendata.ecdc.europa.eu/covid19/casedistribution/csv'
const owid_test_m = 'https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/COVID-19%20Tests%20per%20million%20people/COVID-19%20Tests%20per%20million%20people.csv'
  

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonData: null,
      refreshing: false,
      mxacccases: 475,
      mxTests: 278,
    };
  }



  transformData = (data, countries, fields, selector) => {
    
    data = (data.filter(row => countries.map(country => country.key ).indexOf(row['Country/Region']) >= 0 && countries.map(country => country[selector] ) ) )
    let  new_data = []
    
    fields.slice(4, fields.length).forEach( field => {
      let new_row = { name: field, amt: 1500 }
      data.map(r => {
        new_row[r['Country/Region']] = r[field]
      })
      new_data.push(new_row)
    });
    
    return new_data
  }

  getTestData = (url) => {
    Papa.parse(url, {
      download: true,
      header: true,
      complete: results => {  

        const {
          meta: { fields }
        } = results;
        
        const countryKeys = countries.map(country => country.key)
        this.setState({
          accTests: results.data.filter(row => countryKeys.indexOf(row['Entity']) >= 0 )
        })
        //    const countryKeys = countries.map(country => country.key)
        // const exclusiveData = results.data.filter(row => countryKeys.indexOf(row['Country/Region']) >= 0 )
      }})
      
  }

  maxCases(data, date, country){
    return (data.filter(row => row['Country/Region'] === country))[0][date]
    
  }

  reloadData() {
    Papa.parse(hopkins_confirmed, {
      download: true,
      header: true,
      complete: results => {  

        const {
          meta: { fields }
        } = results;
        // const { refreshing } = this.state;
        const lastColumn = fields[fields.length - 1];
        // if (refreshing === true) { 
        //   console.log("Updated via pull-to-refresh")
        // }
        const countryKeys = countries.map(country => country.key)
        const exclusiveData = results.data.filter(row => countryKeys.indexOf(row['Country/Region']) >= 0 )
        // console.log(exclusiveData)
        this.setState({
          jsonData: exclusiveData,
          similarData: this.transformData(results.data, countries, fields.slice(50, fields.length), 'similar'),
          wdData: this.transformData(results.data, countries, fields.slice(35, fields.length), 'wd' ),
          optionData: this.transformData(results.data, countries, fields.slice(40, fields.length), 'option'),
          earlyData: this.transformData(results.data, countries, fields.slice(55, fields.length), 'early'),
          date: lastColumn,
          mxacccases: this.maxCases(results.data, lastColumn, "Mexico"),
          refreshing: false,
        });
        
      },
    });
  }


  componentDidMount() {
    this.reloadData();
    this.getTestData(owid_test_m) 
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
      earlyData,
      optionData 
      } = this.state;

    return (
      <Container fluid>
        <h1>{this.state.mxacccases} casos confirmados en México 🇲🇽 al {this.state.date} </h1>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={8}>
                <h2>Países similares en LatAm</h2>
                <Chart data={similarData} countries={countries.filter(c => c.similar )}  />
              </Grid.Column>
              <Grid.Column width={8}>
                <h2>Países que consiguen aplanar la curva</h2>
                <Chart data={wdData} countries={countries.filter(c => c.wd )} />
                
              </Grid.Column>
            </Grid.Row>
            <Grid.Row >
              <Grid.Column width={8}>
                <h2>Países con acciones diferentes al resto del mundo</h2>
                <Chart data={optionData} countries={countries.filter(c => c.option )} />
              </Grid.Column>
              <Grid.Column width={8}>
                <h2>Países con acciones en etapas tempranas</h2>
                <Chart data={earlyData} countries={countries.filter(c => c.early )} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
      </Container>
      
    );
  }
  
}

export default App;
