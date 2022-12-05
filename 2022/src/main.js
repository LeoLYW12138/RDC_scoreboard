import "../style.css";
import "virtual:windi.css";
import { startTimer, stopTimer, resetTimer } from "./timer";

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

const WINNING_COMB = ["123", "456", "789", "147", "258", "369", "159", "357"];

const btn_start = document.querySelector("#start");
const btn_stop = document.querySelector("#stop");
const btn_reset = document.querySelector("#reset");
const btn_save = document.querySelector("#save");
const btn_load = document.querySelector("#load");
const btn_final = document.querySelector("#cal-final-score");
const selects = document.querySelectorAll(".team-name");
const counters = document.querySelectorAll(".counter");
const bases = {
  red: document.querySelector("#red-base"),
  blue: document.querySelector("#blue-base"),
};
const grid = document.querySelector("#grid");

const score_boards = {
  red: document.querySelector("#red-scoreboard"),
  blue: document.querySelector("#blue-scoreboard"),
  redBig: document.querySelector("#red-score"),
  blueBig: document.querySelector("#blue-score"),
};

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
    // const score = evalResult(counter_states);
    const team = counter.id.split("-").slice(0, 1);
    // const record = new Record(timer.getTime(), counter.id, score[team], action);
    // score_boards[team].prepend(record.toHTML());
    // score_boards[team + "Big"].innerText = score[team].score;

    // records[team].push(record.toObj());
  });
});

Object.values(bases).forEach((base) => {
  base.addEventListener("click", (e) => {
    e.currentTarget.textContent = "✓";
  });
  base.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.currentTarget.textContent = "";
  });
});

Array.from(grid.children).forEach((child) => {
  child.addEventListener("click", (e) => {
    e.target.classList.remove("bg-[#545454]", "bg-blue-700");
    e.target.classList.add("bg-red-700");
    e.target.dataset.color = "red";
  });
  child.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.target.classList.remove("bg-[#545454]", "bg-red-700");
    e.target.classList.add("bg-blue-700");
    e.target.dataset.color = "blue";
  });
});

grid.addEventListener("mousedown", (e) => {
  setTimeout(() => {
    const cells = Array.from(grid.children).filter((el) => el.dataset.color);
    const reds = cells.filter((cell) => cell.dataset.color === "red");
    const blues = cells.filter((cell) => cell.dataset.color === "blue");

    const red_ids = reds.map((red) => red.id);
    const blue_ids = blues.map((blue) => blue.id);

    WINNING_COMB.forEach((winComb) => {
      const line = grid.querySelector(`[data-comb='${winComb}']`);
      if (
        red_ids.includes(winComb[0]) &&
        red_ids.includes(winComb[1]) &&
        red_ids.includes(winComb[2])
      ) {
        line || drawWinningLine(winComb, "red");
      } else {
        line?.dataset.color === "red" && grid.removeChild(line);
      }
      if (
        blue_ids.includes(winComb[0]) &&
        blue_ids.includes(winComb[1]) &&
        blue_ids.includes(winComb[2])
      ) {
        line || drawWinningLine(winComb, "blue");
      } else {
        line?.dataset.color === "blue" && grid.removeChild(line);
      }
    });
  }, 100);
});

function drawWinningLine(comb, color) {
  const line = document.createElement("div");
  line.className =
    "bg-[#FFDF00BC] pointer-events-none rounded-full h-[5%] absolute transform -translate-x-1/2 -translate-y-1/2";
  line.dataset.comb = comb;
  line.dataset.color = color;
  switch (comb) {
    case "123":
      line.classList.add("w-[80%]", "top-1/6", "left-1/2");
      break;
    case "456":
      line.classList.add("w-[80%]", "top-1/2", "left-1/2");
      break;
    case "789":
      line.classList.add("w-[80%]", "top-5/6", "left-1/2");
      break;
    case "147":
      line.classList.add("w-[80%]", "top-1/2", "left-1/6", "rotate-90");
      break;
    case "258":
      line.classList.add("w-[80%]", "top-1/2", "left-1/2", "rotate-90");
      break;
    case "369":
      line.classList.add("w-[80%]", "top-1/2", "left-5/6", "rotate-90");
      break;
    case "159":
      line.classList.add("w-[90%]", "top-1/2", "left-1/2", "rotate-45");
      break;
    case "357":
      line.classList.add("w-[90%]", "top-1/2", "left-1/2", "-rotate-45");
      break;
    default:
  }
  grid.appendChild(line);
}
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

btn_start.addEventListener("click", () => {
  btn_start.disabled = true;
  btn_stop.classList.remove("hidden");
  btn_reset.classList.add("hidden");

  startTimer();
});

btn_stop.addEventListener("click", () => {
  btn_stop.classList.add("hidden");
  btn_reset.classList.remove("hidden");

  stopTimer();
});

btn_reset.addEventListener("click", () => {
  btn_start.disabled = false;
  resetTimer();
  resetAll();
});

function resetAll() {
  counters.forEach((counter) => {
    counter_states[counter.id] = 0;
    counter.innerText = counter_states[counter.id];
  });

  Object.values(bases).forEach((base) => {
    base.textContent = "";
  });

  Array.from(grid.children).forEach((child) => {
    child.classList.remove("bg-red-700", "bg-blue-700");
    child.classList.add("bg-[#545454]");
    delete child.dataset.color;
  });

  grid.querySelectorAll("div").forEach((line) => grid.removeChild(line));

  // score_boards.red.innerHTML = "";
  // score_boards.blue.innerHTML = "";
  // score_boards.redBig.innerText = "0";
  // score_boards.blueBig.innerText = "0";
}

// btn_save.addEventListener("click", () => {
//   const final = evalResult(counter_states, true);
//   saveResult(
//     { red: selects[1].value, blue: selects[0].value },
//     {
//       red: {
//         final: final.red.score,
//         greatVictory: final.red.gv,
//         win: final.red.win,
//       },
//       blue: {
//         final: final.blue.score,
//         greatVictory: final.blue.gv,
//         win: final.blue.win,
//       },
//     },
//     records
//   );
// });

// btn_final.addEventListener("click", () => {
//   const final = evalResult(counter_states, true);
//   score_boards.blueBig.innerText = +final.blue.score.toFixed(1);
//   score_boards.redBig.innerText = +final.red.score.toFixed(1);
// });

// btn_load.addEventListener("click", () => {
//   document.querySelector(".drop-area").classList.toggle("hidden");
// });

// document.addEventListener("greatVictory", (e) => {
//   if (!gv) {
//     stopTimer();
//     btn_stop.click();

//     const div = document.createElement("div");
//     div.classList.add("great-victory");
//     const h1 = document.createElement("h1");
//     h1.innerText = "Great Victory";
//     h1.classList.add("text-size-3xl", "font-bold");
//     div.appendChild(h1);

//     const board = score_boards[e.detail.team + "Big"];
//     board.parentNode.insertBefore(div, board.nextSibling);
//     gv = div;
//   }
// });