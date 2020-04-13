import React, { Component } from 'react';
import { Checkbox, Container, Grid, Divider, Label, Menu } from 'semantic-ui-react'
import Papa from 'papaparse'
import Chart from './Components/Chart';
import CountriesTable from './Components/CountriesTable';
import _ from 'lodash'

import 'semantic-ui-css/semantic.min.css';
import './App.css';

let { countries } = require('./countries')
const hopkins_confirmed =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'

const hopkins_deaths = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv'
const owid_tests_date = 'https://opendata.ecdc.europa.eu/covid19/casedistribution/csv'
const owid_test_m = 'https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/COVID-19%20Tests%20per%20million%20people/COVID-19%20Tests%20per%20million%20people.csv'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      excludedDeathsData: null,
      excludedConfirmedData: null,
      deathsData: null,
      confirmedData: null,
      fields: [],
      teleport: true,
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

  changeTeleport = async() => { 
    await this.setState({ 
      teleport: !this.state.teleport,
    })
    
    const updateConfirmed = this.parseData(this.state.excludedConfirmedData, this.state.fields)
    const updateDeaths = this.parseData(this.state.excludedDeathsData, this.state.fields)

    this.setState({ 
      deathsData: updateDeaths.data,
      confirmedData: updateConfirmed.data,
    }) 
  }

  getFilterString(){
    switch(this.state.countrySelector){
      case "similar": 
        return "similares en América Latina"
      case "wd": 
        return "que consiguen disminuir o controlar la velocidad de contagio"
      case "option": 
        return "que han optado por acciones diferentes al resto del mundo"
      case "early": 
        return "que tomaron acciones en etapas tempranas de contagio"
    }
  }

  getChartCountries() {
    return countries.filter(c => c[this.state.countrySelector])
  }

  getTeleportedCountries() {
    let ncountries = {}
    countries.filter(c => c['teleport'] ).map(c => ncountries[c.key] = {'key': c.key, 'teleport' : c.teleport}  )
    return ncountries
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

  excludeData(data, fields, type){
    const currentDate = fields[fields.length-1]
    let subfields = fields.slice(5, fields.length)
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

        if(day === currentDate){
          countries[_.findIndex(countries, c => { return c.key === country })][type] = sum
        }

      })

      return zip_country
    })

    return exclusiveData
  }

  extendTimelapse(fields){
    let current = new Date(fields[fields.length-1])
    for(var i=0;i<5;i++){
      fields.push((new Date(current.setDate(current.getDate() + 1))).toLocaleDateString())
    }
    return fields
  }

  parseData(exclusiveData, fields) {
    const currentDate = fields[fields.length - 1]
    const teleportedCountries = this.getTeleportedCountries()
    

    const mxAcc = parseInt((exclusiveData.filter(row => row.key === 'Mexico'))[0][currentDate])
    let new_data = []

    let subfields = fields.slice(61,fields.length)
    
    if(this.state.teleport){
      subfields = this.extendTimelapse(subfields)
    }

    subfields.forEach(field => {
      let new_row = { name: field, amt: 1000 }
      exclusiveData.map(countryRow => {
        if(this.state.teleport && teleportedCountries[countryRow.key]){
          const teleDate = new Date(field)
          let teleported = (new Date(teleDate.setDate(teleDate.getDate() - teleportedCountries[countryRow.key].teleport))).toLocaleDateString() 
          
          new_row[countryRow.key] = countryRow[teleported.substring(0, teleported.length -2)]
        }else if(countryRow.key === "Mexico"){
          new_row["mx-centinela"] = countryRow[field] * 8
          new_row[countryRow.key] = countryRow[field]
        }else{
          new_row[countryRow.key] = countryRow[field]
        }
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
        const excludedData = this.excludeData(results.data, fields, 'confirmed')
        const { data, max } = this.parseData(excludedData, fields)

        this.setState({
          excludedConfirmedData: excludedData,
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
        const excludedData = this.excludeData(results.data, fields, 'deaths')
        const { data, max } = this.parseData(excludedData, fields)

        this.setState({
          currentDate,
          fields,
          excludedDeathsData: excludedData,
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

  parseTableData(){
    return _(countries)
    .orderBy([ 'populationDensity', 'medianAge', ],[ 'desc', 'asc',])
    .value()

  }


  componentDidMount() {
    this.getDeathsData(hopkins_deaths)
    this.getConfirmedData(hopkins_confirmed)
    this.parseTableData()
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
                  name=''
                  icon='check circle'
                  active={this.state.countrySelector === 'wd'}
                  onClick={this.changeCountriesSrc}
                  />
                <Menu.Item
                  id='option'
                  icon='warning sign'
                  name=''
                  active={this.state.countrySelector === 'option'}
                  onClick={this.changeCountriesSrc}
                />
                <Menu.Item
                  id='early'
                  icon="clock"
                  name=''
                  active={this.state.countrySelector === 'early'}
                  onClick={this.changeCountriesSrc}
                />
              </Menu>
              <h3>Covid-19: México comparado con países {this.getFilterString()} </h3>
              <span className="ui header inverted">Traslado </span> <Checkbox toggle checked={this.state.teleport} onChange={this.changeTeleport} />{<br/>}
              <small> *El botón de "Traslado", coloca las curvas de los países para coincidir alrededor de 150 casos confirmados para realizar la comparativa</small>{<br/>}
              <small>Se muestran 5 días extras al actual para observar la tendencia que siguió que la curva de los países trasladados </small>{<br/>}
              <small>Desactivar el botón para observar los casos en las fechas actuales</small>{<br/>}
              <small>{currentStringDate}</small>{<br/>}
              
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <CountriesTable countries={this.parseTableData()} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <Container text>
          <p>Cualquier comentario, duda o sugerencia puedes contactarme <a href="https://twitter.com/phonnz/" target="_blank">@phonnz</a> o mirar el código <a href="https://github.com/phonnz/covid-mx" target="_blank" rel="noopener noreferrer">Github</a></p>
          <p>Inspirado en la prueba de <a href="https://snack.expo.io/@xnt/coronavirus-ca" target="_blank" rel="noopener noreferrer">@xnt</a> el dashboard de <a href="https://covid.sdelmont.com/" target="_blank" rel="noopener noreferrer">@sd</a></p>
          <p><a href="https://experience.arcgis.com/experience/685d0ace521648f8a5beeeee1b9125cd" target="_blank" rel="noopener noreferrer">WHO</a> | <a href="https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6" target="_blank" rel="noopener noreferrer">JHU</a> | <a href="https://covid19.isciii.es/" target="_blank" rel="noopener noreferrer">ISC</a></p>
          <p>Datos de: <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank" rel="noopener noreferrer">JHU</a> <a href="https://ourworldindata.org/" target="_blank" rel="noopener noreferrer">OWD</a></p>
        </Container>
      </Container>

    );
  }

}

export default App;
