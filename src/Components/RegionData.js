import React from 'react';

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
          { formatNumber(entry[date]) } - {entry['Province/State'] || region} {emoji}
          </article>
          ))}
          </div>
    )
  }

  return header
};



export default React.memo(regionData);
