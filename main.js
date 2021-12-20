import "./style.css";
import "virtual:windi.css";
import { Record, evalResult } from "./score";
import { msToString, saveResult } from "./utils";

const counters = document.querySelectorAll(".counter");
const counter_states = {};
const records = {
  red: [],
  blue: [],
};
const team_names = [
  "Alkaline Metal",
  "Now",
  "Delta Three-ta",
  "4gotton",
  "Team FIVE",
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

const THREE_MIN = 3 * 60 * 1000;
let countdown_time = 0;
let countup_time = 0;
let countdownId = 0;
let countupId = 0;
let gv = null;

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
  counter.addEventListener("click", () => {
    counter_states[counter.id]++;
    counter.innerText = counter_states[counter.id];
    const score = evalResult(counter_states);
    const team = counter.id.split("-").slice(0, 1);
    const record = new Record(countup_time, counter.id, score[team]);
    score_boards[team].prepend(record.toHTML());
    score_boards[team + "Big"].innerText = score[team].score;

    records[team].push(record.toObj());
  });
});

function resetAll() {
  countdown_time = THREE_MIN;
  countup_time = 0;
  countdownId = 0;
  countupId = 0;

  down_timer.innerText = msToString(countdown_time);
  up_timer.innerText = msToString(countup_time);

  Object.keys(counter_states).forEach((id) => {
    counter_states[id] = 0;
  });

  records.red = [];
  records.blue = [];

  counters.forEach((counter) => {
    counter.innerText = counter_states[counter.id];
  });

  score_boards.red.innerHTML = "";
  score_boards.blue.innerHTML = "";
  score_boards.redBig.innerText = "0";
  score_boards.blueBig.innerText = "0";

  if (gv) {
    gv.outerHTML = "";
    gv = null;
  }
}

function countdown() {
  countdown_time -= 10;
  let remaining = "";
  if (countdown_time <= 0) {
    clearInterval(countdownId);
    remaining = "00:00:00";
    down_timer.classList.add("times-up");
  } else {
    remaining = msToString(countdown_time);
  }
  down_timer.innerText = remaining;
}

function countup() {
  countup_time += 10;
  let time = "";
  if (countup_time >= THREE_MIN) {
    clearInterval(countupId);
    time = msToString(THREE_MIN);
    up_timer.classList.add("times-up");
  } else {
    time = msToString(countup_time);
  }
  up_timer.innerText = time;
}

btn_start.addEventListener("click", () => {
  btn_start.disabled = true;
  btn_stop.classList.remove("hidden");
  btn_reset.classList.add("hidden");
  down_timer.disabled = false;
  up_timer.disabled = false;

  countdown_time = THREE_MIN;
  countup_time = 0;
  countdownId = setInterval(countdown, 10);
  countupId = setInterval(countup, 10);
});

btn_stop.addEventListener("click", () => {
  down_timer.disabled = true;
  up_timer.disabled = true;

  btn_stop.classList.add("hidden");
  btn_reset.classList.remove("hidden");

  clearInterval(countdownId);
  clearInterval(countupId);
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

btn_final.addEventListener("click", () => {
  const final = evalResult(counter_states, true);
  score_boards.blueBig.innerText = +final.blue.score.toFixed(1);
  score_boards.redBig.innerText = +final.red.score.toFixed(1);
});

btn_load.addEventListener("click", () => {});

document.addEventListener("greatVictory", (e) => {
  if (!gv) {
    clearInterval(countdownId);
    clearInterval(countupId);
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
