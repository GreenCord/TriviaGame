// var bgm = new Audio('./assets/audio/dotspf.ogg');
var bgm = new Audio('./assets/audio/christmas.ogg');
var playing = false;
bgm.addEventListener('ended', function(){
	this.currentTime = 0;
	this.play();
}, false);

$(document).ready(function(){
	bgm.play();

	function pauseAudio(audio){
		if (!playing) {
			audio.pause();
		} else {
			audio.play();
		}
	}
// create trivia questions and answers array
	// nested array - [question, correct answer]
	var questions = [
		// Format: 
		// 0 - Question, 
		// 1 - Correct Answer, 
		// 2 - Incorrect Answer 1,
		// 3 - Incorrect Answer 2, 
		// 4 - Incorrect Answer 3, 
		// 5 - intro image
		// 6 - correct image
		// 7 - incorrect image
		// 8 - correct text
		// 9 - incorrect text
		[
			'What is the most iconic Christmas movie?',
			'Die Hard',
			'A Christmas Story',
			'It\'s a Wonderful Life',
			'Miracle on 34th Street',
			'<img src="./assets/images/gift.jpg" alt="Answer the question to open the gift!" />',
			'<img src="./assets/images/diehard_right.gif" alt="Got invited to the Christmas party by mistake. Who knew?" />',
			'<img src="./assets/images/diehard_wrong.gif" alt="John McClane is judging you." />',
			'Yippy-ki-yay.',
			'John McClane is judging you.'
		],
		[
			'If you get a mogwai for Christmas, which of the following should you do?',
			'Let him watch TV before noon.',
			'Take him sunbathing.',
			'Give him a bath.',
			'Eat some fried chicken with him after midnight.',
			'<img src="./assets/images/gift.jpg" alt="Answer the question to open the gift!" />',
			'<img src="./assets/images/gizmo_right.gif" alt="Gizmo dances. You know all about mogwai care!" />',
			'<img src="./assets/images/gizmo_wrong.gif" alt="Gremlins everywhere. Welp, there goes the neighborhood." />',
			'Yeah! You know all about mogwai care.',
			'Welp, there goes the neighborhood.'
		],
		[
			'Which of the following is the coup de grace of all dares?',
			'Triple Dog Dare',
			'Triple Dare',
			'Double Dog Dare',
			'Double Dare',
			'<img src="./assets/images/gift.jpg" alt="Answer the question to open the gift!" />',
			'<img src="./assets/images/tripledog_right.gif" alt="Maybe you shouldn\'t have gotten that one right. Now you gotta stick your tongue to a pole." />',
			'<img src="./assets/images/tripledog_wrong.gif" alt="Ohhhhh fuuuuuudggggeeeee... you fudged that one up. Wash your mouth out with soap!" />',
			'Hmmm..maybe you shouldn\'t have gotten that one right....',
			'Ohhhhhhhh fuuuuuuudggeeeee...'
		],
		[
			'Frank Cross was the main character in this movie.',
			'Scrooged',
			'It\'s a Wonderful Life',
			'Die Hard',
			'National Lampoon\'s Christmas Vacation',
			'<img src="./assets/images/gift.jpg" alt="Answer the question to open the gift!" />',
			'<img src="./assets/images/scrooged_right.gif" alt="Yep. Frank Cross is in Scrooged. And he\'s not all that happy about it." />',
			'<img src="./assets/images/scrooged_wrong.gif" alt="How could you get that wrong? Does that suck?!" />',
			'Frank Cross is going to have a weird day.',
			'Frank Cross is judging you.'
		],
		[
			'Complete this quote: "Oh, the silent majesty of a winter\'s morn... the clean, cool chill of the holiday air...',
			'An a*****le in his bathrobe, emptying a chemical toilet into my sewer...',
			'And every time a bell rings, an angel gets his wings.',
			'Christmas was on its way. Lovely, glorious, beautiful Christmas, upon which the entire kid year revolved.',
			'Christmas isn\'t just a day, it\'s a frame of mind.',
			'<img src="./assets/images/gift.jpg" alt="Answer the question to open the gift!" />',
			'<img src="./assets/images/vaca_right.gif" alt="Merry Christmas! Shitter was full." />',
			'<img src="./assets/images/vaca_wrong.gif" alt="Clark Griswold is judging you. And has a headache." />',
			'Oh, Cousin Eddie.',
			'Clark Griswold is judging you. And has a headache.'
		]
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
		delayDefault: 10,
		currentquestion: null,
		i_ansright: '<i class="fa fa-check-circle correct" aria-hidden="true"></i>&nbsp;',
		i_answrong: '<i class="fa fa-times-circle incorrect" aria-hidden="true"></i>&nbsp;',
		ansright: '<i class="fa fa-check-circle fa-lg large-text correct" aria-hidden="true"></i><br />Correct!',
		answrong: '<i class="fa fa-times-circle fa-lg large-text incorrect" aria-hidden="true"></i><br />Incorrect!',
		ansnone: '<i class="fa fa-question-circle fa-lg large-text stumped" aria-hidden="true"></i><br />You were stumped.',
		panelarray: ['#question-panel', '#timer-panel', '#timer', '#results-panel', '#answer-panel', '#results-text'],


		// audio
		ding: new Audio("./assets/audio/ding.mp3"),
		buzz: new Audio("./assets/audio/buzz.wav"),
		stumped: new Audio("./assets/audio/stumped.wav"),
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

		playAudio: function(objid){
			objid.currentTime = 0;
			objid.play();
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
				$('#question').html('<h2>' + array[index][0] + '</h2>').fadeIn();
				// get and display image
				$('#question-image').html(array[index][5]);
				$('#question-comment').html('Pick an answer to unwrap this thoughtful gift!');
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
					$('#options').append($button).fadeIn();
				}
				this.startTimer();
			} else if (index >= array.length) {
				console.log('Game Over, display results');
				this.gameOver();
			}
		},

		revealAnswers: function($obj){
			$obj.each(function(){
				
				
				if ($(this).attr('id') != 'start'){
					console.log('! -- $this',$(this), 'this', this);
					$(this).attr('disabled','disabled');
					if($(this).data('value') === questions[game.currentquestion][1]) {
						$(this).prepend(game.i_ansright);
					} else {
						$(this).prepend(game.i_answrong);
					}
				}
				
				
			});
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
					this.playAudio(this.ding);
					$('#results-text').html(this.ansright);
					$('#question-image').html(questions[game.currentquestion][6]);
					$('#question-comment').text(questions[game.currentquestion][8]);
				} else {
					this.playAudio(this.buzz);
					$('#results-text').html(this.answrong);
					$('#question-image').html(questions[game.currentquestion][7]);
					$('#question-comment').text(questions[game.currentquestion][9]);

				}
			} else {
				this.playAudio(this.stumped);
				$('#results-text').html(this.ansnone);
			}
			$('#results-text').fadeIn();
			this.revealAnswers($('.clickable'));
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

	$('#mute').click(function(event){
		console.log('mute clicked');
		pauseAudio(bgm);
		playing = !playing;
	});

});