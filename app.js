const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const HttpError = require('./models/HttpError');
const connectDB = require('./config/db');
const connectSocket = require('./socket');

// @desc init app
const app = express();

// @desc middlewares config
dotenv.config();

app.use(cors());
app.use(bodyParser.json({ extended: false }));

// @desc Access api control
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'POST, GET, PUT, DELETE, PATCH'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, X-Requested-With, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, Content-Type, X-Auth-Token'
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// @desc api routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/questions', require('./routes/question'));
app.use('/api/v1/game', require('./routes/game'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/kahoot', require('./routes/kahoot'));

app.get('/', (req, res) => {
    res.send('Hello world');
});

// @desc 404 routes
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
});

// @desc errors occur
app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    return res
        .status(error.code || 500)
        .json({ message: error.message || 'Unknown Error Occur' });
});

// @desc connect to db & run server

connectDB();

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));

// connectSocket();
var http = require('http');
var socketIO = require('socket.io');

var server = http.createServer(app);
io = socketIO.listen(server);

io.set('match origin protocol', true);
io.set('origins', '*:*');

io.on('connection', function (socket) {
    socket.on('host-join', (data) => {
        socket.join(data.pin);
    });
    //Player Join Room
    socket.on('player-joined', (data) => {
        socket.join(data);
    });
    //Add player to Quiz Object
    socket.on('player-add', (data) => {
        socket
            .to(`${data.pin}`)
            .emit('room-joined', { name: data.nickName, id: socket.id });
    });

    socket.on('question-over', (data) => {
        socket.to(`${data}`).emit('question-over');
    });
    socket.on('next-question', (data) => {
        socket.to(`${data}`).emit('next-question');
        console.log('next-question');
    });
    socket.on('question-answered', (data) => {
        console.log(data.name + ' ' + data.answer + ' ' + data.pin);
        socket
            .to(data.pin)
            .emit('player-answer', { name: data.name, answer: data.answer });
    });

    socket.on('sent-info', (data) => {
        console.log('dapan dung' + data.answeredCorrect);
        io.to(data.id).emit('sent-info', {
            answeredCorrect: data.answeredCorrect,
            score: data.score,
        });
    });
    socket.on('rank', (data) => {
        console.log('rank' + data.rank);
        io.to(data.id).emit('rank', {
            rank: data.rank,
        });
    });
    return io;
});

server.listen(PORT, function () {
    console.log('Express server listening on port ', PORT);
});
