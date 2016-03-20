// server.js

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var influx     = require('influx')

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var influxConfig = {
  host: process.env.INFLUX_DB_HOST,
  port: process.env.INFLUX_DB_PORT,
  protocol: 'http',
  username: process.env.INFLUX_DB_USERNAME,
  password: process.env.INFLUX_DB_PASSWORD,
  database: process.env.INFLUX_DB_DATABASE
}

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

var client = influx(influxConfig)

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {

    var query = 'SELECT last(value) FROM env_humidity; SELECT last(value) FROM env_temperature; SELECT last(value) FROM env_pressure;';
    client.query([query], function(err, results) {

      var room = {
        room_humidity: results[0][0].last,
        room_temperature: results[1][0].last,
        room_pressure: results[2][0].last
      }

      res.json(room);
    })
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
