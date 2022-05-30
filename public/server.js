const express = require('express');
const path = require('path');
// const data = require('../db.json')
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer();
const cors = require('cors')
const fs = require('fs')

const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

const app = express();
const port = process.env.PORT || 3000;

// sendFile will go here
app.use(express.static(path.join(__dirname, '..', "/build/"))); //here is important thing - no static directory, because all static :)

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '..', "/build/index.html"));
});

console.log(path.join(__dirname, '..', "/build/index.html"));
app.listen(port);
console.log('Server started at http://localhost:' + port);

const api = express();
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());
api.use(upload.array());
api.use(express.static('public'));
api.use(cors(corsOptions))


api.post('/products', (req, res) => {
    console.log(req.body)
    fs.writeFileSync('../db.json', JSON.stringify(req.body), err => {
        if (err) {
            console.error(err)
            return
        }
    })
    fs.writeFileSync('../src/components/db.json', JSON.stringify(req.body), err => {
        if (err) {
            console.error(err)
            return
        }
    })
    res.send('received your request');
})

api.listen(3001, () => console.log("api is listening on port 3001"))