import React, { useState } from 'react';


var askedQuestion;
var correctAnswer;
var incorrectAnswersTwo;
var incorrectAnswersThree;
var incorrectAnswersOne;

async function getQuizData(){
   const  results = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
   const data = await results.json()
   askedQuestion = data.results[0].question;
   correctAnswer = data.results[0].correct_answer
   incorrectAnswersOne = data.results[0].incorrect_answers[0]
   incorrectAnswersTwo = data.results[0].incorrect_answers[1]
   incorrectAnswersThree = data.results[0].incorrect_answers[2]
}


const escapeSpecial=(text)=>{
  if (text === undefined) {
    return '';
  }
  var doc = new DOMParser().parseFromString(text, "text/html");
  return doc.documentElement.textContent;
}


export default function App() { 

	const questions = [];

  var shuffle = require('shuffle-array')

    getQuizData();
    var q = {
			questionText: escapeSpecial(askedQuestion),
			answerOptions: [
				{ answerText: escapeSpecial(incorrectAnswersOne), isCorrect: false},
				{ answerText: escapeSpecial(correctAnswer), isCorrect: true},
				{ answerText: escapeSpecial(incorrectAnswersTwo), isCorrect: false},
				{ answerText: escapeSpecial(incorrectAnswersThree), isCorrect: false},
			],
		};
    shuffle(q.answerOptions);
    
    questions.push(q);

	// changes the current question for the use state so if 0 = first question, 1 = second question

	const [currQuestion, setCurrQuestion] = useState(0);

	const [showScore, setShowScore] = useState(false);

  const [showIntro, setShowIntro] = useState(true);

	const [score, setScore] = useState(0)
	// reset score button
	const resetButton =()=> {
		setScore(0);
		setCurrQuestion(0);
		setShowScore(false);
    setShowIntro(true);
		}

	//const [displayScore]
	// change the current question increase by one each time question clicked
	const nextQuestionButtonClick = (isCorrect) => {
		if(isCorrect === true){
			setScore(score + 1);
		}
	// when function is called/click create next question and it's going to increase the question number
	const nextQuestion = currQuestion + 1;  
	// update the next question loop makes a fail safe so user doesn't throw error once question limit is reached
		if(nextQuestion < 10){
			setCurrQuestion(nextQuestion)
		} else {
			// show score html at end of quiz
			setShowScore(true)
		}
	}

  const introStartButtonClick = () => {
    setShowIntro(false);
  }

		return (
			<div className='app'>
        {showIntro ? (
          <div className='intro'>
            <h1>Welcome to the Quiz</h1>
            <button onClick={introStartButtonClick}>Start</button>
          </div>
        ) : (
				showScore ? (
					<div className='score-section'>You scored {score} out of {10}
					<div></div>
					<button onClick={resetButton}>Reset</button>
					</div>		
			) : (
				<>
					<div className='question-section'>
						<div className='question-count'>
							<span>Question {currQuestion + 1}</span>/{10}
						</div>
						<div className='question-text'>{questions[0].questionText}</div>
					</div>
					<div className='answer-section'>
						{questions[0].answerOptions.map((answerOption)=> 
						(<button onClick={()=> nextQuestionButtonClick(answerOption.isCorrect)}>{answerOption.answerText}</button>))}
					</div>
				</>
			))}
		</div>
	);
}
