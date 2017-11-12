$(document).ready(function(){

// create trivia questions and answers array
	// nested array - [question, correct answer]
	var questions = [
		// Format: Question, Correct Answer, Incorrect Answer 1, Incorrect Answer 2, Incorrect Answer 3, image
		[
			'Question Number 1?',
			'Correct Answer',
			'Incorrect Answer 1',
			'Incorrect Answer 2',
			'Incorrect Answer 3',
			'<img src="https://placehold.it/640x480" alt="placeholder" />'
		],
		[
			'Question Number 2?',
			'Correct Answer',
			'Incorrect Answer 1',
			'Incorrect Answer 2',
			'Incorrect Answer 3',
			'<img src="https://placehold.it/640x480" alt="placeholder" />'
		],
	];


	// create game object
	var game = {
		// general variables
			// game phase (initial, quizzing, final)
			// qanswered boolean
			// # correct answers
			// # incorrect answers
			// # unanswered
			// timer
		phase: 'initial',
		qanswered: false,
		numright: 0,
		numwrong: 0,
		numnoresponse: 0,
		intervalId: null,
		timer: null,
		timerDefault: 30,
		delayDefault: 5,
		currentquestion: null,
		ansright: '<i class="fa fa-check-circle fa-lg large-text" aria-hidden="true"></i><br />Correct!',
		answrong: '<i class="fa fa-times-circle fa-lg large-text" aria-hidden="true"></i><br />Incorrect!',
		ansnone: '<i class="fa fa-question-circle fa-lg large-text" aria-hidden="true"></i><br />You were stumped.',
		panelarray: ['#question-panel', '#timer-panel', '#timer', '#results-panel', '#answer-panel', '#results-text'],


		// audio

		// functions
		
		// Function - initialize trivia game
		initializeGame: function() {
				// reset all counters, reset game phase
				this.phase = 'initial';
				this.qanswered = false;
				this.numright = 0;
				this.numwrong = 0;
				this.numnoresponse = 0;
				this.timer = null;
				this.delaytimer = null;
				this.currentquestion = null;
		},

		startTimer: function(){
			console.log('Timer started');
			intervalId = setInterval(this.decrement, 1000);
		},

		stopTimer: function(){
			console.log('Timer stopped');
			clearInterval(intervalId);
			if (!game.qanswered) {
				game.checkAnswer();
			}
		},

		

		// Function - Decrement
		decrement: function(nextFunction){
			// count down timer, update screen timer
			game.timer--;
			$("#timer-numbers").text(game.timer);
			if (game.timer === 0){
				game.stopTimer();
				game.qanswered = false;
				console.log('Time expired');
				if (game.phase === 'quizzing') {
					game.numnoresponse++;
					game.displayAnswer(false,game.qanswered);
				} else if (game.phase === 'displaying') {
					// game.currentquestion++;
					game.displayQuestion(questions,game.currentquestion);
				}
      } // end if
		},

		// Function - display question, options
		startTrivia: function(){
			switch (this.phase) { // check game phase
				case 'initial': // :initial phase, display panels
					console.log('Initial Phase detected, displaying trivia panels');
					$('#intro-panel').hide();
					for (var i = 0; i < game.panelarray.length; i++) {
						$(game.panelarray[i]).fadeIn();
					}
				break;
			}
		},

		gameOver: function(){
			$('#right').html('Correct:<br />' + this.numright);
			$('#wrong').html('Incorrect:<br />' + this.numwrong);
			$('#unanswered').html('Unanswered:<br />' + this.numnoresponse);
			var finalscore = Math.round((questions.length - this.numwrong - this.numnoresponse) / questions.length * 100);
			$('#finalscore').html('Final Score:<br />' + finalscore + '%');
			for (var i = 0; i < game.panelarray.length; i++) {
				$(game.panelarray[i]).hide();
			}
			$('#description-text').html('<h2>Game Over!</h2><p>Here are your results.</p>');
			$('#start').text('Play Again');
			$('#intro-panel').fadeIn();
			this.phase = 'initial';
		},

		shuffleAnswers: function(array){
			var currentIndex = array.length, temporaryValue, randomIndex;

			while (0 !== currentIndex) {

				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;

				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}

			return array;
		},

		checkAnswer: function($objid){
			console.log('qanswered is ' + this.qanswered);
			if (this.qanswered) {
				return ($objid.data('value') === questions[this.currentquestion][1]);
			} else {
				return false;
			}
		},

		displayQuestion: function(array, index){
			console.log('array');
			console.log(array);
			console.log('index: ' + index);
			if (index < array.length) {
				$('#timer-text').text('Time Remaining');
				$('#timer-numbers').text(this.timerDefault);
				$('#results-text').fadeOut();
				this.phase = 'quizzing';
				this.timer = this.timerDefault;

				// get and display question
				$('#question').html('<h2>' + array[index][0] + '</h2>');
				// get and display image
				$('#question-image').html(array[index][5]);
				// get and randomize display of answer options
				var answers = [];
				for (var i = 1; i <= 4; i++) {
					answers[i-1] = array[index][i];
				}
				this.shuffleAnswers(answers);
				$('#options').empty();
				for (var j = 0; j < answers.length; j++) {
					// buttons += '<button class="clickable">' + answers[j] + '</button>';
					var $button = $('<button></button>', {id: 'button' + j, class: 'clickable', text: answers[j]});
					$button.data('value', answers[j]);
					$('#options').append($button);
				}
				this.startTimer();
			} else if (index >= array.length) {
				console.log('Game Over, display results');
				this.gameOver();
			}
		},

		displayAnswer: function(correct,answered){
			console.log('Displaying answer');
			console.log('Checking current question number: ' + game.currentquestion);
			if ((game.currentquestion+1) >= questions.length) {
				$('#timer-text').text('Game Over! Results In');
			} else {
				$('#timer-text').text('Next Question In');
			}
			$('#timer-numbers').text(this.delayDefault);
			this.phase = 'displaying';
			console.log('Correct: ' + correct + ' | Answered: ' + answered);
			if (answered) {
				if (correct) {
					$('#results-text').html(this.ansright);
				} else {
					$('#results-text').html(this.answrong);
				}
			} else {
				$('#results-text').html(this.ansnone);
			}
			$('#results-text').fadeIn();
			this.qanswered = false;
			this.currentquestion++;
			this.timer = this.delayDefault;
			this.startTimer();
		},

		pauseDisplay: function(){
			game.delaytimer--;
		},
			
		clickHandler: function(objid){
			// Function - click handler
			var gameobj = this;
			var $objid = $(objid);
			switch (this.phase) { // check game phase

				case 'initial': // :initial
					game.initializeGame();
					gameobj.startTrivia();
					gameobj.currentquestion = 0;
					gameobj.displayQuestion(questions,gameobj.currentquestion);
					break; // end :initial

				case 'quizzing': // :quizzing
					console.log($objid.data());
					this.stopTimer();
					// if user guesses, set qanswered true
					this.qanswered = true;
					// check guess against correct answer
					var answer = this.checkAnswer($objid);
					if (answer) {
						this.numright++;
					} else {
						this.numwrong++;
					}
					this.displayAnswer(answer,this.qanswered);
					// at timeout, check guess (qanswered would be false)
					// ad
					break; //end :quizzing
				case 'displaying': // displaying answer
					// do nothing;
					break;

				default: 
					alert('i dunno what happened'); // this should never trigger
			} // end switch
		}
	}; // end game object
	
	// click listener	
	$(document).click(function(event){
		$(event.target).closest('.clickable').each(function(){
			var objid = '#' + this.id;
			console.log(objid + ' clicked!');
			console.log(objid + ' data value: ' + $(objid).data());
			game.clickHandler(objid);
		});
	});

});