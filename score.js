const blue_board = document.querySelector("#blue-scoreboard");
const red_board = document.querySelector("#red-scoreboard");

class Record {
  static object_list = {
    "red-plate": "plate",
    "red-pot-1": "pot 1",
    "red-pot-2": "pot 2",
    "red-smartcar": "smartcar",
    "blue-plate": "plate",
    "blue-pot-1": "pot 1",
    "blue-pot-2": "pot 2",
    "blue-smartcar": "smartcar",
  };

  constructor(time, id, score) {
    this.time = time;
    this.action = object_list[id] + " +1";
    this.score = score;
    this.multi = multi;
  }

  toSpan() {
    const span = document.createElement("span");
    span.className = "record flex py-2";
    span.innerHTML = `<span>${this.time}</span><span>${this.action}</span><${this.score} (x${this.multi})</span>`;
    return span;
  }
}

function countObject(counter_states) {
  let counts = {
    red_pot: 0,
    red_plate: 0,
    red_smartcar: 0,
    blue_pot: 0,
    blue_plate: 0,
    blue_smartcar: 0,
  };
  Object.entries(counter_states).forEach(([id, count]) => {
    const [team, object, ..._] = id.split("-");
    if (team == "red") {
      switch (object) {
        case "pot":
          counts["red_pot"] += count;
          break;
        case "plate":
          counts["red_plate"] += count;
          break;
        case "smartcar":
          counts["red_smartcar"] = count;
          break;
      }
    } else if (team == "blue") {
      switch (object) {
        case "pot":
          counts["blue_pot"] += count;
          break;
        case "plate":
          counts["blue_plate"] += count;
          break;
        case "smartcar":
          counts["blue_smartcar"] = count;
          break;
      }
    }
  });
  return counts;
}

function evalScore(counter_states, final = false) {
  // expected counter_states as an associative array of (id, count)
  // 1 pot 50, 2 pots 200 "twinning"
  // 1 plate 75, 2 plate 300 "twinning"
  // 1 loop 1 %
  // final score = (pot + plate) * (1 + smartcar)
  // 2 pots + 2 plate = Great victory
  const {
    red_pot,
    red_plate,
    red_smartcar,
    blue_pot,
    blue_plate,
    blue_smartcar,
  } = countObject(counter_states);

  let red_score =
    (red_pot % 2) * 200 +
    Math.floor(red_pot / 2) * 50 +
    (red_plate % 2) * 300 +
    Math.floor(red_plate / 2) * 75;
  const red_mul = 1 + red_smartcar * 0.01;

  let blue_score =
    (blue_pot % 2) * 200 +
    Math.floor(blue_pot / 2) * 50 +
    (blue_plate % 2) * 300 +
    Math.floor(blue_plate / 2) * 75;
  const blue_mul = 1 + blue_smartcar * 0.01;

  if (final) {
    red_score *= red_mul;
    blue_score *= blue_mul;
  }

  return { red_score, red_mul, blue_score, blue_mul };
}

export { Record, evalScore };
