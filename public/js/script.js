var count = 0;
var trackLength = 0;
var musicPlayer = {};
var musicJson = {};
var currentSong = {};
var targets = {};
var target;

document.addEventListener('DOMContentLoaded', function () {
    var musicData = {};
    var userData = {};
    musicPlayer = document.getElementById("song-audio")
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "./api/musiclist");

    xhr.addEventListener("load", function (data) {
        musicData = data;
        // console.log(musicData);
        initiate(userData, musicData);
    });

    xhr.send();
    
    var xhr2 = new XMLHttpRequest();

    xhr2.open("GET", "./api/heartrate?id=user");

    xhr2.addEventListener("load", function (data) {
        userData = data;
        // console.log(userData);
        initiate(userData, musicData);
    });

    xhr2.send();
});

function initiate(userData, musicData) {
    if (2 <= ++count)
    {
        var userJson = JSON.parse(userData.target.response);
        populateUserData(userJson);

        musicJson = JSON.parse(musicData.target.response);
        // console.log("Loaded");
        // console.log("musicJson", musicJson);
        // console.log("userJson", userJson);

        var song = getRandomSong(musicJson);

        // console.log(song);

        targets = getHrTargets(userJson);

        var musicSource = `./sounds/${song.filename}`;
        musicPlayer.src = musicSource;

        document.getElementById("fat-burning").addEventListener("click", function () {
            target = targets.fb;
            musicPlayer.playbackRate = target / song.bpm
            musicPlayer.play();

        });
        
        document.getElementById("cardio").addEventListener("click", function () {
            target = targets.c;
            // target = 200 // for testing only
            musicPlayer.playbackRate = target / song.bpm
            musicPlayer.play();
        });
    }
    
}

function getRandomSong(musicJson, currentSong) {
    var currentIndex;
    if (currentSong == undefined) { 
        currentIndex = -1; 
    } else {
        currentIndex = getSongIndex(musicJson, currentSong);
    }
    var newIndex = Math.trunc(Math.random() * musicJson.length);
    if (newIndex == currentIndex) {
        newIndex = Math.abs(newIndex - 1);
    }
    currentSong = musicJson[newIndex];
    return musicJson[newIndex];
}

function getSongIndex(musicJson, currentSong) {
    return musicJson.indexOf(currentSong);
}

function populateUserData(userJson) {
    var fbTargetSpan = document.getElementById("fat-burning-target");
    var cTargetSpan = document.getElementById("cardio-target");

    var targets = getHrTargets(userJson);

    fbTargetSpan.textContent = targets.fb;
    cTargetSpan.textContent = targets.c;
}

function getHrTargets(userJson) {
    var zones = userJson["activities-heart"][0].value.heartRateZones;
    var fbTarget = Math.trunc(zones[1].max * 0.9);
    var cTarget = Math.trunc(zones[2].max * 0.9);
    var targets = { fb: fbTarget, c: cTarget };
    return targets;
}

window.setInterval(function () {
    if (musicPlayer.ended) {
        var song = getRandomSong(musicJson, currentSong);
        musicPlayer.src = `./sounds/${song.filename}`;
        musicPlayer.playbackRate = target / song.bpm
        musicPlayer.play();
    }
}, 250);
