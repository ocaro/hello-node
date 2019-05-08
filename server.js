function sayHelloWorld() {
  return 'Hello World!';
}

function testSayHelloWorld() {
  var hello = sayHelloWorld();
  if (hello == null || hello == '') {
    console.log('Failed'.);
  } else {
    console.log('Passed.');
  }
}

var http = require('http');

var handleRequest = function(request, response) {
  console.log('Received request for URL: ' + request.url);
  response.writeHead(200);
  response.end(sayHelloWorld());
};

var www = http.createServer(handleRequest);

www.listen(8080);

