require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const sqlite3 = require('sqlite3').verbose();

const API_PORT = 3001;
const app = express();
const router = express.Router();

let db = new sqlite3.Database(`./db/${process.env.DB_NAME}.db`);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

router.get('/getFlowers', (req, res) => {
	db.all('SELECT DISTINCT NAME FROM SIGHTINGS ORDER BY NAME ASC', (err, data) => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true, data: data });
	});
});

router.get('/getFlowerNameInfo/:flowerName', (req, res) => {
	db.all('SELECT * FROM FLOWERS WHERE COMNAME = ?', [ req.params.flowerName ], (err, data) => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true, data: data });
	});
});

router.get('/getFlowerSightingInfo/:flowerName', (req, res) => {
	db.all('SELECT * FROM SIGHTINGS WHERE NAME = ? ORDER BY SIGHTED DESC', [ req.params.flowerName ], (err, data) => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true, data: data });
	});
});

router.get('/getFlowerLocations', (req, res) => {
	db.all('SELECT DISTINCT LOCATION FROM FEATURES', (err, data) => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true, data: data });
	});
});

router.get('/getLocationFeatures', (req, res) => {
	db.all('SELECT * FROM FEATURES', (err, data) => {
		if(err) return res.json({ success: false, error: err });
		return res.json({ success: true, data: data });
	});
});

router.post('/updateFlowerSightingInfo', (req, res) => {
	const { oldSighting, flowerName, newSighting } = req.body;
	const { oldSighter, oldLocation, oldDate } = oldSighting;
	const { newSighter, newLocation, newDate } = newSighting;
	const inputData = [ newSighter, newLocation, newDate, flowerName, oldSighter, oldLocation, oldDate ];
	db.run('UPDATE SIGHTINGS SET PERSON = ?, LOCATION = ?, SIGHTED = ? WHERE NAME = ? AND PERSON = ? AND LOCATION = ? AND SIGHTED = ?', inputData, err => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true, data: inputData });
	})
});

app.use('/api', router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));