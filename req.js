const { AirportReq, FlightsReq, FlightData } = require('./request.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter 1 to request airport data or 2 to add a comment: ', (answer) => {
  if (answer === '1') {
    rl.question('Enter the ICAO-Code or IATA-Code of the airport: ', (icao) => {

      const airportReq = new AirportReq();

      airportReq.requestAirport(icao)
        .then(response => {
          console.log('Response:', response);
          rl.close();
        })
        .catch(error => {
          console.error(error);
          rl.close();
        });
    });

  } else if (answer === '2') {

    const flightReq = new FlightsReq();

    const limit = 10;

    flightReq.requestFlights(limit)
      .then(response => {

        let filteredResponse = {}

        const keys = Object.keys(response).filter(k => k !== 'full_count' && k !== 'version');
        keys.forEach(key => {
          const flightData = response[key];

          if (flightData.length > 0) {
            filteredResponse = {
              flightdata: {
                flightId: key,
                flightNumber: flightData[0]
              }
            }

            console.log('Response:', filteredResponse);
          }
        });
      });
      
  } else if (answer === '3') {
    rl.question('Enter the flight ID: ', (flightId) => {
      const flightData = new FlightData();

      flightData.requestFlightData(flightId)
        .then(response => {
          const filteredResponse = {
            flightdata: {
              flightId: response.identification?.id,
              callsign: response.identification?.callsign,
            },
            status: {
              live: response.status?.live,
              text: response.status?.text,
            },
            aircraft: {
              model: response.aircraft?.model?.text,
              registration: response.aircraft?.registration,
            },
            airline: {
              name: response.airline?.name,
              shortName: response.airline?.short,
              iata: response.airline?.code.iata,
              icao: response.airline?.code.icao,
              url: response.airline?.url,
            },
            airport: {
              origin: {
                name: response.airport.origin?.name,
              },
              destination: {
                name: response.airport.destination?.name,
              },
            },
          };

          // console.log('Filtered Response:', filteredResponse);
          console.log('Response:', response);
          rl.close();
        })
        .catch(error => {
          console.error(error);
          rl.close();
        });
    });
  } else {
    console.log('Invalid input. Please enter 1 or 2.');
    rl.question('Enter 1 to request airport data or 2 to add a comment: ', (answer) => {
      // handle input recursively
    });
  }
});