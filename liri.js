require("dotenv").config();
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var fs = require("fs");
var y = process.argv[2];
var x = process.argv[3];

//Use a switch case function to find x
function switchCase() {
  switch (y) {
    case 'concert-this':
      bandsInTown(x);
      break;

    case 'spotify-this-song':
      spotifySong(x);
      break;

    case 'movie-this':
      omdbInfo(x);
      break;

    case 'do-what-it-says':
      getRandom();
      break;

    default:
    console.log("Choose something else you Baboon!");    
  }
};


//Bands in town
function bandsInTown(artist) {
  var queryURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;
  axios.get(queryURL)
  .then(function (response) {
    var eventDate = moment(response.data[0].datetime).format('MM/DD/YYYY');
    console.log(`Name of Venue: ${response.data[0].venue.name}\nVenue Location: ${response.data[0].venue.city}\nDate of the Event: ${eventDate}`);
  })
  .catch(function (error) {
    console.log(error);
  });
};

//Spotify Function
function spotifySong(x) {
  var searchTrack;
  if (x === undefined) {
    searchTrack = "Ace of Base The Sign";
  } else {
    searchTrack = x;
  }

  spotify.search({
    type: "track",
    query: searchTrack
  }, function (err, data) {
    if (err) {
      return console.log(`Error has occured ${err}`);
    } else {
      console.log(`Artist: ${data.tracks.items[0].album.artists[0].name}\nSong: ${data.tracks.items[0].name}\nPreview: ${data.tracks.items[0].preview_url}\nAlbum: ${data.tracks.items[0].album.name}`)
    }
  });
};

//OMDB functions
function omdbInfo(x) {
  var findMovie;
  if (x === undefined) {
    findMovie = "Mr. Nobody";
  } else {
    findMovie = x;
    console.log(findMovie);
  }
  var queryURL = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";
axios
  .get(queryURL)
  .then(function(response){
    console.log(`Title: ${response.data.Title}\nRelease Year: ${response.data.Year}\nIMDB Rating: ${response.data.imdbRating}\nRotten Tomatoes Rating: ${response.data.Ratings[0].Value}\nCountry: ${response.data.Country}\nLanguage: ${response.data.Language}\nPlot: ${response.data.Plot}\nActors: ${response.data.Actors}`);
  }).catch(function(err){
    console.log(err)
  });
};

//Execute Random.txt
function getRandom() {
  fs.readFile('random.txt', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var dataArr = data.split(",");
    for (var i = 0; i < dataArr.length; i++) {
      // console.log(dataArr[i]);
      spotifySong(dataArr[i])
    }
  });
};


//Send to log.txt
function display(dataLog) {
  console.log(dataLog);

  fs.appendFile('log.txt', dataLog + '\n', function (err) {
    if (err) {
      return display(`Error has been logged to ${err}`)
    }
  })
}

switchCase();
display();


