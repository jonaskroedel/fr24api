const fetch = require('cross-fetch');


class APIRequest {
  constructor(url) {
    this.url = url;
  }

  async sendRequest() {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error(`Request failed with status code ${response.status}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      throw new Error(`An error occurred: ${error.message}`);
    }
  }
}

const airportCode = 'LOWI';
const airportDataUrl = `https://www.flightradar24.com/airports/traffic-stats/?airport=${airportCode}`;

async function getOutstandingDepartures() {
  try {
    const request = new APIRequest(airportDataUrl);
    const response = await request.sendRequest();

    console.log('Response:', response);

  } catch (error) {
    console.error(error);
  }
}

getOutstandingDepartures("LOWI");
