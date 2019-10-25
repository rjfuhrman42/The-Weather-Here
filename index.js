const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch')
const app = express();
require('dotenv').config();

const database = new Datastore('database.db');
database.loadDatabase();

app.listen(3000, () => console.log("listening on port 3000..."));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) throw err
        response.json(data);
    })
});

app.post('/api', (request, response) => {
    const data = request.body
    // const timestamp = Date.now();
    // data.timestamp = timestamp.toLocaleString();
    database.insert(data);
    console.log(data);
    response.json(data);
});


app.get('/weather/:latlon', async (request, response) => {
    console.log(request.params.latlon);
    const {latlon} = request.params;
    const api_key = process.env.API_KEY;
    const weather_url = `https://api.darksky.net/forecast/${api_key}/${latlon}`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${latlon}`;
    console.log(aq_url);
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    const data = {
        weather: weather_data,
        air_quality: aq_data
    }

    response.json(data);
});


