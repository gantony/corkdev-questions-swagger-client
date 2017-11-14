var MyApp = require("./my-app.js");
var DOMListener = require("./dom-listener.js");


domListener = new DOMListener();
myApp = new MyApp('swagger.json', domListener);
