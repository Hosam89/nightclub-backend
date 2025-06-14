const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/events.json");

function readEvents() {
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}

function writeEvents(events) {
  fs.writeFileSync(dataPath, JSON.stringify(events, null, 2));
}

module.exports = { readEvents, writeEvents };
