import React from 'react'
import { Table } from 'semantic-ui-react'

const CountriesTable = (props) => {
    const countries = props.countries 
    
    return (
        
        <Table inverted>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>País</Table.HeaderCell>
        <Table.HeaderCell>Confirmados</Table.HeaderCell>
        <Table.HeaderCell>Fallecidos</Table.HeaderCell>
        <Table.HeaderCell>Media de Edad</Table.HeaderCell>
        <Table.HeaderCell>Densidad Poblacional</Table.HeaderCell>
        <Table.HeaderCell>Pruebas/MHabitantes
        </Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
        {countries && countries.map(country => {
            return ( <Table.Row>
        <Table.Cell>{ country.name}</Table.Cell>
        <Table.Cell>{ country.confirmed}</Table.Cell>
        <Table.Cell>{ country.deaths}</Table.Cell>
        <Table.Cell>{ country.populationAge}</Table.Cell>
        <Table.Cell>{ country.populationDensity}</Table.Cell>
        <Table.Cell>{ country.testAmount}</Table.Cell>
      </Table.Row>
            )

})
        }
      </Table.Body>
    
  </Table>
    )
}
    
export default CountriesTable