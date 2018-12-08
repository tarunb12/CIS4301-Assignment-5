import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Button, OverlayTrigger, Popover, Table } from 'react-bootstrap'
import styles from './flowerinfo.css';

class FlowerSightings extends Component {
    constructor(props) {
        super(props);
        this.state = { flowerSightingInfo: [], locationFeatures: [], redirect: false }
    }

    componentDidMount() {
        this.getFlowerSightingInfoFromDb();
        this.getLocationFeaturesFromDb();
    }

    getFlowerSightingInfoFromDb = () => {
        axios.get(`/api/getFlowerSightingInfo/${this.props.match.params.flowerName}`)
        .then(res => this.setState({ flowerSightingInfo: res.data.data }));
    }

    getLocationFeaturesFromDb = () => {
        axios.get('/api/getLocationFeatures')
        .then(res => this.setState({ locationFeatures: res.data.data }));
    }

    createTableBody = () => {
        let tableBody = [];
        const maxSightings = this.state.flowerSightingInfo.length < 10 ? this.state.flowerSightingInfo.length : 10;
        for (let i = 0; i < maxSightings; i++) {
            const sighting = this.state.flowerSightingInfo[i];
            const locationInfoArr = this.state.locationFeatures.filter(feature => feature.LOCATION === sighting.LOCATION);
            const locationInfo = locationInfoArr['0'];
            tableBody.push(
                <tr key={i} className={styles.tableRow}>
                    <td key={`${sighting.NAME} Person ${i}`} className={styles.tableData}>{sighting.PERSON}</td>
                        <OverlayTrigger trigger={['hover', 'focus']} placement='right' overlay={
                            <Popover id='popover-trigger-click-root-close' title={sighting.LOCATION}>
                                <strong>Class: </strong>{locationInfo.CLASS}
                                <br />
                                <strong>Latitude: </strong>{locationInfo.LATITUDE}
                                <br />
                                <strong>Longitude: </strong>{locationInfo.LONGITUDE}
                                <br />
                                <strong>Map: </strong>{locationInfo.MAP}
                                <br />
                                <strong>Elevation: </strong>{locationInfo.ELEV}
                            </Popover>
                        }>
                            <td key={`${sighting.NAME} Location ${i}`} className={`${styles.tableData} ${styles.locationData}`}>{sighting.LOCATION}</td>
                        </OverlayTrigger>
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
        const tbody = this.state.flowerSightingInfo.length === 0 || this.state.locationFeatures.length === 0 ? null : this.createTableBody();
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