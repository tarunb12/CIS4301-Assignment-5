import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap'
import styles from './flowerinfo.css';

class FlowerSightings extends Component {
    constructor(props) {
        super(props);
        this.state = { redirect: false, flowerSightings: [] }
    }

    componentDidMount() {
        this.getFlowerSightingInfoFromDb();
    }

    getFlowerSightingInfoFromDb = () => {
        axios.get(`/api/getFlowerSightingInfo/${this.props.match.params.flowerName}`)
        .then(res => this.setState({ flowerSightings: res.data.data }));
    }

    createTableBody = () => {
        let tableBody = [];
        const maxSightings = this.state.flowerSightings.length < 10 ? this.state.flowerSightings.length : 10;
        for (let i = 0; i < maxSightings; i++) {
            const sighting = this.state.flowerSightings[i];
            tableBody.push(
                <tr key={i} className={styles.tableRow}>
                    <td key={`${sighting.NAME} Person ${i}`} className={styles.tableData}>{sighting.PERSON}</td>
                    <td key={`${sighting.NAME} Location ${i}`} className={styles.tableData}>{sighting.LOCATION}</td>
                    <td key={`${sighting.NAME} Date ${i}`} className={styles.tableData}>{sighting.SIGHTED}</td>
                </tr>
            );
        }
        return tableBody;
    }

    render() {       
        if (this.state.redirect) {
            return <Redirect push to='/flowerlist' />
        }
        const tbody = this.state.flowerSightings.length === 0 ? null : this.createTableBody();
        return (
            <div className={styles.flowerSightingsWrapper}>
                <div className={styles.headingWrapper}>
                    <Button className={styles.backButton} bsStyle='primary' onClick={() => this.setState({ redirect: true })}>Back</Button>
                    <h3 className={styles.flowerNameHeader}>{this.props.match.params.flowerName}</h3>
                </div>
                <Table className={styles.flowerSightingsTable} hover bordered>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th className={styles.tableHeadElement}>Person</th>
                            <th className={styles.tableHeadElement}>Location</th>
                            <th className={styles.tableHeadElement}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tbody}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default FlowerSightings;