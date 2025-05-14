const express = require("express");
const multer = require("multer");
const path = require("path");

const App = express();
App.set("view engine", "ejs");
App.use('/uploads',express.static('uploads'));

const storage = multer.diskStorage({
    destination: function(req ,file, cb) {
       cb(null, 'uploads'); // folder to save uploads
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique name
    }
});

const uploads = multer({ storage: storage});

App.get('/', (req, res) => {
    res.render('upload');
});

App.post('/upload', uploads.single('myfile'), (req, res) => {
  if (!req.file) {
    return res.send("Please upload a file");
  }
 res.render("success", {image: req.file.filename});
});

App.listen(3000, () => console.log(`http://localhost:3000`));