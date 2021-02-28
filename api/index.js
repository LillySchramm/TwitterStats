const http = require('http');
const express = require('express');
const port = 42069;

//DEFINING THE APP

const app = express();
const timelineRoute = require('./routes/timeline')
const cors = require('cors')

app.use(cors());
app.use('/timeline', timelineRoute);
module.exports = app;

const server = http.createServer(app);
server.listen(port);
