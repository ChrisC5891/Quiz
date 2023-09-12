const questionsAPIUrl = 'https://opentdb.com/api.php?amount=10&type=multiple';
// Edit amount of questions I want to ask

let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('next-button');
const scoreElement = document.getElementById('score');

async function fetchQuestions() {
  try {
    const response = await fetch(questionsAPIUrl);
    const data = await response.json();
    questions = data.results; // The 'results' property contains an array of questions
    displayQuestion();
  } catch (error) {
    console.error('Error fetching questions from the API:', error);
  }
}

function displayQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = decodeHtml(currentQuestion.question);
  optionsElement.innerHTML = '';

  // Combine incorrect and correct answers into options array
  const options = currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer);

  // Shuffle the options so the correct answer is not always in the same position
  shuffleArray(options);

  options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = decodeHtml(option);
    button.addEventListener('click', () => checkAnswer(option));
    optionsElement.appendChild(button);
  });

  nextButton.style.display = 'none';
}

function checkAnswer(selectedOption) {
  const currentQuestion = questions[currentQuestionIndex];
  if (selectedOption === decodeHtml(currentQuestion.correct_answer)) {
    score++;
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    showScore();
  }
}

function showScore() {
  questionElement.textContent = 'Quiz completed!';
  optionsElement.innerHTML = '';
  nextButton.style.display = 'none';
  scoreElement.textContent = `Your Score: ${score}/${questions.length}`;
}

function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    showScore();
  }
});

// Call the function to fetch questions from the API when the page loads
fetchQuestions();