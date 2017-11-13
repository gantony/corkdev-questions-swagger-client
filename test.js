console.log("Before importig swagger...");

var Swagger = require('swagger-client');


console.log("Starting the test script...");


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

    var self = this;
    Swagger('swagger.json')
        .then(function(client) {
            self.client = client;

            self.client.http.withCredentials = true; // this activates CORS, if necessary

            self.updateQuestions();
            // this.upvoteQuestion(4);
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


/*
    Test logger that logs the questions on change
*/
function ConsoleListener() {}

ConsoleListener.prototype.onQuestionsChanged = function(questions) {
    console.log("Questions changed: ", questions)
} 

function DOMListener(container) {
    this.container = container;
}

DOMListener.prototype.setContainer = function(container) {
    this.container = container;
}

DOMListener.prototype.onQuestionsChanged = function(questions) {
    console.log("Questions changed: ", questions)
    // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
    }

    questions.forEach(function(question) {
        this.printQuestion(question, this.container);
    }, this);
}

DOMListener.prototype.printQuestion = function(question) {
    //var s = '<li>text</li>'; // HTML string

    var div = document.createElement('div');
    div.className = "question-container";
    div.innerHTML = 
        '<div class="question-votes-container"><button onclick="myApp.upvoteQuestion(' + question.id + ')">+</button><div>' + question.votes + '</div></div>' +
        '<div class="vertical-certer">'+ question.question + '</div>';
    
    this.container.appendChild(div);
    this.container.appendChild(document.createElement('br'));
}

consoleListener = new ConsoleListener();
domListener = new DOMListener();
myApp = new MyApp(domListener);
