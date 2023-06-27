const fetch = require('cross-fetch');
const Core = require('./core.js');

class APIRequest {
  constructor(url) {
    this.url = url;
  }

  async sendRequest() {
    const response = await fetch(this.url);
    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  }
}

class AirportReq {
  constructor() {
    this.core = new Core();
  }

  async requestAirport(icao) {
    const request = new APIRequest(this.core.airport_data_url(icao));
    const response = await request.sendRequest();
    return response;
  }
}

class FlightsReq {
  constructor() {
    this.core = new Core();
  }

  async requestFlights(limit) {
    const request = new APIRequest(`${this.core.real_time_flight_tracker_data_url}?limit=${limit}`);
    const response = await request.sendRequest();
    return response;
  }
}

class FlightData {
  constructor() {
    this.core = new Core();
  }

  async requestFlightData(flightId) {
    const request = new APIRequest(this.core.flight_data_url(flightId));
    const response = await request.sendRequest();
    return response;
  }
}


module.exports = {
  AirportReq,
  FlightsReq,
  FlightData
}
