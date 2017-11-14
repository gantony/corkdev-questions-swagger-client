/*
    Test logger that logs the questions on change
*/
function ConsoleListener() {}

ConsoleListener.prototype.onQuestionsChanged = function(questions) {
    console.log("Questions changed: ", questions);
    console.log("");
    console.log("This is a success!!!");
    console.log("");
}


var exports = module.exports = ConsoleListener;
