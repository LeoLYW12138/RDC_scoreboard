import "./style.css";
import "virtual:windi.css";

const counters = document.querySelectorAll(".counter");
let counter_states = {};

counters.forEach((counter) => {
  counter_states[counter.id] = 0;
  counter.addEventListener("click", () => {
    counter_states[counter.id]++;
    counter.innerText = counter_states[counter.id];
  });
});

const btn_start = document.querySelector("#start");
const btn_stop = document.querySelector("#stop");
const btn_reset = document.querySelector("#reset");
const down_timer = document.querySelector("#countdown-timer");
const up_timer = document.querySelector("#countup-timer");

const THREE_MIN = 3 * 60 * 1000;
let countdown_time = 0;
let countup_time = 0;
let countdownId = 0;
let countupId = 0;

function msToString(ms) {
  const centisec = ("0" + Math.floor((ms % 1000) / 10)).slice(-2);
  const sec = ("0" + Math.floor((ms / 1000) % 60)).slice(-2);
  const min = ("0" + Math.floor(ms / 60 / 1000)).slice(-2);
  return `${min}:${sec}:${centisec}`;
}

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

  counters.forEach((counter) => {
    counter.innerText = counter_states[counter.id];
  });
}

function countdown() {
  countdown_time -= 10;
  let remaining = "";
  if (countdown_time <= 0) {
    clearInterval(countdownId);
    remaining = "00:00:00";
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
  } else {
    time = msToString(countup_time);
  }
  up_timer.innerText = time;
}

btn_start.addEventListener("click", () => {
  btn_start.disabled = true;
  btn_stop.disabled = false;
  down_timer.disabled = false;
  up_timer.disabled = false;

  countdown_time = THREE_MIN;
  countup_time = 0;
  countdownId = setInterval(countdown, 10);
  countupId = setInterval(countup, 10);
});

btn_stop.addEventListener("click", () => {
  btn_stop.disabled = true;
  down_timer.disabled = true;
  up_timer.disabled = true;

  btn_stop.classList.add("hidden");
  btn_reset.classList.remove("hidden");

  clearInterval(countdownId);
  clearInterval(countupId);
});

btn_reset.addEventListener("click", () => {
  btn_start.disabled = false;
  btn_stop.classList.remove("hidden");
  btn_reset.classList.add("hidden");

  resetAll();
});
