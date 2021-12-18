function msToString(ms) {
  const centisec = ("0" + Math.floor((ms % 1000) / 10)).slice(-2);
  const sec = ("0" + Math.floor((ms / 1000) % 60)).slice(-2);
  const min = ("0" + Math.floor(ms / 60 / 1000)).slice(-2);
  return `${min}:${sec}:${centisec}`;
}

function saveToJSON(obj, filename) {
  var a = document.createElement("a");
  a.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(obj))
  );
  a.setAttribute("download", filename);
  a.click();
}

export { msToString, saveToJSON };
