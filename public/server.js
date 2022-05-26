const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// sendFile will go here
app.use(express.static(path.join(__dirname, '..', "/build/"))); //here is important thing - no static directory, because all static :)

app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, '..', "/build/index.html"));
});
console.log(path.join(__dirname, '..', "/build/index.html"));
app.listen(port);
console.log('Server started at http://localhost:' + port);
