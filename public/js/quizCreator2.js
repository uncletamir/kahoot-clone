var socket = io();
var questionNum = 1; //Starts at two because question 1 is already present

function updateDatabase(){
    var questions = [];
    var name = document.getElementById('name').value;
    console.log(name);
    for(var i = 1; i <= questionNum; i++){
        var id = i;
        var question = document.getElementById('q' + i).value;
        var pertanyaan = document.getElementById('p' + i).value;
        var correct = document.getElementById('correct'  + i).value;
        var pembahasan = document.getElementById('pembahasan' + i).value;

        questions.push({"id":id,"question": question,"pertanyaan": pertanyaan, "correct": correct, 'pembahasan': pembahasan})

    }

    var quiz = {id: 0, "name": name, "questions": questions,};
    socket.emit('newQuiz', quiz);
    window.history.back();
}

function addQuestion(){
    questionNum += 1;

    var questionsDiv = document.getElementById('allQuestions');

    var newQuestionDiv = document.createElement("div");
    var newGroupDiv = document.createElement("div");

    var questionLabel = document.createElement('label');
    var questionField = document.createElement('input');

    var pertanyaanLabel = document.createElement('label');
    var pertanyaanField = document.createElement('input');

    var correctLabel = document.createElement('label');
    var correctField = document.createElement('input');

    var pembahasanLabel = document.createElement('label');
    var pembahasanField = document.createElement('input');

    var removebutton = document.createElement('button');


    questionsDiv.setAttribute('class','card');
    // questionsDiv.setAttribute('id','question-field'+ String(questionNum));

    questionLabel.innerHTML = "Kata yang diacak " + String(questionNum) + ": ";
    questionLabel.setAttribute('class','col-form-label');
    questionField.setAttribute('id', 'q' + String(questionNum));
    questionField.setAttribute('type', 'text');
    questionField.setAttribute('class', 'form-control');
    questionField.setAttribute('placeholder','Kata Yang Di Acak');

    pertanyaanLabel.innerHTML = "Pertanyaan :";
    pertanyaanLabel.setAttribute('class','col-form-label');
    pertanyaanField.setAttribute('id', "p" + String(questionNum));
    pertanyaanField.setAttribute('type', 'text');
    pertanyaanField.setAttribute('class', 'form-control');
    pertanyaanField.setAttribute('placeholder','Pertanyaan');

    correctLabel.innerHTML = "Correct Answer: ";
    correctLabel.setAttribute('class','col-form-label');
    correctField.setAttribute('id', 'correct' + String(questionNum));
    correctField.setAttribute('type', 'text');
    correctField.setAttribute('class', 'form-control');
    correctField.setAttribute('placeholder','Kata Yang Benar');

    pembahasanLabel.innerHTML = "Pembahasan : ";
    pembahasanLabel.setAttribute('class','col-form-label');
    pembahasanField.setAttribute('id', 'pembahasan' + String(questionNum));
    pembahasanField.setAttribute('type', 'text');
    pembahasanField.setAttribute('class', 'form-control');
    pembahasanField.setAttribute('placeholder','Pembahasan');

    removebutton.innerHTML = "Hapus";
    removebutton.setAttribute('class','btn btn-space btn-secondary');
    removebutton.setAttribute('placeholder','Hapus');
    removebutton.setAttribute('onClick',"removechild()");

    newQuestionDiv.setAttribute('id', 'question-field');//Sets class of div
    newQuestionDiv.setAttribute('class','card-body');
    newGroupDiv.setAttribute('class', 'form-group');
    newQuestionDiv.appendChild(questionLabel);
    newQuestionDiv.appendChild(questionField);
    newGroupDiv.setAttribute('class', 'form-group');
    newQuestionDiv.appendChild(correctLabel);
    newQuestionDiv.appendChild(correctField);
    newGroupDiv.setAttribute('class', 'form-group');
    newQuestionDiv.appendChild(pertanyaanLabel);
    newQuestionDiv.appendChild(pertanyaanField);
    newGroupDiv.setAttribute('class', 'form-group');
    newQuestionDiv.appendChild(pembahasanLabel);
    newQuestionDiv.appendChild(pembahasanField);
    newQuestionDiv.appendChild(removebutton);

  /*  questionsDiv.appendChild(document.createElement('br'));//Creates a break between each question
    //Adds the question div to the screen
*/
    questionsDiv.appendChild(newQuestionDiv);

}

//Called when user wants to exit quiz creator
function cancelQuiz(){
    if (confirm("Are you sure you want to exit? All work will be DELETED!")) {
        window.location.href = "../datasoal";
    }
}

// socket.on('startGameFromCreator', function(data){
//     window.location.href = "../../host/?id=" + data;
// });

function randomColor(){

    var colors = ['#4CAF50', '#f94a1e', '#3399ff', '#ff9933'];
    var randomNum = Math.floor(Math.random() * 4);
    return colors[randomNum];
}

function setBGColor(){
    var randColor = randomColor();
    document.getElementById('question-field').style.backgroundColor = randColor;
}

function removechild(){
  var div = document.getElementById('quesion-field');
    div.parentNode.removeChild(div);
}
