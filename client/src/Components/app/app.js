import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import Main from '../main/main';
import FlowerList from '../flowerlist/flowerlist';
import FlowerSightings from '../flowerinfo/flowerinfo';
import styles from './app.css';

class App extends Component {
	putDataToDB = message => {
		let currentIds = this.state.data.map(data => data.id);
		let idToBeAdded = 0;
		while (currentIds.includes(idToBeAdded)) {
		++idToBeAdded;
		}

		axios.post("/api/putData", {
		id: idToBeAdded,
		message: message
		});
	};

	deleteFromDB = idTodelete => {
		let objIdToDelete = null;
		this.state.data.forEach(dat => {
		if (dat.id === idTodelete) {
			objIdToDelete = dat._id;
		}
		});

		axios.delete("/api/deleteData", {
		data: {
			id: objIdToDelete
		}
		});
	};

	updateDB = (idToUpdate, updateToApply) => {
		let objIdToUpdate = null;
		this.state.data.forEach(dat => {
		if (dat.id === idToUpdate) {
			objIdToUpdate = dat._id;
		}
		});

		axios.post("/api/updateData", {
			id: objIdToUpdate,
			update: { message: updateToApply }
		});
	};

	render() {
		return(
			<div className={styles.app}>
				<div className={styles.large}>
					<div className={styles.oval1}></div>
					<div className={styles.oval2}></div>
					<div className={styles.oval3}></div>
					<div className={styles.oval4}></div>
				</div>
				<div className={styles.small}>
					<div className={styles.oval1s}></div>
					<div className={styles.oval2s}></div>
					<div className={styles.oval3s}></div>
					<div className={styles.oval4s}></div>
				</div>
				<BrowserRouter>
					<Switch>
						<Route path='/flowerlist/:flowerName' render={props => <FlowerSightings {...props} />}></Route>
						<Route path='/flowerlist' component={FlowerList} />              
						<Route path='/' component={Main} />
						<Route path='*' component={Main} />
					</Switch>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;

/* 
<div className={styles.whiteCircle}>
					<div className={styles.flowerListLink} unselectable='on'>Flowers</div>
				</div>
*/