var Questions = require("./questions.js");
var Swagger = require('swagger-client');


/*
    Main application logic. The separate listener object keeps the "UI"
    separate from the core logic.
*/
function MyApp (spec, listener) {
    this.client = null;
    this.questions = new Questions(listener);

    var self = this;
    Swagger(spec)
        .then(function(client) {
            self.client = client;

            self.client.http.withCredentials = true; // this activates CORS, if necessary

            self.updateQuestions();
        }, function(error) {
            console.log("Error parsing spec: ", error);
        });
}

MyApp.prototype.updateQuestions = function() {
    var self = this;
    this.client.apis.public.listQuestions()
        .then(function(result) {
            self.questions.replace(result.obj);
        }, function(error) {
            console.log("Error listing questions: ", error);
        });
};

MyApp.prototype.addQuestion = function(questionText) {
    var questionJson = JSON.stringify({question: questionText});
    var self = this;
    this.client.apis.public.addQuestion({ question: questionJson })
        .then(function(result) {
            self.questions.add(result.obj);
        }, function (error) {
            console.log("Error adding a questions: ", error);
        });
};

MyApp.prototype.upvoteQuestion = function(questionId) {
    var self = this;
    this.client.apis.public.upvote({ id: questionId })
        .then(function(result) {
            self.questions.update(result.obj)
        }, function(error) {
            console.log("Error upvoting questions: ", error);
        });
};


var exports = module.exports = MyApp;
