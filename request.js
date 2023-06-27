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

class ZoneReq {
  constructor() {
    this.core = new Core();
  }
  async requestZone() {
    const request = new APIRequest(this.core.zones_data_url);
    const response = await request.sendRequest();
    return response;
  }
}

module.exports = new ZoneReq();
module.exports = new AirportReq();
