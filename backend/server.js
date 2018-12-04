require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
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

router.get('/getFlowerSightingInfo/:flowerName', (req, res) => {
	db.all('SELECT * FROM SIGHTINGS WHERE NAME = ? ORDER BY SIGHTED DESC', [ req.params.flowerName ], (err, data) => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true, data: data });
	});
});

router.post("/updateData", (req, res) => {
	// const { id, update } = req.body;
	// Data.findOneAndUpdate(id, update, err => {
	// 	if (err) return res.json({ success: false, error: err });
	// 	return res.json({ success: true });
	// });
});

router.delete("/deleteData", (req, res) => {
	// const { id } = req.body;
	// Data.findOneAndDelete(id, err => {
	// 	if (err) return res.send(err);
	// 	return res.json({ success: true });
	// });
});

router.post("/putData", (req, res) => {
	// let data = new Data();

	// const { id, message } = req.body;

	// if ((!id && id !== 0) || !message) {
	// 	return res.json({
	// 	success: false,
	// 	error: "INVALID INPUTS"
	// 	});
	// }
	// data.message = message;
	// data.id = id;
	// data.save(err => {
	// 	if (err) return res.json({ success: false, error: err });
	// 	return res.json({ success: true });
	// });
});

app.use('/api', router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));