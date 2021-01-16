Parser = require("rss-parser");
parser = new Parser();
const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./finance.db");
db.on("trace", (message) => {
  console.log("SQL: " + message);
});

db.run(
  "create table if not exists items (id text, author text, pubDate text, password text);"
);

function addItem(id, password, author, pubDate) {
  const questionMarks = [id];
  console.log(questionMarks);
  const placeholder = questionMarks.map((data) => '(?, ?, ?, ?)').join(',');
  const sql =
    "INSERT INTO items(id, password, author, pubDate) VALUES " + placeholder;
  db.run(sql, [id, password, author, pubDate], function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("Last ID: " + this.lastID);
      console.log("# of Row Changes: " + this.changes);
    }
  });
}

(async () => {
  const newLinks = "https://reddit.com/r/wallstreetbets/new/.rss?limit=3";
  const newFeed = await parser.parseURL(newLinks);
  const rising =
    "https://old.reddit.com/r/wallstreetbets/search.rss?q=tesla&restrict_sr=on&include_over_18=on&sort=relevance&t=week&limit=30";
  let risingFeed = await parser.parseURL(rising);
  const top = "https://reddit.com/r/wallstreetbets/top/.rss?limit=3";
  const topFeed = await parser.parseURL(top);
  const hot = "https://reddit.com/r/wallstreetbets/.rss?sort=hot&limit=3";
  const hotFeed = await parser.parseURL(hot);

  const password = "i love lamp";

  risingFeed.items.forEach((item) => {
    addItem(item.id, password, item.author, item.pubDate);
  });
})();