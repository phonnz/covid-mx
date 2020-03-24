import React from 'react';
import Papa from 'papaparse';
import RegionData from './Components/RegionData';
import './App.css';
import Chart from './Components/Chart';

const endpoint =
  'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv';



class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      jsonData: null,
      refreshing: false,
    };
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
    const { jsonData, date, refreshing } = this.state;
    return (
      <div>

          <RegionData data={jsonData} region="Mexico" emoji="🇲🇽" date={date} />
          <Chart />
      </div>
      
    );
  }
  
}

export default App;
