
let currentQuestionIndex = 0; // Declare it as a global variable
let score = 0;
let questions = []; // Define an empty array to store questions

const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('next-button');
const scoreElement = document.getElementById('score');

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
// Update the API URL based on user selection
function buildAPIUrl() {
  const selectedCategory = categorySelect.value;
  const selectedDifficulty = difficultySelect.value;

  let apiUrl = 'https://opentdb.com/api.php?amount=10';

  // Append category and difficulty to the API URL if selected
  if (selectedCategory !== 'any') {
    apiUrl += `&category=${selectedCategory}`;
  }

  if (selectedDifficulty !== 'any') {
    apiUrl += `&difficulty=${selectedDifficulty}`;
  }

  return apiUrl;
}
// Define the showScore function
function showScore() {
  questionElement.textContent = 'Quiz completed!';
  optionsElement.innerHTML = '';
  nextButton.style.display = 'none';
  scoreElement.textContent = `Your Score: ${score}/${questions.length}`;
}
// Get reference to the "New Game" button
const newGameButton = document.getElementById('new-game-button');

// Add an event listener to the "New Game" button
newGameButton.addEventListener('click', () => {
  currentQuestionIndex = 0;
  score = 0;
  fetchQuestions(); // Fetch new questions based on user selection
  scoreElement.textContent = 'Score: 0'; // Reset the displayed score
});

// ...

// Define the checkAnswer function
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

// ...

// Event listener for the "Next Question" button
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    showScore();
  }
});
// Define the checkAnswer function
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

// ...

// Event listener for the "Next Question" button
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    showScore();
  }
});

// Get references to the category and difficulty select elements
const categorySelect = document.getElementById('category-select');
const difficultySelect = document.getElementById('difficulty-select');

// Call the function to fetch questions from the API when the page loads
let questionsAPIUrl = buildAPIUrl();
fetchQuestions();

// Update questionsAPIUrl when category or difficulty changes
categorySelect.addEventListener('change', () => {
  questionsAPIUrl = buildAPIUrl();
  currentQuestionIndex = 0;
  score = 0;
  fetchQuestions();
});

difficultySelect.addEventListener('change', () => {
  questionsAPIUrl = buildAPIUrl();
  currentQuestionIndex = 0;
  score = 0;
  fetchQuestions();
});

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

// Update the fetchQuestions function to use the dynamic URL
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