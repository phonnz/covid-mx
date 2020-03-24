import React from 'react';
// import { Platform, Text, View, StyleSheet, Image } from 'react-native';
// import RegionHeader from './RegionHeader';

const formatNumber = (number) => {
  if (number.length < 2) {
    return ` ${number}`;
  }
  return number;
}

const regionData = ({ region, data, date, emoji }) => {
  const regionalFilter = result => result['Country/Region'] === region && result[date] !== '0';
  const header = <div>MX</div>//<RegionHeader name={region} emoji={emoji} />;

  if (data !== null) {
    const regionalData = data.filter(regionalFilter);
    return (
      <div>

        {regionalData.map(entry => (
          <article>

          { formatNumber(entry[date]) } "-" {entry['Province/State'] || region}
          
          </article>
          ))}
          </div>
    );
  }

  return header
};

const styles = {
  region: {
    borderWidth: 1,
    backgroundColor: "#e0e0e0",
    borderStyle: "solid",
    borderColor: "#333",
    marginBottom: 10,
    padding: 5,
  },
  province: {
    backgroundColor: "#dfdfdf",
    display: "block",
    margin: 5,
  },
  provinceText: {
    fontSize: 16,
  },
};

export default React.memo(regionData);
