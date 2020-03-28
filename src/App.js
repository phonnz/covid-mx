import React, { Component } from 'react';
import { Container, Grid, GridColumn, Divider } from 'semantic-ui-react'
import Papa from 'papaparse';
import axios from 'axios'
import Chart from './Components/Chart';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

const {countries } = require('./countries')
const hopkins_confirmed =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
const hopkins_deaths = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv'
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

  getInfectedData(src) {
    Papa.parse(src, {
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
          date: lastColumn,
          refreshing: false,
          jsonData: exclusiveData,
          // similarData: this.transformData(results.data, countries, fields.slice(50, fields.length), 'similar'),
          // wdData: this.transformData(results.data, countries, fields.slice(35, fields.length), 'wd' ),
          // optionData: this.transformData(results.data, countries, fields.slice(40, fields.length), 'option'),
          // earlyData: this.transformData(results.data, countries, fields.slice(55, fields.length), 'early'),
          mxacccases: this.maxCases(results.data, lastColumn, "Mexico"),
        });
        
      },
    });
  }

  getDeathsData(src) {
    Papa.parse(src, {
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
          date: lastColumn,
          deathsData: exclusiveData,
          similarData: this.transformData(results.data, countries, fields.slice(55, fields.length), 'similar'),
          wdData: this.transformData(results.data, countries, fields.slice(55, fields.length), 'wd' ),
          optionData: this.transformData(results.data, countries, fields.slice(48, fields.length), 'option'),
          earlyData: this.transformData(results.data, countries, fields.slice(45, fields.length), 'early'),
          // mxacccases: this.maxCases(results.data, lastColumn, "Mexico"),
        });
        
      },
    });
  }


  componentDidMount() {
    this.getInfectedData(hopkins_confirmed);
    // this.getTestData(owid_test_m) 
    this.getDeathsData(hopkins_deaths)
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
                <h3>Fallecidos por covid-19 en países similares en LatAm</h3>
                <Chart data={similarData} countries={countries.filter(c => c.similar )}  />
              </Grid.Column>
              <Grid.Column width={8}>
                <h3>Fallecidos por covid-19 en países que consiguen aplanar la curva</h3>
                <Chart data={wdData} countries={countries.filter(c => c.wd )} />
                
              </Grid.Column>
            </Grid.Row>
            <Grid.Row >
              <Grid.Column width={8}>
                <h3>Fallecidos por covid-19 en países con acciones diferentes al resto del mundo</h3>
                <Chart data={optionData} countries={countries.filter(c => c.option )} />
              </Grid.Column>
              <Grid.Column width={8}>
                <h3>Fallecidos por covid-19 en países con acciones en etapas tempranas</h3>
                <Chart data={earlyData} countries={countries.filter(c => c.early )} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider />
          <Container text>
            <p>Cualquier comentario, duda o sugerencia puedes comentarme <a href="https://twitter.com/phonnz/" target="_blank">@phonnz</a> <a href="https://github.com/phonnz/covid-mx" target="_blank">Github</a></p>
            <p>Inspirado en la prueba de <a href="https://snack.expo.io/@xnt/coronavirus-ca" target="_blank">@xnt</a> el dashboard de <a href="https://covid.sdelmont.com/" target="_blank">@sd</a></p>
            <p><a href="https://experience.arcgis.com/experience/685d0ace521648f8a5beeeee1b9125cd" target="_blank">WHO</a> | <a href="https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6" target="_blank">JHU</a> | <a href="https://covid19.isciii.es/" target="_blank">ISC</a></p>
            <p>Datos de: <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank">JHU</a></p>
          </Container>
      </Container>
      
    );
  }
  
}

export default App;
