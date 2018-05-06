const express = require('express');
const request = require("request");
const app = express();
const env = require('./.env');

app.use(express.static('public'));
app.use("/", express.static('public/html'));

app.get("/api/heartrate", function (req, res) {
    var userId = req.query.id;
    var hrPromise = getHeartRatePromise(userId);

    hrPromise.then((data) => {
        console.log('data', data);
        res.json(JSON.parse(data));
        res.end();
    });
});

app.get("/api/musiclist", function (req, res) {
    var musicList = [
        {
            name: "Eyes of Glory",
            filename: "Eyes_of_Glory.mp3",
            bpm: 55
        },
        {
            name: "Coupe",
            filename: "Coupe.mp3",
            bpm: 90
        },
        {
            name: "Mirage",
            filename: "Mirage.mp3",
            bpm: 110
        },
        {
            name: "New Tires",
            filename: "New_Tires.mp3",
            bpm: 80
        },
        {
            name: "Urban Lullaby",
            filename: "Urban_Lullaby.mp3",
            bpm: 60
        },
        
    ]
    res.json(musicList);
    res.end();
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

function cl() {
    console.log.apply(null, arguments);
}

function getHeartRatePromise(userId) {
    var options = { 
        method: 'GET',
        url: `https://api.fitbit.com/1/${userId}/-/activities/heart/date/today/1d.json`,
        headers: 
        { 
            Authorization: env.auth
        }
    };

    var prom = new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log('this is body', body);
            resolve(body);
        });
    });
    return prom;
}
