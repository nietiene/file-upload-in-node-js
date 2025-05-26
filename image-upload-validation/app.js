const { error } = require("console");
const express = require("express");
const multer = require("multer");
const path = require("path");

const App = express();
App.set("view engine", "ejs"); 
App.use(express.static("upload")); 

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "upload");
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = function(req, file, cb) {
    const allowedType = /jpeg|jpg|png/;
    const extname = allowedType.test(path.extname(file.originalname).toLowerCase()); // checks the file content
    const mimetype = allowedType.test(file.mimetype); // tells the server what kind of image file contain

    if (mimetype && extname) {
        return cb(null, true); // allows to upload file
    } else {
        cb(null, Error("Only .jpg, .jpeg, .png images are allowed"))
    }
}

const upload = multer({
    storage: storage, // where and how to store uploaded file
    limits: {fileSize: 2 * 1024 * 1024},
    fileFilter: fileFilter
});

App.get('/', (req, res) => {
    res.render('upload', { error: null });
});

App.post('/upload', (req, res) => {
    upload.single('myfile')(req, res, function(err) {
        if (err) {
            return res.render("upload", {error: err.message});
        }
        if (!req.file) {
            return res.render('upload', { error:  "Please select a file" });
        }
        res.render("sucess", { message: req.file.filename });
    });
});

App.listen(3000, () => console.log("http://localhost:3000"));