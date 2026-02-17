const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("start-screen");
const gameContainer = document.getElementById("game-container");

startBtn.addEventListener("click", () => {

  startScreen.style.display = "none";
  gameContainer.style.display = "block";

  if (typeof startGame === "function") {
    startGame();
  } else {
    console.error("startGame() não encontrada.");
  }

});
