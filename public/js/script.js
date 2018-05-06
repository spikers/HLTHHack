var count = 0;

document.addEventListener('DOMContentLoaded', function () {
    var musicData = {};
    var userData = {};

    var xhr = new XMLHttpRequest();

    xhr.open("GET", "http://localhost:3000/api/musiclist");

    xhr.addEventListener("load", function (data) {
        musicData = data;
        console.log(musicData);
        initiate(userData, musicData);
    });

    xhr.send();
    
    var xhr2 = new XMLHttpRequest();

    xhr2.open("GET", "http://localhost:3000/api/heartrate?id=user");

    xhr2.addEventListener("load", function (data) {
        userData = data;
        console.log(userData);
        initiate(userData, musicData);
    });

    xhr2.send();
});

function initiate(userData, musicData) {
    if (2 <= ++count)
    {
        var userJson = JSON.parse(userData.target.response);
        populateUserData(userJson);

        var musicJson = JSON.parse(musicData.target.response);
        console.log("Loaded");
        console.log("musicJson", musicJson);
        console.log("userJson", userJson);

        var song = getRandomSong(musicJson);

        console.log(song);

        var targets = getHrTargets(userJson);

        var musicPlayer = document.getElementById("song-audio");
        var musicSource = `http://localhost:3000/sounds/${song.filename}`;
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
    return musicJson[newIndex];
}

function getSongIndex(musicJson, currentSong) {
    return musicJson.indexOf(current);
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
