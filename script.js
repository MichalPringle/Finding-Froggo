const storyText = document.getElementById("storyText");
const startBtn = document.getElementById("startBtn");
const nameArea = document.getElementById("nameArea");
const playerNameInput = document.getElementById("playerName");
const qaArea = document.getElementById("qaArea");
const answerInput = document.getElementById("answerInput");
const submitAnswer = document.getElementById("submitAnswer");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("scoreDisplay");
const chapterDisplay = document.getElementById("chapterDisplay");
const hintBtn = document.getElementById("hintBtn");
const skipBtn = document.getElementById("skipBtn");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const quitBtn = document.getElementById("quitBtn");  // modified restart to quit since chance rule enforces restart



hintBtn?.addEventListener("click", () => {  // Added more to user feedback 
  feedback.textContent = "Hint: Is the question asking to add, subtract, multiply, or divide? Remember you can always draw out the problem!";
});

skipBtn?.addEventListener("click", () => {
 if(skipLocked) {
  feedback.textContent = "You can't skip two questions in a row. Give it another try!";
  return;
 } 

 skipLocked = true;
 if(skipBtn) skipBtn.disabled = true; // Disable skip button until next question is answered
  chapter++;
  showNextPart();
});

saveBtn?.addEventListener("click", () => {
  localStorage.setItem("froggoSave", JSON.stringify({ playerName, score, chapter }));
  feedback.textContent = "Game saved.";
});

loadBtn?.addEventListener("click", () => {
  const raw = localStorage.getItem("froggoSave");
if (!raw) { feedback.textContent = "No save found."; return; }
  const data = JSON.parse(raw);
  playerName = data.playerName || "";
  score = data.score || 0;
  chapter = data.chapter || 0;
  scoreDisplay.textContent = `Score: ${score}`;
  chapterDisplay.textContent = `Chapter: ${Math.min(chapter + 1, story.length)} / ${story.length}`; // changed to reflect correct chapter after load
  nameArea.style.display = playerName ? "none" : "block";
  qaArea.style.display = playerName ? "block" : "none";

  skipLocked = false;
  if(skipBtn) skipBtn.disabled = false; // Enable skip button after loading

  showNextPart();
  feedback.textContent = "Game loaded.";
});

function restartGame() {   // added function to reset game state after loss of chances
  playerName = "";
  score = 0;
  chapter = 0;
  chancesLeft = 3;
  scoreDisplay.textContent = `Score: ${score}`;
  chapterDisplay.textContent = `Chapter: ${chapter + 1} / ${story.length}`;
  currentAnswer = null;
  nameArea.style.display = "none";
  qaArea.style.display = "block";
  feedback.textContent = "";
  submitAnswer.disabled = false; // re-enable submit button
  answerInput.value = ""; // clear input field
 
  skipLocked = false;
  if(skipBtn) skipBtn.disabled = false; // Enable skip button after restart
  showNextPart();
  answerInput.focus(); // focus input field for user convenience
   }

quitBtn?.addEventListener("click", () => {          // changed restart to quit button bc game restarts after loss of chances
  if (timeoutHandle) { clearTimeout(timeoutHandle); timeoutHandle = null; }
  if (!confirm("Quit the game? This will clear progress.")) return;
  localStorage.removeItem("froggoSave"); // clear saved data on quit
  playerName = "";
  score = 0;
  chapter = 0;
  playerNameInput.value = "";
  nameArea.style.display = "block";
  qaArea.style.display = "none";
  scoreDisplay.textContent = `Score: ${score}`;
  chapterDisplay.textContent = `Chapter: 0 / ${story.length}`; // reset chapter display
  storyText.textContent = "Welcome! Enter your name to begin the adventure.";
  feedback.textContent = "";
  skipLocked = false;
  if(skipBtn) skipBtn.disabled = false; // Enable skip button on quit
});

let playerName = "";
let score = 0;
let chapter = 0;
let chancesLeft = 3;        // added to enforce three chance rule 
let timeoutHandle = null;  // added to manage reset timeout
let skipLocked = false; // added to prevent consecutive skips 

// Story segments and math challenges
const story = [
  {
    text: "It is a sunny morning at Lily Pond. You hop over to visit your friend Froggo, but he is not home. He said he’d be catching flies nearby. You decide to search for him.",
    question: "You see 3 flies buzzing by, then 2 more join them. How many flies are there now?",
    answer: 5
  },
  {
    text: "You follow the buzzing sound and find some tadpoles asking for help with counting lily pads.",
    question: "There are 8 lily pads. 5 sink underwater. How many are left?",
    answer: 3
  },
  {
    text: "You hop to the next pond and meet a turtle who gives you a clue — but only if you solve his riddle.",
    question: "The turtle says: 'I have 4 legs and my friend has twice as many.' How many legs does his friend have?",
    answer: 8
  },
  {
    text: "You hear a croak in the distance! You rush toward it, crossing 3 small streams.",
    question: "If each stream is 2 meters wide, how many meters did you cross total?",
    answer: 6
  },
  
   {
    text: "A dragonfly zooms past, leaving a trail of sparkles.",
    question: "The dragonfly leaves 12 sparkles, then 4 more appear. How many sparkles are there?",
    answer: 16
  },
  {
    text: "You meet a wise old owl perched on a branch.",
    question: "The owl has 18 feathers on one wing and 17 on the other. How many feathers total?",
    answer: 35
  },
  {
    text: "A family of ducks swims by.",
    question: "There are 24 ducks in the pond. Half swim away. How many remain?",
    answer: 12
  },
  {
    text: "You hop across stepping stones, but one breaks!",
    question: "There are 10 stones. 3 break and sink. How many stones are left?",
    answer: 7
  },
  {
    text: "You successfully cross the stepping stones and have now started your journey into the woods. As you are passing a tree, a squirrel offers you an acorn if you solve his challenge.",
    question: "The squirrel has 30 acorns. He has to split them evenly between his family of five. How many acorns will each squirrel get?",
    answer: 6
  },
  {
    text: "You find a glowing mushroom patch.",
    question: "Each mushroom has 6 spots. If there are 5 mushrooms, how many spots total?",
    answer: 30
  },
  {
    text: "A butterfly flutters by with colorful wings.",
    question: "Each wing has 9 dots. How many dots are on both wings?",
    answer: 18
  },
  {
    text: "You reach a tall hill with a riddle carved into the rock.",
    question: "The rock says: Add 14 and 9. What is the answer?",
    answer: 23
  },
  {
    text: "At the top of the hill, a fox guards the path.",
    question: "The fox has 36 berries. He eats 12. How many berries remain?",
    answer: 24
  },
  {
    text: "You cross a meadow filled with flowers.",
    question: "There are 7 rows of flowers, each with 4 blossoms. How many blossoms total?",
    answer: 28
  },
  {
    text: "A hedgehog rolls by carrying apples on its back.",
    question: "The hedgehog carries 3 apples. Each apple has 2 worms inside. How many worms total?",
    answer: 6
  },
  {
    text: "You reach a sparkling stream where fish leap out of the water.",
    question: "You count 15 fish. 7 swim away downstream. How many are left?",
    answer: 8
  },
  {
    text: "A raccoon blocks the bridge with a puzzle.",
    question: "The raccoon has 4 bags. Each bag holds 5 stones. How many stones total?",
    answer: 20
  },
  {
    text: "You walk through a shady grove where owls hoot softly.",
    question: "There are 9 owls. Each owl hoots 3 times. How many hoots in total?",
    answer: 27
  },
  {
    text: "You find a hidden cave with glowing crystals.",
    question: "There are 12 crystals. Each crystal shines with 2 lights. How many lights total?",
    answer: 24
  },
  {
    text: "You hear a croak again, louder this time! You rush toward it, crossing 4 more streams.",
    question: "Each stream is 3 meters wide. How many meters did you cross?",
    answer: 12
  },
{
    text: "A deer appears, offering guidance if you solve her puzzle.",
    question: "She has 40 apples. She shares them equally among 5 friends. How many apples per friend?",
    answer: 8
  },
  {
    text: "You pass a field of grasshoppers jumping in groups.",
    question: "There are 6 groups of grasshoppers, each with 7 members. How many grasshoppers total?",
    answer: 42
  },
  {
    text: "A wise beaver shows you a dam he built.",
    question: "The dam has 25 logs. He adds 15 more. How many logs now?",
    answer: 40
  },
{
    text: "You reach a grove of singing birds.",
    question: "There are 5 birds. Each sings 4 songs. How many songs total?",
    answer: 20
  },
  {
    text: "A fox returns with another challenge.",
    question: "He has 60 berries. He divides them into groups of 10. How many groups?",
    answer: 6
  },
  {
    text: "You find a meadow where rabbits are playing.",
    question: "There are 9 rabbits. Each rabbit has 2 ears. How many ears total?",
    answer: 18
  },
  {
    text: "A wise tortoise asks one last question before letting you pass.",
    question: "He walks 5 steps, then 7 more. How many steps total?",
    answer: 12
  },
{
    text: "You finally spot Hopper trapped behind tall reeds! To free him, you must solve one last math puzzle.",
    question: "You push 13  reeds aside, then 4 more. How many reeds total did you move?",
    answer: 17
  }
];

// Start game
startBtn.addEventListener("click", () => {
  playerName = playerNameInput.value.trim();
  if (playerName === "") {
    storyText.textContent = "Please enter your name to start.";
    return;
  }
  nameArea.style.display = "none";
  qaArea.style.display = "block";
  chapter = 0;
  score = 0;
  skipLocked = false; 
  if(skipBtn) skipBtn.disabled = false; // Enable skip button at game start
  showNextPart();
});




// Display story and question
function showNextPart() {
  if (chapter >= story.length) {
    storyText.textContent = `Congratulations, ${playerName}! You found Hopper and rescued your friend! 🎉 Your final score is ${score}.`;
    qaArea.style.display = "none";
    return;
  }
  const part = story[chapter];
  storyText.textContent = part.text + " " + part.question;
  currentAnswer = part.answer;
  answerInput.value = "";
  feedback.textContent = "";
  chapterDisplay.textContent = `Chapter: ${chapter + 1} / ${story.length}`;
}

// Check answer
submitAnswer.addEventListener("click", () => {
 
 skipLocked = false;
  if(skipBtn) skipBtn.disabled = false; // Re-enable skip button after answering  

  const playerAnswer = parseInt(answerInput.value);
  if (isNaN(playerAnswer)) {
    feedback.textContent = "Please enter a number.";
    return;
  }

  if (playerAnswer === currentAnswer) {
    feedback.textContent = "✅ Great job! That’s correct!";
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
    chapter++;
    setTimeout(showNextPart, 1500);
  } else {
    chancesLeft--;   // change implemented to enforce three chance rule
    feedback.textContent = `❌ Oops! Try again.`;
    if(chancesLeft > 0) {
      feedback.textContent =
       `❌ Oops! Not quite right, ${playerName}. You have ${chancesLeft} chance(s) left.`;
    } else {
      feedback.textContent =
      `Oh no, ${playerName}! You ran out of chances. Let's try again from the beginning.`;
      submitAnswer.disabled = true; // disable submit button to prevent further input during reset delay
      answerInput.value = ""; // clear input field to avoid confusion
      timeoutHandle = setTimeout(() => { 
        restartGame();
      }, 1800);    
      
    }
  }
}); 