function handler(event) {
    var request = event.request;
    var redirectDomain = "nickmansell.net";
    var newurl = "https://" + redirectDomain + request.uri;
    return {
          statusCode: 302,
          statusDescription: 'Found',
          headers:
              { "location": { "value": newurl } }
          };
}
