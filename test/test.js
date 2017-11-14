var MyApp = require("../src/my-app.js");
var ConsoleListener = require("./console-listener.js");


consoleListener = new ConsoleListener();
myApp = new MyApp('http://localhost:8080/swagger.json', consoleListener);
