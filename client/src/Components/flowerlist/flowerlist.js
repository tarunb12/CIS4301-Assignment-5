import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import styles from './flowerlist.css';

class FlowerList extends Component {
    constructor(props) {
        super(props);
        this.state = { redirect: false, flowerNames: [] };
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
        const numCols = 5;
        const initTableLength = flowerNames.length;
        let tableBody = [];
        for (let i = 0; i < Math.ceil(initTableLength / numCols); i++) {
            let children = [];
            for (let j = 0; j < numCols; j++) {
                children.push(<td key={flowerNames[flowerNames.length - 1]}><Link to={`/flowerlist/${flowerNames[flowerNames.length - 1]}`} className={styles.flowerNameLink}>{flowerNames[flowerNames.length - 1]}</Link></td>);
                flowerNames.pop()
            }
            tableBody.push(<tr key={i} className={styles.tableRow}>{children}</tr>)
        }
        return tableBody;
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to='/' />
        }
        const tbody = this.state.flowerNames.length === 0 ? null : this.createTableBody();
        return (
            <div className={styles.flowerNamesWrapper}>
                <Button className={styles.backButton} bsStyle='primary' onClick={() => this.setState({ redirect: true })}>Back</Button>
                <Table className={styles.flowerNamesTable}>
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