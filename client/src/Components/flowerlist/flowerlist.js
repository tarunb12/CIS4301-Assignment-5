import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import { Button, ButtonGroup, Table } from 'react-bootstrap';
import NewSightingModal from '../newsightingmodal/newsightingmodal';
import UpdateFlowerModal from '../updateflowermodal/updateflowermodal';
import styles from './flowerlist.css';

class FlowerList extends Component {
    constructor(props) {
        super(props);
        this.state = { flowerNames: [], flowerToUpdate: null, redirect: false, redirectFlower: '', showNewSightingModal: false, showUpdateFlowerModal: false, updateFlower: false };
    }

    componentDidMount() {
        this.getFlowersFromDb();
    }

    getFlowersFromDb = () => {
        axios.get('/api/getFlowers')
        .then(res => this.setState({ flowerNames: res.data.data.map(flowerName => flowerName.NAME) }));
    }
    
    createTableBody = () => {
        let flowerNames = Array.from(this.state.flowerNames)
        flowerNames.reverse();
        const numCols = 5;
        const initTableLength = flowerNames.length;
        let tableBody = [];
        for (let i = 0; i < Math.ceil(initTableLength / numCols); i++) {
            let children = [];
            for (let j = 0; j < numCols; j++) {
                const flowerName = flowerNames[flowerNames.length - 1]
                children.push(<td key={flowerName} className={styles.tableData} onClick={() => this.state.updateFlower ? this.setState({ flowerToUpdate: flowerName, showUpdateFlowerModal: true, updateFlower: false }) : this.setState({ redirect: true, redirectFlower: `flowerlist/${flowerName}` })}>{flowerName}</td>);
                flowerNames.pop()
            }
            tableBody.push(<tr key={i} className={styles.tableRow}>{children}</tr>)
        }
        return tableBody;
    }

    handleFlowerUpdateModalClose = () => {
        this.setState({ flowerToUpdate: null, showUpdateFlowerModal: false, updateFlower: false });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={`/${this.state.redirectFlower}`} />
        }
        const updateFlowerHeading = <div className={styles.updateFlowerOnClickHeading}>Click on the flower you would like to update.</div>
        const tbody = this.state.flowerNames.length === 0 ? null : this.createTableBody();
        return (
            <div className={styles.flowerNamesWrapper}>
                <div className={styles.headingWrapper}>
                    <Button className={styles.backButton} bsStyle='primary' onClick={() => this.setState({ redirect: true })}>Back</Button>
                    <h3 className={styles.flowerNamesHeader}>&nbsp;</h3>
                    <ButtonGroup className={styles.addUpdateButtons}>
                        <Button className={styles.updateButton} bsStyle='primary' onClick={() => this.setState({ updateFlower: !this.state.updateFlower, showNewSightingModal: false })}>{!this.state.updateFlower ? 'Update Flower' : 'Cancel'}</Button>
                        <UpdateFlowerModal show={this.state.showUpdateFlowerModal} handleClose={this.handleFlowerUpdateModalClose} flowerName={this.state.flowerToUpdate} reloadFlowerNameInfo={this.getFlowersFromDb} />
                        <Button className={styles.newButton} bsStyle='primary' onClick={() => this.setState({ showNewSightingModal: true, updateFlower: false, showUpdateFlowerModal: false })}>+ Add New Sighting</Button>
                        <NewSightingModal show={this.state.showNewSightingModal} />
                    </ButtonGroup>
                </div>
                {this.state.updateFlower ? updateFlowerHeading : null}
                <Table className={styles.flowerNamesTable} bordered>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th colSpan={5} className={styles.tableHeadElement}>Flowers Sighted</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {tbody}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default FlowerList;