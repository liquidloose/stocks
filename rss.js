Parser = require("rss-parser");
parser = new Parser();
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./finance.db");
db.on("trace", (message) => {
  console.log("SQL: " + message);
});

db.run(
  "create table if not exists items (id text, title text, link text, pubDate text, author text, content text, contentSnippet text, isoDate text);"
);
  
function addItem(id, title, link, pubDate, author, content, contentSnippet, isoDate) {
  const sql =    "INSERT INTO items(id, title, link, pubDate, author, content, contentSnippet, isoDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
  db.run(sql, [id, title, link, pubDate, author, content, contentSnippet, isoDate], function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("Last ID: " + this.lastID);
      console.log("# of Row Changes: " + this.changes);
    }
  });
}

var test = "gme";

(async () => {
  const hourFeed = await parser.parseURL(`https://old.reddit.com/r/wallstreetbets/search/.rss?q=${test}&include_over_18=on&restrict_sr=on&t=hour&limit=1`);
  const dayFeed = await parser.parseURL(`https://old.reddit.com/r/wallstreetbets/search.rss?q=${test}&restrict_sr=on&include_over_18=on&sort=top&t=day&limit=1`);
  const monthFeed = await parser.parseURL(`https://old.reddit.com/r/wallstreetbets/search.rss?q=${test}&restrict_sr=on&include_over_18=on&sort=top&t=month&limit=1`); 
  const yearFeed = await parser.parseURL(`https://old.reddit.com/r/wallstreetbets/search.rss?q=${test}&restrict_sr=on&include_over_18=on&sort=top&t=year&limit=1`);  
  
  hourFeed.items.forEach((item) => {
    addItem(item.id, item.title, item.link, item.pubDate, item.author, item.content, item.contentSnippet, item.isoDate);
      });

  dayFeed.items.forEach((item) => {    
    addItem(item.id, item.title, item.link, item.pubDate, item.author, item.content, item.contentSnippet, item.isoDate);
     });
  
  monthFeed.items.forEach((item) => {    
    addItem(item.id, item.title, item.link, item.pubDate, item.author, item.content, item.contentSnippet, item.isoDate);
     });

  yearFeed.items.forEach((item) => {    
    addItem(item.id, item.title, item.link, item.pubDate, item.author, item.content, item.contentSnippet, item.isoDate);
     });
})();
