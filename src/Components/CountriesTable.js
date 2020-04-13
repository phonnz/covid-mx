import React from 'react'
import { Container, Divider,Table, Label } from 'semantic-ui-react'

const CountriesTable = (props) => {
    const countries = props.countries


    return (
        <Container>
        <Table inverted unstackable>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>País</Table.HeaderCell>
                    <Table.HeaderCell>*Población (Millones)</Table.HeaderCell>
                    <Table.HeaderCell>**Confirmados</Table.HeaderCell>
                    <Table.HeaderCell>***Fallecidos</Table.HeaderCell>
                    <Table.HeaderCell>Media de Edad</Table.HeaderCell>
                    <Table.HeaderCell>Densidad Poblacional km² </Table.HeaderCell>
                    {/* <Table.HeaderCell>Densidad Poblacional Capital</Table.HeaderCell> */}
                    {/* <Table.HeaderCell>Pruebas MHabitantes</Table.HeaderCell> */}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {countries && countries.map(country => {
                    const deathsPercentage = ((country.deaths*100)/country.confirmed).toFixed(2)
                    const confirmedPercentage = ((country.confirmed*100)/country.population).toFixed(4)
                    const deathsString = parseInt(country.deaths).toLocaleString()
                    const confirmedString = parseInt(country.confirmed).toLocaleString()
                    const populationString = country.population.toString().substring(0,country.population.toString().length -6) 
                    const thispositive = (countryKey) => countryKey === 'Mexico' 

                    if(country.key !== 'mx-centinela'){

                        return (
                        <Table.Row active={thispositive(country.key)}>
                            <Table.Cell>{country.name}
                            { country.teleport && 
                                ` (+${country.teleport} )`
                            }
                            </Table.Cell>
                        <Table.Cell textAlign='right'>{populationString} M</Table.Cell>
                        <Table.Cell textAlign='right'>{confirmedString}{' '} 
                        { confirmedPercentage && confirmedPercentage !== 'NaN' && 
                                <Label color='blue'>{ confirmedPercentage }%</Label>
                            }
                        </Table.Cell>
                        <Table.Cell textAlign='right'>{deathsString}{' '}
                            { deathsPercentage && deathsPercentage !== 'NaN' && 
                                <Label color='red'>{ deathsPercentage }%</Label>
                            }
                        </Table.Cell>
                        <Table.Cell textAlign='right'>{country.medianAge}</Table.Cell>
                        <Table.Cell textAlign='right'>
                            { country.populationDensity !== 0 && parseInt(country.populationDensity) }</Table.Cell>
                        {/* <Table.Cell textAlign='right'>
                            { country.capitalDensity !== 0 && country.capitalDensity }</Table.Cell> */}
                        {/* <Table.Cell textAlign='right'>{country.testAmount}</Table.Cell> */}
                    </Table.Row>
                    )
                }

                })
                }
            </Table.Body>

        </Table>
        <Divider />
        <small> * Población al 2019 (OWD)</small>{<br/>}
        <small> **El porcentaje en la columna de Fallecidos es con respecto a casos confirmados</small>{<br/>}
        <small> ***El porcentaje en la columna de Confirmados es con respecto a total de población</small>{<br/>}
        <small> Densidaddepoblación al 2017 (OWD)</small>{<br/>}
        <small> Media de edad 2015 (OWD)</small>{<br/>}      
        </Container>
    )
}

export default CountriesTable