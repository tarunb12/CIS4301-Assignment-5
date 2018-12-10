import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import styles from './main.css';

class Main extends Component {
    render() {
        return (
            <div className={styles.whiteCircle}>
				<Link className={styles.flowerListLink} unselectable='on' to='/flowerlist'>Flowers</Link>
			</div>
        );
    }
}

export default Main;