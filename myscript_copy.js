let apiUrl = "https://opentdb.com/api.php?amount=20&type=multiple";
let question = 0;
let data = "";
let firstOption = "";
let secondOption = "";
let rand = 0;

window.onload = function() {
    firstOption = document.getElementById("question1");
    secondOption = document.getElementById("question2");
}

async function fetchQuestions() {
    document.getElementById("startbutton").style.display = "none";

    try{
        const response = await fetch(apiUrl);
        data = await response.json();
        console.log(data);      
    }catch(error){
        console.error("Error fetching questions", error);
    }
    level();
}
function level(){
    if(rand == 0){
        firstOption.innerHTML = data.results[question].question + " " + data.results[question].incorrect_answers[0] + data.results[question].incorrect_answers[1] + data.results[question].incorrect_answers[2] + data.results[question].correct_answer;
        firstOption.addEventListener("click", fail);
        firstOption.style.display = "block";
    }
    question++;
    question++;
}
function fail(){
    console.log("FAILURE! YOU ARE A FAILURE!");
    if(question != 18){
        level();
    };
}
function succeed(){
    console.log("good job!");
    if(question != 18){
        level();
    };
}
