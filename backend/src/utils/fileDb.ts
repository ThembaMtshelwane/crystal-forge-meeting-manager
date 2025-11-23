import fs from "fs";
import path from "path";

const dbPath = path.join(__dirname, "../data/db.json");

const loadDB = () => {
  const data = fs.readFileSync(dbPath, "utf8");
  return JSON.parse(data);
};

export const saveDB = (db: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
};

const db = loadDB();
export { db };
