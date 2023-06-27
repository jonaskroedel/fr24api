const request = require('./request.js');
const icao = "LOWI"; // ICAO-Code des Flughafens hier angeben
request.requestAirport(icao)
  .then(response => {
    console.log('Response:', response);
  })
  .catch(error => {
    console.error(error);
  });


request.requestZone()
  .then(response => {
    console.log('Response:', response);
  })
  .catch(error => {
    console.error(error);
  });