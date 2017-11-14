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


var exports = module.exports = Questions;
