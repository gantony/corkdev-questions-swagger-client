var Swagger = require('swagger-client')


console.log("Starting the test script...")


/*
    Keeps track of all the questions, notify listeners when they change 
    and make sure they remain sorted.
*/
function Questions(listener) {
    // Other "module" that's interested about questions
    this.listener = listener;

    this.questions = [];
}

Questions.prototype.replace = function(questions) {
    this.questions = questions;
    this.updateListeners();
}

Questions.prototype.add = function(newQuestion) {
    this.questions.push(newQuestion);
    this.updateListeners();
}

Questions.prototype.update = function(updatedQuestion) {
    this.questions = this.questions.map(function(q) { 
        return q.id === updatedQuestion.id ? updatedQuestion : q;
    })
    this.updateListeners();
}

Questions.prototype.updateListeners = function() {
    // First, we want to sort the questions by decreasing number of votes
    this.questions.sort(function(a, b) {
        if (a.votes > b.votes) return -1;
        if (a.votes === b.votes) return 0;
        if (a.votes < b.votes) return 1;
    })
    this.listener.onQuestionsChanged(this.questions);
}


/*
    Main application logic. The separate listener object keeps the "UI"
    separate from the core logic.
*/
function MyApp (listener) {
    this.client = null;

    
    this.questions = new Questions(listener);

    Swagger('http://127.0.0.1:4567/swagger.json')
        .then(client => {
            this.client = client;

            this.updateQuestions();
            // this.upvoteQuestion(4);
        });
}
 
MyApp.prototype.updateQuestions = function() {
    this.client.apis.public.listQuestions()
        .then((result) => { 
            this.questions.replace(result.obj);
        }, (error) => { 
            console.log("Error listing questions: ", error);
        });
};

MyApp.prototype.addQuestion = function(questionText) {
    var questionJson = JSON.stringify({question: questionText});
    this.client.apis.public.addQuestion({ question: questionJson })
        .then((result) => { 
            this.questions.add(result.obj);
        }, (error) => { 
            console.log("Error adding a questions: ", error);
        });
};

MyApp.prototype.upvoteQuestion = function(questionId) {
    this.client.apis.public.upvote({ id: questionId })
        .then((result) => {
            this.questions.update(result.obj) 
        }, (error) => { 
            console.log("Error upvoting questions: ", error);
        });
};


/*
    Test logger that logs the questions on change
*/
function ConsoleListener() {}

ConsoleListener.prototype.onQuestionsChanged = function(questions) {
    console.log("Questions changed: ", questions)
} 

var consoleListener = new ConsoleListener();
var myApp = new MyApp(consoleListener);
