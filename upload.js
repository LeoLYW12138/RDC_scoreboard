const dropArea = document.querySelector(".drop-area");
const fileName = document.querySelector("#file-name");
const score_boards = {
  red: document.querySelector("#red-scoreboard"),
  blue: document.querySelector("#blue-scoreboard"),
  redBig: document.querySelector("#red-score"),
  blueBig: document.querySelector("#blue-score"),
};
const selects = document.querySelectorAll(".team-name");

const reader = new FileReader();
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(
    eventName,
    (e) => {
      e.preventDefault();
      e.stopPropagation();
    },
    false
  );
});

["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(
    eventName,
    (e) => {
      dropArea.classList.add("drop-highlight");
    },
    false
  );
});
["dragleave", "dropover"].forEach((eventName) => {
  dropArea.addEventListener(
    eventName,
    (e) => {
      dropArea.classList.remove("drop-highlight");
    },
    false
  );
});

dropArea.addEventListener(
  "drop",
  (e) => {
    const files = e.dataTransfer.files;
    handleFile(files);
  },
  false
);

window.handleFile = function (files) {
  [...files].forEach((file) => {
    fileName.innerText = file.name;
    reader.readAsText(file);
  });
};

reader.onload = (e) => {
  const result = JSON.parse(e.target.result);
  dropArea.classList.add("drop-success");
  setTimeout(() => {
    dropArea.classList.add("hidden");
    dropArea.classList.remove("drop-success");
    dropArea.classList.remove("drop-highlight");
    fileName.innerText = "";
    updateUI(result.data);
  }, 300);
};

function updateUI(data) {
  Object.entries(data).forEach(([team, details]) => {
    score_boards[team + "Big"].innerText = details.finalScore;
    if (details.greatVictory) {
      const div = document.createElement("div");
      div.classList.add("great-victory");
      const h1 = document.createElement("h1");
      h1.innerText = "Great Victory";
      h1.classList.add("text-size-3xl", "font-bold");
      div.appendChild(h1);

      const board = score_boards[team + "Big"];
      board.parentNode.insertBefore(div, board.nextSibling);
    }
    if (team + "" == "red") {
      selects[0].value = details.name;
    } else if (team + "" == "blue") {
      selects[1].value = details.name;
    }
  });
}
