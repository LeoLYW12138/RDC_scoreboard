import { msToString } from "./utils";
import countdownAudioURI from "../assets/countdown.mp3";
import longBeepAudioURI from "../assets/long_beeps.mp3";
import beepAudioURI from "../assets/beeps.mp3";

class Timer {
  constructor() {
    this.isRunning = false;
    this.startTime = 0;
    this.overallTime = 0;
  }

  _getTimeElapsedSinceLastStart() {
    if (!this.startTime) {
      return 0;
    }

    return Date.now() - this.startTime;
  }

  start() {
    if (this.isRunning) {
      //   return console.error("Timer is already running");
      return;
    }

    this.isRunning = true;

    this.startTime = Date.now();
  }

  stop() {
    if (!this.isRunning) {
      //   return console.error("Timer is already stopped");
      return;
    }

    this.isRunning = false;

    this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
  }

  reset() {
    this.overallTime = 0;

    if (this.isRunning) {
      this.startTime = Date.now();
      return;
    }

    this.startTime = 0;
  }

  getTime() {
    if (!this.startTime) {
      return 0;
    }

    if (this.isRunning) {
      return this.overallTime + this._getTimeElapsedSinceLastStart();
    }

    return this.overallTime;
  }
}

const down_timer = document.querySelector("#countdown-timer");
const up_timer = document.querySelector("#countup-timer");
const btn_stop = document.querySelector("#stop");

let timerId = 0;
let targetTime = 0;
let countdownPlayed = false;
const timer = new Timer();

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

const HALF_MIN = 30 * 1000;
const ONE_MIN = 1 * 60 * 1000;
const THREE_MIN = 3 * 60 * 1000;

function startTimer(_targetTime = ONE_MIN) {
  down_timer.disabled = false;
  up_timer.disabled = false;

  targetTime = _targetTime;
  timer.start();
  timerId = setInterval(updateTimer, 8);
}

function stopTimer() {
  down_timer.disabled = true;
  up_timer.disabled = true;
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
  if (targetTime === THREE_MIN && time >= THREE_MIN) {
    longBeepAudio.play();
    stopTimer();
    btn_stop.click();
    up_timer.innerText = msToString(THREE_MIN);
    down_timer.innerText = msToString(0);
    up_timer.classList.add("times-up");
    down_timer.classList.add("times-up");

    const timerEndedEvent = new CustomEvent("timerEnded", {
      detail: {
        targetTime: THREE_MIN,
      },
    });
    document.dispatchEvent(timerEndedEvent);

    return;
  } else if (targetTime == ONE_MIN && time >= ONE_MIN) {
    countdownPlayed = false;
    beepAudio.play();
    stopTimer();
    timer.reset();
    startTimer(THREE_MIN);
  } else if (targetTime === HALF_MIN && time >= HALF_MIN) {
    longBeepAudio.play();
    stopTimer();
    btn_stop.click();
    up_timer.innerText = msToString(HALF_MIN);
    down_timer.innerText = msToString(0);
    up_timer.classList.add("times-up");
    down_timer.classList.add("times-up");
  }

  up_timer.innerText = msToString(time);
  down_timer.innerText = msToString(targetTime - time);
}

function resetTimer() {
  timerId = 0;
  timer.reset();
  countdownPlayed = false;
  targetTime = ONE_MIN;

  down_timer.innerText = msToString(ONE_MIN);
  up_timer.innerText = msToString(0);
  up_timer.classList.remove("times-up");
  down_timer.classList.remove("times-up");
}

export { startTimer, stopTimer, resetTimer, Timer };
