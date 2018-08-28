'use strict'

const ClinicalTrials = require('clinical-trials-gov');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const fs = require('fs');

let jsondata = [];

app.set('port', (process.env.PORT || 5000));

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {

	let condition = req.query.condition;
	let country = req.query.country;
	let q = req.query.q;
	let loc = req.query.loc;
	let status = req.query.status;
	let gender = req.query.gender;
	let age = req.query.age;
	let state = req.query.state;
	let statecode = '';

	

	//console.log(condition + ' ' + q);

	if (typeof q == 'undefined' && typeof loc == 'undefined') {
		//http://localhost/nodejs?condition=asthma&country=US


		if(country == 'US') {
			if(typeof state != 'undefined') {
				if(state.length > 0) {
					for(let i=0; i<jsondata.length; i++) {
						//console.log(jsondata[i].state);
						if(jsondata[i].state.toLowerCase() == state.toLowerCase()) {
							statecode = jsondata[i].code;
							console.log(statecode);
							break;
						}
					}
				}
			}
		}


		ClinicalTrials.search({condition: condition, country, status, gender, age, statecode}).then(trials => {
			//console.log(trials);
			res.end(JSON.stringify(trials));
		});
	} else if (typeof q != 'undefined' && typeof loc == 'undefined') {
		//http://localhost/nodejs?q=NCT00001372
		ClinicalTrials.searchD({condition: q}).then(trials => {
			//console.log(trials);
			res.end(JSON.stringify(trials));
		});
	}
})


let port = process.env.PORT || 5000;

function start() {
	fs.readFile("data/usstate.json", 'utf8', function (err, data) {
		if (err) throw err;
		else {
			jsondata = JSON.parse(data);

			// Spin up the server
			app.listen(app.get('port'), function() {
				console.log('running on port', app.get('port'))
			});
		}
	});
}

start();

	
