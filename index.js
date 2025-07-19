const express = require('express');
const app = express();
const path = require('path');
const fs = require("fs");

// Setup EJS
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use('/stylesheet', express.static(path.join(__dirname, 'stylesheet')));
app.use('/javascript', express.static(path.join(__dirname, 'javascript')));

// Home page route
app.get('/', function (req, res) {
  fs.readdir('./files', function (err, files) {
    res.render("index", { files: files });
  });
});

// "Read More" route
app.get('/files/:filename', function (req, res) {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, filedata) {
    if (err) {
      return res.status(404).send("File not found");
    }
    res.render("show", {
      filename:req.params.filename,
      filedata:filedata,
    });
  });
});
// Edit route 
app.get('/edit/:filename', function (req, res) {
 res.render('edit', {filename: req.params.filename})
});
app.post('/edit', function (req, res) {
fs.rename(`./files/${req.body.Previous}`, `./files/${req.body.new}` ,function(err){
  res.redirect("/")
})
});

// Handle form submission
app.post('/create', function (req, res) {
  const title = req.body.title.trim();
  const details = req.body.details;

  if (!title || !details) {
    return res.send("Please enter title and details");
  }

  fs.writeFile(`./files/${title}.txt`, details, function (err) {
    if (err) return res.status(500).send("Failed to create file");
    res.redirect("/");
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
