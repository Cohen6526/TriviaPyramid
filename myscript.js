

let dictUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/"
//let apiUrl = "https://opentdb.com/api.php?amount=20&type=multiple";
let apiUrl = 'responses.json';
let question = 0;
let data = "";
let firstOption = "";
let secondOption = "";
let rand = 0;
let genre = "";
let difficulty = "";
let wrongAnswer = new Audio("sfx/extremely-loud-incorrect-buzzer.mp3")
let rightAnswer = new Audio("sfx/extremely-loud-correct-buzzer.mp3")
let imageresponse = "";
let imagedata = "";
let query = 'Horse';
let prev = 21;

function genreSet(value){
    genre = "&category=" + value;
    document.getElementById(prev).style.backgroundColor = "rgb(219, 179, 103)";
    document.getElementById(value).style.backgroundColor = "rgb(88, 70, 36)";
    prev = value;
}
function difficultyTweak(valuer){
    difficulty = "&difficulty=" + valuer;
    if(valuer == 'easy'){
        document.getElementById("easy").style.backgroundColor = "rgb(88, 70, 36)";
        document.getElementById("medium").style.backgroundColor = "rgb(219, 179, 103)";
        document.getElementById("hard").style.backgroundColor = "rgb(219, 179, 103)";
    }
    if(valuer == 'medium'){
        document.getElementById("easy").style.backgroundColor = "rgb(219, 179, 103)";
        document.getElementById("medium").style.backgroundColor = "rgb(88, 70, 36)";
        document.getElementById("hard").style.backgroundColor = "rgb(219, 179, 103)";
    }
    if(valuer == 'hard'){
        document.getElementById("easy").style.backgroundColor = "rgb(219, 179, 103)";
        document.getElementById("medium").style.backgroundColor = "rgb(219, 179, 103)";
        document.getElementById("hard").style.backgroundColor = "rgb(88, 70, 36)";
    }
}


window.onload = function() {
    firstOption = document.getElementById("question1");
    secondOption = document.getElementById("question2");
    firstbox = document.getElementById("box1");
    secondbox = document.getElementById("box2");
    console.log("All images from Pexels, please don't sue me");
}

async function fetchQuestions() {
    document.getElementById("startbutton").style.display = "none";
    document.getElementById("settingsbutton").style.display = "none";
    document.getElementById("settingsmenu").style.display = "none";
    document.getElementById("title").style.display = "none";
    document.getElementById("installButton").style.display = "none";
    document.getElementById("img1").style.display = "inline-block";
    document.getElementById("img2").style.display = "inline-block";
    document.getElementById("box1").style.display = "block";
    document.getElementById("box2").style.display = "block";
    firstOption.style.display = "block";
    secondOption.style.display = "block";
    question = 0;

    try{
        const response = await fetch(apiUrl + genre + difficulty);
        data = await response.json();
        console.log(data);     
         
    }catch(error){
        console.error("Error fetching questions", error);
    }
    level();
}

async function fetchimage(query, image){
    try{
    imageresponse = await fetch("https://api.pexels.com/v1/search?query=" + query, {headers: {Authorization: "DH45HmxriNpi3ljbyvEMdvo2vnFOY4El5ZMhLuLkTF8tap4HUzkEtlLu"}}) //code from Habil on medium https://medium.com/star-gazers/how-to-work-pexels-api-with-javascript-9cda16bbece9
    imagedata = await imageresponse.json();
    }catch(error){
        console.error("Error fetching image", error);
    };
    if(image == 1){
        try{
        document.getElementById("img1").src = imagedata.photos[0].src.medium;
        document.getElementById("img1").alt = imagedata.photos[0].alt;
        console.log(imagedata);
        }catch(error){
            console.log("failed to fetch image, defaulting to apple")
            document.getElementById("img1").src = "apple.png";
        }
        
    }else{
        try{
        document.getElementById("img2").src = imagedata.photos[0].src.medium;
        document.getElementById("img2").alt = imagedata.photos[0].alt;
        console.log(imagedata);
        }catch(error){
        console.log("failed to fetch image, defaulting to apple")
        document.getElementById("img2").src = "apple.png";
        }
    }
}
let keywords = " ";
let questionarray = "";
let bannedwords = ["what", "What", "who", "Who", "when", "When", "why", "Why", "where", "Where", "is", "Is", "was", "Was", "in", "In", "and", "And", "which", "Which", "the", "The", "of", "Of", "to", "To", "as", "As", "does", "Does", "how", "How", "made", "Made", "want", "Want", "for", "For", "core", "Core"]

async function calcWords(whichst){
    keywords = "";
    if(whichst == 1){
        questionarray = data.results[question].question.split(' ');
    }else{
        questionarray = data.results[question + 1].question.split(' ');
    }
    console.log(questionarray);
    for(let i = 0; i < questionarray.length; i++){
        if(bannedwords.includes(questionarray[i])){
            console.log(questionarray[i] + " is a banned word!!!!!!!!!!!!!!!");
        }else{
            let currentword = questionarray[i].replace("ldquo", "").replace("rdquo", "").replace("&", "").replace(";", "").replace("quot", "").replace("&", "").replace(";", "").replace("rsquo", "").replace("quot", "").replace(",", "").replace("?", "").replace("#", "").replace("%", "").replace("#", "").replace("#", "");
            try{
                dictresponse = await fetch(dictUrl + currentword);
                dictdata = await dictresponse.json();  
            }catch(error){
                console.error("error fetching word" + error);
            }
            if(dictdata.title != "No Definitions Found"){
                if(dictdata[0].meanings[0].partOfSpeech == "noun"){
                    console.log(currentword + " is a noun");
                    keywords += currentword + " ";
                }
            }else{
                console.log(currentword + " is an error, but that means it's probably a proper noun so it's ok");
                    keywords += currentword + " ";
            }
        }//else
    }
    
    console.log("keywords: " + keywords);
    if(whichst == 1){
        if(keywords == ""){
            keywords = data.results[question].correct_answer;
        }
        fetchimage(keywords, 1);
        calcWords(2);
    }else{
        if(keywords == ""){
            keywords = data.results[question + 1].correct_answer;
        }
        fetchimage(keywords, 2);
        question++;
        question++;
    }
    
    
}
function level(){
    rand = Math.floor(Math.random() * 2);
    if(rand == 0){
        firstOption.innerHTML = data.results[question].question + " " + data.results[question].incorrect_answers[0] + ".";
        calcWords(1);
        firstbox.addEventListener("click", fail);
        firstOption.style.display = "block";

        secondOption.innerHTML = data.results[question + 1].question + " " + data.results[question + 1].correct_answer + ".";
        secondbox.addEventListener("click", succeed);
        secondOption.style.display = "block";
    }else{
        firstOption.innerHTML = data.results[question].question + " " + data.results[question].correct_answer + ".";
        calcWords(1);
        firstbox.addEventListener("click", succeed);
        firstOption.style.display = "block";

        secondOption.innerHTML = data.results[question + 1].question + " " + data.results[question + 1].incorrect_answers[0] + ".";
        secondbox.addEventListener("click", fail);
        secondOption.style.display = "block";
    }
    
}
function fail(){
    console.log("FAILURE! YOU ARE A FAILURE!");
    firstbox.removeEventListener("click", fail);
    secondbox.removeEventListener("click", fail);
    firstbox.removeEventListener("click", succeed);
    secondbox.removeEventListener("click", succeed);
    wrongAnswer.play();
    if(question != 20){
        level();
    }
    if(question == 20){
        firstOption.style.display = "none";
        secondOption.style.display = "none";
        document.getElementById("startbutton").style.display = "inline-block";
        document.getElementById("settingsbutton").style.display = "inline-block";
        document.getElementById("title").style.display = "block";
        document.getElementById("img1").style.display = "none";
        document.getElementById("img2").style.display = "none";
        document.getElementById("box1").style.display = "none";
        document.getElementById("box2").style.display = "none";
    }
}

function succeed(){
    console.log("good job!");
    firstbox.removeEventListener("click", succeed);
    secondbox.removeEventListener("click", succeed);
    firstbox.removeEventListener("click", fail);
    secondbox.removeEventListener("click", fail);
    rightAnswer.play();
    if(question != 20){
       level();
    }
    if(question == 20){
        firstOption.style.display = "none";
        secondOption.style.display = "none";
        document.getElementById("startbutton").style.display = "inline-block";
        document.getElementById("settingsbutton").style.display = "inline-block";
        document.getElementById("title").style.display = "block";
        document.getElementById("img1").style.display = "none";
        document.getElementById("img2").style.display = "none";
        document.getElementById("box1").style.display = "none";
        document.getElementById("box2").style.display = "none";
    }
}

let bool = 0;
function settingsToggle(){
    
    if(bool == 0){
    document.getElementById("settingsmenu").style.display = "block";
    bool = 1;
    }else{
        document.getElementById("settingsmenu").style.display = "none";
        bool = 0;
    }
}

// load the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('sw.js').then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
      }, function(error) {
        console.log('Service Worker registration failed:', error);
      });
    });
  }   

  // handle install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const installButton = document.getElementById('installButton');
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    installButton.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });
});   