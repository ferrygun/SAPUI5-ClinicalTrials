'use strict'

const ClinicalTrials = require('clinical-trials-gov');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const fs = require('fs');

let jsondata;

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {

	let condition = req.query.condition;
	let q = req.query.q;
	let loc = req.query.loc;

	//console.log(condition + ' ' + q);

	if (typeof q == 'undefined' && typeof loc == 'undefined') {
		console.log('A');
		//http://localhost/nodejs?condition=asthma
		ClinicalTrials.search({condition: condition}).then(trials => {
			//console.log(trials);
			res.end(JSON.stringify(trials));
		});
	} else if (typeof q != 'undefined' && typeof loc == 'undefined') {
		console.log('B');
		//http://localhost/nodejs?q=NCT00001372
		ClinicalTrials.searchD({condition: q}).then(trials => {
			//console.log(trials);
			res.end(JSON.stringify(trials));
		});
	}

	if (typeof loc != 'undefined') {
		console.log('C');
		let len = jsondata.features.length;
		let lat, lng = 0;

		if(len > 0) {
			for(var i=0; i<len; i++) {
				if(loc.toLowerCase() === jsondata.features[i].properties.name.toLowerCase()) {
					lat = jsondata.features[i].properties.latitude;
					lng = jsondata.features[i].properties.longitude;

					console.log(loc + ':' + lat + ':' + lng);
					res.end(generateJson(lat, lng));
					break;
				}
			}
			res.end("no data");
		} else 
			res.end("no data");
		
	}

})

function generateJson(lat, lng) {
	let json = "{";
	json = json + "lat: " + lat + ",\n";
	json = json + "lng: " + lng;
	json = json + "}";
	return json;
}

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var z = 0; z < 1e7; z++) {
		if ((new Date().getTime() - start) > milliseconds){
			break;
		}
	}
}

let port = process.env.PORT || 5000;

function start() {
	fs.readFile('data/country.geojson', 'utf8', function (err, data) {
		if (err) throw err;
		else {
			jsondata = JSON.parse(data);
			
			// Spin up the server
			app.listen(app.get('port'), function() {
				console.log('running on port', app.get('port'))
			})
		}
	});
}

start();

	