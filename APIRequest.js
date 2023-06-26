const http = require('http');
const https = require('https');
const brotli = require('brotli');
const zlib = require('zlib');

class APIRequest {
  __content_encodings = {
    '': (x) => x,
    br: brotli.decompress,
    gzip: zlib.gunzipSync,
  };

  constructor(
    url,
    params = null,
    headers = null,
    data = null,
    cookies = null,
    exclude_status_codes = []
  ) {
    this.url = url;

    this.request_params = {
      params,
      headers,
      data,
      cookies,
    };

    const requestMethod = data === null ? http.get : https.request;

    if (params) {
      url += '?' + new URLSearchParams(params).toString();
    }

    const options = {
      method: data === null ? 'GET' : 'POST',
      headers,
      cookies,
    };

    return new Promise((resolve, reject) => {
      const req = requestMethod(url, options, (res) => {
        let responseContent = '';

        res.on('data', (chunk) => {
          responseContent += chunk;
        });

        res.on('end', () => {
          this.__response = {
            content: responseContent,
            headers: res.headers,
            status_code: res.statusCode,
            cookies: res.headers['set-cookie'],
          };

          if (this.get_status_code() === 520) {
            reject(new CloudflareError(
              'An unexpected error has occurred. Perhaps you are making too many calls?',
              this.__response
            ));
          }

          if (!exclude_status_codes.includes(this.get_status_code())) {
            reject(new Error(`Request failed with status code ${this.get_status_code()}. Response: ${JSON.stringify(this.get_content(), null, 2)}`));
          } else {
            resolve();
          }
          
        });
      });

      if (data !== null) {
        req.write(data);
      }

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  }

  get_content() {
    let content = this.__response.content;

    const content_encoding = this.__response.headers['content-encoding'] || '';
    const content_type = this.__response.headers['content-type'];

    try {
      content = this.__content_encodings[content_encoding](content);
    } catch (error) {
      // Ignore any decoding errors and return the raw content.
    }

    if (content_type.includes('application/json')) {
      return JSON.parse(content);
    }

    return content;
  }

  get_cookies() {
    return this.__response.cookies;
  }

  get_headers() {
    return this.__response.headers;
  }

  get_status_code() {
    return this.__response.status_code;
  }
}

module.exports = APIRequest;
