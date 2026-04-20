const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "db.json";

// Load DB
function loadDB(){
  if(!fs.existsSync(DB_FILE)){
    fs.writeFileSync(DB_FILE, JSON.stringify({ tracks:{} }));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

// Save DB
function saveDB(data){
  fs.writeFileSync(DB_FILE, JSON.stringify(data,null,2));
}

// ▶️ PLAY COUNT
app.post("/play", (req,res)=>{
  const { track } = req.body;
  const db = loadDB();

  if(!db.tracks[track]){
    db.tracks[track] = { plays:0, likes:0, comments:[] };
  }

  db.tracks[track].plays++;
  saveDB(db);

  res.json(db.tracks[track]);
});

// ❤️ LIKE
app.post("/like", (req,res)=>{
  const { track } = req.body;
  const db = loadDB();

  db.tracks[track].likes++;
  saveDB(db);

  res.json(db.tracks[track]);
});

// 💬 COMMENT
app.post("/comment", (req,res)=>{
  const { track, text } = req.body;
  const db = loadDB();

  db.tracks[track].comments.push(text);
  saveDB(db);

  res.json(db.tracks[track]);
});

// 📊 GET STATS
app.get("/stats/:track", (req,res)=>{
  const db = loadDB();
  res.json(db.tracks[req.params.track] || {plays:0,likes:0,comments:[]});
});

app.listen(3000, ()=>console.log("🚀 CPM Server running on port 3000"));
