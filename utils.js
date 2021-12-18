function msToString(ms) {
  const centisec = ("0" + Math.floor((ms % 1000) / 10)).slice(-2);
  const sec = ("0" + Math.floor((ms / 1000) % 60)).slice(-2);
  const min = ("0" + Math.floor(ms / 60 / 1000)).slice(-2);
  return `${min}:${sec}:${centisec}`;
}

export default msToString;
