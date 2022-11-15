import "./style.css";
import "virtual:windi.css";
import { msToString, saveResult } from "./utils";
import Timer from "./timer";
import countdownAudioURI from "./assets/countdown.mp3";
import longBeepAudioURI from "./assets/long_beeps.mp3";
import beepAudioURI from "./assets/beeps.mp3";

const counters = document.querySelectorAll(".counter");
const counter_states = {};
const records = {
  red: [],
  blue: [],
};
const team_names = [
  "Alkali Metal",
  "Now",
  "Delta Three-ta",
  "4gotton",
  "Team Fire",
  "Cancer",
  "Group 7",
  "Infinity",
  "Cloud9",
];

const btn_start = document.querySelector("#start");
const btn_stop = document.querySelector("#stop");
const btn_reset = document.querySelector("#reset");
const btn_save = document.querySelector("#save");
const btn_load = document.querySelector("#load");
const btn_final = document.querySelector("#cal-final-score");
const down_timer = document.querySelector("#countdown-timer");
const up_timer = document.querySelector("#countup-timer");
const selects = document.querySelectorAll(".team-name");

const score_boards = {
  red: document.querySelector("#red-scoreboard"),
  blue: document.querySelector("#blue-scoreboard"),
  redBig: document.querySelector("#red-score"),
  blueBig: document.querySelector("#blue-score"),
};

const countdownAudio = new Audio();
countdownAudio.src = countdownAudioURI;
countdownAudio.preload = "auto";
countdownAudio.volume = 0.5;

const longBeepAudio = new Audio();
longBeepAudio.src = longBeepAudioURI;
longBeepAudio.preload = "auto";
longBeepAudio.volume = 0.5;

const beepAudio = new Audio();
beepAudio.src = beepAudioURI;
beepAudio.preload = "auto";
beepAudio.volume = 0.5;

const ONE_MIN = 1 * 60 * 1000;
const THREE_MIN = 3 * 60 * 1000;
let timerId = 0;
let targetTime = 0;
const timer = new Timer();
let gv = null;
let countdownPlayed = false;

selects.forEach((select) => {
  team_names.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.text = name;
    select.appendChild(option);
  });
});

counters.forEach((counter) => {
  counter_states[counter.id] = 0;
  counter.addEventListener("contextmenu", (e) => e.preventDefault());
  counter.addEventListener("mousedown", (e) => {
    const action = changeCount(e, counter.id);
    counter.innerText = counter_states[counter.id];
    const score = evalResult(counter_states);
    const team = counter.id.split("-").slice(0, 1);
    const record = new Record(timer.getTime(), counter.id, score[team], action);
    // score_boards[team].prepend(record.toHTML());
    // score_boards[team + "Big"].innerText = score[team].score;

    records[team].push(record.toObj());
  });
});

function changeCount(e, id) {
  if (typeof e === "object") {
    switch (e.button) {
      case 0:
        counter_states[id]++;
        return "+1";
      case 2:
        counter_states[id]--;
        return "-1";
      default:
        // ignore middle click and others
        break;
    }
  }
}

function resetAll() {
  timerId = 0;
  timer.reset();
  countdownPlayed = false;
  targetTime = ONE_MIN;

  down_timer.innerText = msToString(ONE_MIN);
  up_timer.innerText = msToString(0);
  up_timer.classList.remove("times-up");
  down_timer.classList.remove("times-up");

  records.red = [];
  records.blue = [];

  counters.forEach((counter) => {
    counter_states[counter.id] = 0;
    counter.innerText = counter_states[counter.id];
  });

  score_boards.red.innerHTML = "";
  score_boards.blue.innerHTML = "";
  score_boards.redBig.innerText = "0";
  score_boards.blueBig.innerText = "0";

  const GV = document.querySelector(".great-victory");

  if (GV) {
    GV.outerHTML = "";
    gv = null;
  }
}

function stopTimer() {
  timer.stop();
  clearInterval(timerId);
}

function updateTimer() {
  const time = timer.getTime();
  if (time >= targetTime - 5200 && !countdownPlayed) {
    // last five seconds
    countdownPlayed = true;
    countdownAudio.play();
  }
  if (time >= THREE_MIN) {
    stopTimer();
    btn_stop.click();
    up_timer.innerText = msToString(THREE_MIN);
    down_timer.innerText = msToString(0);
    up_timer.classList.add("times-up");
    down_timer.classList.add("times-up");

    longBeepAudio.play();
    return;
  } else if (targetTime == ONE_MIN && time >= ONE_MIN) {
    countdownPlayed = false;
    beepAudio.play();
    stopTimer();
    timer.reset();
    targetTime = THREE_MIN;
    timer.start();
    timerId = setInterval(updateTimer, 8);
  }

  up_timer.innerText = msToString(time);
  down_timer.innerText = msToString(targetTime - time);
}

btn_start.addEventListener("click", () => {
  btn_start.disabled = true;
  btn_stop.classList.remove("hidden");
  btn_reset.classList.add("hidden");
  down_timer.disabled = false;
  up_timer.disabled = false;

  targetTime = ONE_MIN;
  timer.start();
  timerId = setInterval(updateTimer, 8);
});

btn_stop.addEventListener("click", () => {
  down_timer.disabled = true;
  up_timer.disabled = true;

  btn_stop.classList.add("hidden");
  btn_reset.classList.remove("hidden");

  stopTimer();
});

btn_reset.addEventListener("click", () => {
  btn_start.disabled = false;
  resetAll();
});

btn_save.addEventListener("click", () => {
  const final = evalResult(counter_states, true);
  saveResult(
    { red: selects[1].value, blue: selects[0].value },
    {
      red: {
        final: final.red.score,
        greatVictory: final.red.gv,
        win: final.red.win,
      },
      blue: {
        final: final.blue.score,
        greatVictory: final.blue.gv,
        win: final.blue.win,
      },
    },
    records
  );
});

// btn_final.addEventListener("click", () => {
//   const final = evalResult(counter_states, true);
//   score_boards.blueBig.innerText = +final.blue.score.toFixed(1);
//   score_boards.redBig.innerText = +final.red.score.toFixed(1);
// });

btn_load.addEventListener("click", () => {
  document.querySelector(".drop-area").classList.toggle("hidden");
});

document.addEventListener("greatVictory", (e) => {
  if (!gv) {
    stopTimer();
    btn_stop.click();

    const div = document.createElement("div");
    div.classList.add("great-victory");
    const h1 = document.createElement("h1");
    h1.innerText = "Great Victory";
    h1.classList.add("text-size-3xl", "font-bold");
    div.appendChild(h1);

    const board = score_boards[e.detail.team + "Big"];
    board.parentNode.insertBefore(div, board.nextSibling);
    gv = div;
  }
});
