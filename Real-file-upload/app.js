const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("./conn");
const bodyParser = require("body-parser");
const fs = require('fs');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
    db.query("SELECT * FROM file", (err, result) => {
        if (err) throw err;
        res.render("index", { image: result });
    });
});

//upload image
app.post('/upload', upload.single('image'), (req, res) => {
    const filename = req.file.filename; // contain  name of uploaded file
    db.query("INSERT INTO file (file_name) VALUES(?)", [filename], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/delete/:id', (req ,res) => {
    const id = req.params.id;
    db.query('SELECT file_name FROM file WHERE id = ?', [id], (err, rows) => {
        if (err) throw err;
        if (rows.length === 0) return res.redirect('/');
        const filename = rows[0].file_name;
        const filePath = path.join(__dirname, '/public/uploads', filename);
        fs.unlink(filePath, (err) => {
            if (err) console.log('Error');
        });

        db.query('DELETE FROM file WHERE id = ?', [id], (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    });
});

app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, '/public/uploads', req.params.filename);
    res.download(filePath);
});

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
