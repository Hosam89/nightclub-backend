import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "../data/events.json");

export function readEvents() {
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}

export function writeEvents(events) {
  fs.writeFileSync(dataPath, JSON.stringify(events, null, 2));
}
