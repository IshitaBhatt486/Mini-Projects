const rounds = [
  { word: "accommodate", choices: ["accomodate", "accommodate", "acommodate"] },
  { word: "calendar", choices: ["calender", "calendar", "calandar"] },
  { word: "definitely", choices: ["definately", "definitely", "definatly"] },
  { word: "embarrass", choices: ["embarass", "embarrass", "embarras"] },
  { word: "necessary", choices: ["neccessary", "necessary", "necesary"] },
];

const question = document.querySelector("#question");
const options = document.querySelector("#options");
const progress = document.querySelector("#progress");
const feedback = document.querySelector("#feedback");
const next = document.querySelector("#next");
let index = 0;
let score = 0;

function showRound() {
  const round = rounds[index];
  question.textContent = "Which spelling is correct?";
  progress.textContent = `Word ${index + 1} of ${rounds.length} · Score: ${score}`;
  feedback.textContent = "";
  next.disabled = true;
  next.textContent = index === rounds.length - 1 ? "See result" : "Next word";
  options.replaceChildren(...round.choices.map((choice) => {
    const button = document.createElement("button");
    button.className = "option";
    button.type = "button";
    button.textContent = choice;
    button.addEventListener("click", () => answer(choice, button));
    return button;
  }));
}

function answer(choice, selected) {
  const correct = rounds[index].word;
  options.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
    if (button.textContent === correct) button.classList.add("correct");
  });
  if (choice === correct) {
    score += 1;
    feedback.textContent = "Correct!";
  } else {
    selected.classList.add("incorrect");
    feedback.textContent = `Not quite — the correct spelling is “${correct}”.`;
  }
  progress.textContent = `Word ${index + 1} of ${rounds.length} · Score: ${score}`;
  next.disabled = false;
}

next.addEventListener("click", () => {
  if (index >= rounds.length) {
    index = 0;
    score = 0;
    showRound();
    return;
  }
  index += 1;
  if (index < rounds.length) return showRound();
  question.textContent = `Final score: ${score}/${rounds.length}`;
  progress.textContent = score === rounds.length ? "Perfect spelling!" : "Great effort — play again to improve your score.";
  feedback.textContent = "";
  options.replaceChildren();
  next.textContent = "Play again";
  next.disabled = false;
});

showRound();
