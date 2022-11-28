var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose()

/* GET home page. */
router.get('/', function (req, res, next) {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      //Query if the table exists if not lets create it on the fly!
      db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='blog'`,
        (err, rows) => {
          if (rows.length === 1) {
            console.log("Table exists!");
            db.all(` select blog_id, blog_edit, blog_title, blog_txt, blog_time from blog`, (err, rows) => {
              console.log("returning " + rows.length + " records");
              res.render('index', { title: 'Express', data: rows });
            });
          } else {
            console.log("Creating table and inserting some sample data");
            db.exec(`create table blog (
                     blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
                     blog_title text NOT NULL,
                     blog_txt text NOT NULL,
                     blog_edit boolean not null default(0),
                     blog_time DATETIME NOT NULL DEFAULT(datetime('now')));

                      insert into blog (blog_title, blog_txt)
                      values ('First Post', 'This is a great blog'),
                             ('Second Post', 'Oh my goodness blogging is fun');`,
              () => {
                db.all(` select blog_id, blog_edit, blog_title, blog_txt, blog_time from blog`, (err, rows) => {
                  res.render('index', { title: 'Express', data: rows });
                });
              });
          }
        });
    });
});

router.post('/add', (req, res, next) => {
  console.log("Adding blog to table without sanitizing input! YOLO BABY!!");
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("inserting " + req.body.blog);
     
      //NOTE: This is dangerous! you need to sanitize input from the user
      //this is ripe for a exploit! DO NOT use this in production :)
      //Try and figure out how why this is unsafe and how to fix it.
      //HINT: the answer is in the XKCD comic on the home page little bobby tables :)
      let title = (req.body.title);
      let blog = (req.body.blog);
      db.exec(`insert into blog (blog_title, blog_txt)
                values ("${title}", "${blog}");`)
      //redirect to homepage
      res.redirect('/');
    }
  );
})

router.post('/delete', (req, res, next) => {
  console.log("You can only delete existing posts, so this should be safe enough.");
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("deleting post with blog id " + req.body.post_id);
      //NOTE: This is dangerous! you need to sanitize input from the user
      //this is ripe for a exploit! DO NOT use this in production :)
      //Try and figure out how why this is unsafe and how to fix it.
      //HINT: the answer is in the XKCD comic on the home page little bobby tables :)
      db.exec(`delete from blog where blog_id='${req.body.post_id}';`);     
      res.redirect('/');
    }
  );
})

// Open a post for editing
router.post('/edit', (req, res, next) => {
  console.log("opening stuff without checking if it is valid! SEND IT!");
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("open post " + req.body.post_id + " for editing");
      //NOTE: This is dangerous! you need to sanitize input from the user
      //this is ripe for a exploit! DO NOT use this in production :)
      //Try and figure out how why this is unsafe and how to fix it.
      //HINT: the answer is in the XKCD comic on the home page little bobby tables :)
      db.exec(`update blog set blog_edit=1 where blog_id=${req.body.post_id};`);     
      res.redirect('/');
    }
  );
})

// Cancel a post update 
router.post('/cancel', (req, res, next) => {
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("cancel updating blog " + req.body.post_id);
      //NOTE: This is dangerous! you need to sanitize input from the user
      //this is ripe for a exploit! DO NOT use this in production :)
      //Try and figure out how why this is unsafe and how to fix it.
      //HINT: the answer is in the XKCD comic on the home page little bobby tables :)
      db.exec(`update blog set blog_edit=0 where blog_id='${req.body.post_id}';`);     
      res.redirect('/');
    }
  );
})

// Update a post 
router.post('/update', (req, res, next) => {
  console.log("updating stuff without checking if it is valid! SEND IT!");
  var db = new sqlite3.Database('mydb.sqlite3',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.log("Getting error " + err);
        exit(1);
      }
      console.log("updating blog " + req.body.post_id);
      //NOTE: This is dangerous! you need to sanitize input from the user
      //this is ripe for a exploit! DO NOT use this in production :)
      //Try and figure out how why this is unsafe and how to fix it.
      //HINT: the answer is in the XKCD comic on the home page little bobby tables :)
      db.exec(`update blog set blog_title ='${req.body.edit_title}', blog_edit=0, blog_txt='${req.body.edit_text}', blog_time=datetime('now') where blog_id='${req.body.post_id}';`);     
      res.redirect('/');
    }
  );
})

module.exports = router;