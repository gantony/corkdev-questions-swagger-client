/*
    This is the actual DOM listener that's used in our application.

    Whenever the questions change, the full list of questions is cleared and
    the updated questions are added back to the DOM.
*/
function DOMListener() {
    this.container = null;
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
        this.addQuestionToDOM(question);
    }, this);
}

/*
    Adds a question to the DOM.

    Note that the upvote button is setup with an onclidk handler to call
    myApp.upvoteQuestion() with the correct question id.

    While this is not great for larger apps, it keeps things simple in this case...
*/
DOMListener.prototype.addQuestionToDOM = function(question) {
    var div = document.createElement('div');
    div.className = "question-container";
    div.innerHTML =
        '<div class="question-votes-container">' +
            '<button onclick="myApp.upvoteQuestion(' + question.id + ')">+</button>' +
            '<div>' + question.votes + '</div>' +
        '</div>' +
        '<div class="vertical-certer">'+ question.question + '</div>';

    this.container.appendChild(div);

    this.container.appendChild(document.createElement('br'));
}


var exports = module.exports = DOMListener;
