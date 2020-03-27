import React, { Component } from 'react';
import { Container, Grid, GridColumn } from 'semantic-ui-react'
import Papa from 'papaparse';
import Chart from './Components/Chart';
import RegionData from './Components/RegionData';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

const endpoint =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';

  const countries= [
    {key: "Argentina",
    name: "Argentina",
    similar: true,
    option: false,
    wd: true,
    early:true,
  },
    {key: "Brazil",
    name: "Brasil",
    similar: true,
    option: true,
    wd: false,
    early:false,
  },
    {key: "Colombia",
    name: "Colombia",
    similar: true,
    option: false,
    wd: false,
    early:true,
  },
    {key: "Ecuador",
    name: "Ecuador",
    similar: true,
    option: false,
    wd: false,
    early:false,
  },
    {key: "Peru",
    name: "Perú",
    similar: true,
    option: false,
    wd: true,
    early:true,
  },
    {key: "Mexico",
    name: "México",
    similar: true,
    option: true,
    wd: true,
    early:true,
  },
    {key: "Italy",
    name: "Italia",
    similar: false,
    option: true,
    wd: false,
    early: false,
  },
    {key: "Spain",
    name: "España",
    similar: false,
    option: true,
    wd: false,
    early: false,
  },
    {key: "United Kingdom",
    name: "UK",
    similar: false,
    option: true,
    wd: false,
    early: false,
  },
    {key: "Germany",
    name: "Alemania",
    similar: false,
    option: true,
    wd: false,
    early: false,
  },
    {key: "Sweden",
    name: "Suecia",
    similar: false,
    option: true,
    wd: false,
    early: false,
  },
  {key: "Taiwan*",
    name: "Taiwan",
    similar: false,
    option: false,
    wd: true,
    early: true,
  },
  {key: "Paraguay",
    name: "Paraguay",
    similar: true,
    option: false,
    wd: true,
    early: true,
  },
  {key: "Korea, South",
    name: "Korea del sur",
    similar: false,
    option: false,
    wd: true,
    early: true,
  },
  {key: "Australia",
    name: "Australia",
    similar: false,
    option: false,
    wd: true,
    early: true,
  },
  {key: "Singapore",
  name: "Singapur",
  similar: false,
  option: false,
  wd: true,
  early: true,
  },

]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonData: null,
      refreshing: false,
      mxacccases: 425,
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
          similarData: this.transformData(results.data, countries, fields.slice(50, fields.length), 'similar'),
          wdData: this.transformData(results.data, countries, fields.slice(35, fields.length), 'wd' ),
          optionData: this.transformData(results.data, countries, fields.slice(40, fields.length), 'option'),
          earlyData: this.transformData(results.data, countries, fields.slice(55, fields.length), 'early'),
          date: lastColumn,
          // mxacccases:,
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
      earlyData,
      optionData 
      } = this.state;

    return (
      <Container fluid>
          <RegionData data={jsonData} region="Mexico" emoji="🇲🇽" date={date} />
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
