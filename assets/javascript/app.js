// create trivia questions and answers array
	// nested array - [question, correct answer]


// create game object
	// general variables
		// game phase (initial, quizzing, final)
		// qanswered boolean
		// # correct answers
		// # incorrect answers
		// # unanswered
		// timer



	// audio

	// functions
		// Function - initialize trivia game
			// reset all counters, reset game phase

		// Function - display question, options

		// function - display answer screen
			// :correct
			// :incorrect
			// :unanswered

		// function - end of game

		// Function - check guess against correct answer
			// if qanswered
				// if match, increment # correct answers
					// display correct screen with interval
				// else increment # incorrect answers
					// display incorrect screen with interval
			// else incrememnt # unanswered
					// display you didn't answer screen with interval
			// at timeout, display next question with new interval

		// Function - Decrement
			// count down timer, update screen timer

		// Function - click handler
			// check game phase
			// :initial
				// set interval
				// display question, options
				// advance game phase to quizzing
			// :quizzing
				// set interval
				// if user guesses, set qanswered true
					// check guess against correct answer
				// at timeout, check guess (qanswered would be false)
				// ad


// initialize game

// click listener