import React, { Component } from 'react';
import { Container, Grid, Divider, Menu } from 'semantic-ui-react'
import Papa from 'papaparse'
import Chart from './Components/Chart';
import _ from 'lodash'

import 'semantic-ui-css/semantic.min.css';
import './App.css';

const { countries } = require('./countries')
const hopkins_confirmed =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'

const hopkins_deaths = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv'
const owid_tests_date = 'https://opendata.ecdc.europa.eu/covid19/casedistribution/csv'
const owid_test_m = 'https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/COVID-19%20Tests%20per%20million%20people/COVID-19%20Tests%20per%20million%20people.csv'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deathsData: null,
      confirmedData: null,
      fields: [],
      srcSelector: 'confirmed',
      countrySelector: 'similar',
      refreshing: false,
      mxAccDeaths: 61,
      mxAccConfirmed: 1400,
    };
  }

  getMaxRange() {
    if (this.state.srcSelector === 'deaths') {
      return this.state.mxAccDeaths
    } else {
      return this.state.mxAccConfirmed
    }
  }

  changeDataSrc = (e, { id }) => { this.setState({ srcSelector: id }) }

  changeCountriesSrc = (e, { id }) => { this.setState({ countrySelector: id }) }

  getFilterString(){
    switch(this.state.countrySelector){
      case "similar": 
        return "similares en América Latina"
      case "wd": 
        return "que consiguen doblar la curva"
      case "option": 
        return "que han optado por acciones diferentes al resto del mundo"
      case "early": 
        return "que tomaron acciones tempranas"
    }
  }

  getChartCountries() {
    return countries.filter(c => c[this.state.countrySelector])
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
          accTests: results.data.filter(row => countryKeys.indexOf(row['Entity']) >= 0)
        })
        //    const countryKeys = countries.map(country => country.key)
        // const exclusiveData = results.data.filter(row => countryKeys.indexOf(row['Country/Region']) >= 0 )
      }
    })

  }

  parseData(data, fields) {
    const currentDate = fields[fields.length - 1]
    const subfields = fields.slice(55, fields.length)

    const countryKeys = countries.map(country => country.key)
    let exclusiveData = data.filter(row => countryKeys.indexOf(row['Country/Region']) >= 0)
    exclusiveData = _(exclusiveData).groupBy('Country/Region').value()

    exclusiveData = Object.keys(exclusiveData).map(country => {
      let zip_country = { 'key': country, }

      subfields.map(day => {
        let sum = 0
        for (var i = 0; i < exclusiveData[country].length; i++) {
          sum += parseInt(exclusiveData[country][i][day])
        }
        zip_country[day] = sum

      })

      return zip_country
    })

    const mxAcc = parseInt((exclusiveData.filter(row => row.key === 'Mexico'))[0][currentDate])
    let new_data = []

    subfields.forEach(field => {
      let new_row = { name: field, amt: 500 }
      exclusiveData.map(r => {
        new_row[r.key] = r[field]
      })
      new_data.push(new_row)

    })

    return { data: new_data, max: mxAcc }
  }

  getConfirmedData(src) {
    Papa.parse(src, {
      download: true,
      header: true,
      complete: results => {

        const {
          meta: { fields }
        } = results;
        const { data, max } = this.parseData(results.data, fields)

        this.setState({
          confirmedData: data,
          mxAccConfirmed: max
        })
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
        const currentDate = fields[fields.length - 1]
        const { data, max } = this.parseData(results.data, fields)

        this.setState({
          currentDate,
          fields,
          deathsData: data,
          mxAccDeaths: max,
        });

      },
    });
  }

  getDataset() {
    if (this.state.srcSelector === 'deaths') {
      return this.state.deathsData
    } else {
      return this.state.confirmedData
    }
  }


  componentDidMount() {
    this.getDeathsData(hopkins_deaths)
    this.getConfirmedData(hopkins_confirmed)
    // this.getTestData(owid_test_m) 
  }

  render() {
    const {
      currentDate,
      mxAccDeaths,
      mxAccConfirmed,
      srcSelector,
    } = this.state;

    const nameTabA = `🇲🇽 ${mxAccDeaths} fallecidos`
    const nameTabB = `🇲🇽 ${mxAccConfirmed} confirmados`

    const currentStringDate = `Actualizado al ${(new Date(currentDate)).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`

    return (
      <Container fluid>
        <Menu inverted tabular>
          <Menu.Item
            id='deaths'
            name={nameTabA}
            active={srcSelector === 'deaths'}
            onClick={this.changeDataSrc}
          />
          <Menu.Item
            id='confirmed'
            name={nameTabB}
            active={srcSelector === 'confirmed'}
            onClick={this.changeDataSrc}
          />
        </Menu>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width={16}>
              <Chart data={this.getDataset()} countries={this.getChartCountries()} date={currentDate} max={this.getMaxRange()} />
              
            </Grid.Column>
            <Grid.Column width={12}>
              <Menu inverted>
                <Menu.Item
                  id='similar'
                  name="LatAm"
                  active={this.state.countrySelector === 'similar'}
                  onClick={this.changeCountriesSrc}
                />
                <Menu.Item
                  id='wd'
                  name='Éxito'
                  active={this.state.countrySelector === 'wd'}
                  onClick={this.changeCountriesSrc}
                />
                <Menu.Item
                  id='option'
                  name='Crisis'
                  active={this.state.countrySelector === 'option'}
                  onClick={this.changeCountriesSrc}
                />
                <Menu.Item
                  id='early'
                  name='Acciones tempranas'
                  active={this.state.countrySelector === 'early'}
                  onClick={this.changeCountriesSrc}
                />
              </Menu>
              <h3>Covid-19: México comparado con países {this.getFilterString()} </h3>
              <small>{currentStringDate}</small>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <Container text>
          <p>Cualquier comentario, duda o sugerencia puedes contactarme <a href="https://twitter.com/phonnz/" target="_blank">@phonnz</a> o mirar el código <a href="https://github.com/phonnz/covid-mx" target="_blank" rel="noopener noreferrer">Github</a></p>
          <p>Inspirado en la prueba de <a href="https://snack.expo.io/@xnt/coronavirus-ca" target="_blank" rel="noopener noreferrer">@xnt</a> el dashboard de <a href="https://covid.sdelmont.com/" target="_blank" rel="noopener noreferrer">@sd</a></p>
          <p><a href="https://experience.arcgis.com/experience/685d0ace521648f8a5beeeee1b9125cd" target="_blank" rel="noopener noreferrer">WHO</a> | <a href="https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6" target="_blank" rel="noopener noreferrer">JHU</a> | <a href="https://covid19.isciii.es/" target="_blank" rel="noopener noreferrer">ISC</a></p>
          <p>Datos de: <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank" rel="noopener noreferrer">JHU</a></p>
        </Container>
      </Container>

    );
  }

}

export default App;
