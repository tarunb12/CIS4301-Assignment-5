import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import NewSightingModal from '../newsightingmodal/newsightingmodal';
import styles from './flowerlist.css';

class FlowerList extends Component {
    constructor(props) {
        super(props);
        this.state = { flowerNames: [], redirect: false, redirectFlower: '', showModal: false };
    }

    componentDidMount() {
        this.getFlowersFromDb();
    }

    getFlowersFromDb = () => {
        axios.get('/api/getFlowers')
        .then(res => this.setState({ flowerNames: res.data.data }));
    };
    
    createTableBody = () => {
        let flowerNames = [];
        for (let i = 0; i < this.state.flowerNames.length; i++) {
            flowerNames[i] = this.state.flowerNames[i].NAME;
        }
        flowerNames.reverse();
        const numCols = 5;
        const initTableLength = flowerNames.length;
        let tableBody = [];
        for (let i = 0; i < Math.ceil(initTableLength / numCols); i++) {
            let children = [];
            for (let j = 0; j < numCols; j++) {
                const flowerName = flowerNames[flowerNames.length - 1]
                children.push(<td key={flowerName} className={styles.tableData} onClick={() => this.setState({ redirect: true, redirectFlower: `flowerlist/${flowerName}` })}>{flowerName}</td>);
                flowerNames.pop()
            }
            tableBody.push(<tr key={i} className={styles.tableRow}>{children}</tr>)
        }
        return tableBody;
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={`/${this.state.redirectFlower}`} />
        }
        const tbody = this.state.flowerNames.length === 0 ? null : this.createTableBody();
        return (
            <div className={styles.flowerNamesWrapper}>
                <div className={styles.headingWrapper}>
                    <Button className={styles.backButton} bsStyle='primary' onClick={() => this.setState({ redirect: true })}>Back</Button>
                    <h3 className={styles.flowerNamesHeader}>&nbsp;</h3>
                    <NewSightingModal />
                </div>
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