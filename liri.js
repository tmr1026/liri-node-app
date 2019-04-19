require("dotenv").config();
const keys = require("./keys.js");
const axios = require('axios');
const Spotify = require('node-spotify-api');
const fs = require('fs');
const moment = require('moment');
const command = process.argv[2];
const value = process.argv[3];
const spotify = new Spotify(keys.spotify);


switch(command) {
    case 'concert-this':
        showConcerts(value);
        break;
    case 'spotify-this-song':
        showSpotify(value);
        break;
    case 'movie-this':
        showMovie(value);
        break;
    case 'do-what-it-says':
        doThis(value);
        break;    
    default:
        console.log('Please enter the following \n liri spotify-this-song song_name \n liri concert-this band_name');
};

function showSpotify(item) {
    spotify.search({ type: 'track', query: item, limit: 10 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      //console.log(data);
      var songs = data.tracks.items
      //for(let i=0; i < 5; i++)
      console.log("Artist(s): " + songs[0].artists[0].name);
      console.log("Song Name: " + songs[0].name);
      console.log("Preview Link: " + songs[0].preview_url);
      console.log("Album: " + songs[0].album.name);
      });
}


function showConcerts(artist) {

    const url = 'https://rest.bandsintown.com/artists/'  + artist  +  '/events?';

    axios.get(url, {
            params: {
                app_id: 'codingbootcamp'
            }
        })
        .then(function (response) {
            for (var i = 0; i < response.data.length; i++) {
    
                var concertResults = 
                    "--------------------------------------------------------------------" +
                        "\nVenue Name: " + response.data[i].venue.name + 
                        "\nVenue Location: " + response.data[i].venue.city +
                        "\nDate of the Event: " + moment(response.data[i].datetime).format('LL');
                console.log(concertResults);
            }
        
        })
        .catch(function (error) {
            console.log(error);
        });
}

function showMovie(value) {
    if (!value){
            value = 'Mr Nobody';
            console.log("If you haven't watched 'The Departed,' then you should: https://www.imdb.com/title/tt0407887/");
            console.log("It's on Netflix!");
    	}

	var queryUrl = "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy";

	axios.get(queryUrl, {
            params: {
                app_id: 'codingbootcamp'
            }
        })    
        .then(function (response) {
            //console.log(response)
		    console.log("Title: " + response.data.Title);
		    console.log("Release Year: " + response.data.Year);
		    console.log("IMDB Rating: " + response.data.imdbRating);
		    console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
		    console.log("Country: " + response.data.Country);
		    console.log("Language: " + response.data.Language);
		    console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        })
        .catch(function (error) {
            console.log(error);
        })   
};
function doThis(value) {

    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(',');
        showSpotify(dataArr[0], dataArr[1]);
    })
}
