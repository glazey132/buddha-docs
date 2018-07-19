//App and Server setup with socket.io
const express = require('express');
const app = express();
app.set('port', process.env.PORT || 3000);
const passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
const User = require('./models/models').User;
const Document = require('./models/models').Document;
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//SOCKETS
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true}).then(() => console.log('Connected to mongodb 🌟 ✨ ⚡️')).catch((err) => console.error(err));;

// const MongoStore = require('connect-mongo')(session);
// const path = require('path');

//BODYPARSER
app.use(session({
    secret: process.env.SECRET,
    // store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());

// app.use(express.static(path.join(__dirname, 'build')));
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({
    _id: id
  }, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({username: username}).populate('docsList', 'ts name').exec((err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {message: 'Incorrect username.'});
    }
    if (user.password !== password) {
      return done(null, false, {message: 'Incorrect password.'});
    }
    return done(null, user);
  });
}));

//* routes -- !Important! -- this first function sets up access control. i.e. what data types can post to your server* //
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//ROUTES
app.get('/', function(req, res) {
  res.json({success:true, message: 'Hello World!'})
});

app.post('/login', passport.authenticate('local'), (req, res) => {
	if (!req.user) {
		res.status(400).json({"success": false, "error": "Invalid username or password"});
	} else {
    console.log('req.user is ', req.user);
    console.log(req.user.username,"has logged in:",req.user._id);
    res.status(200).json({ "success": true, user: req.user });
  }
});

app.post('/register', (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  });

  newUser.save((err, result) => {
    if(err) {
      res.json({ success: false, error: err});
    } else {
      res.json({ success: true })
    }
  });
});

// app.use((req, res, next) => {
//   (req.user) ? next() : res.redirect('/');
// });

app.post('/newDoc', (req, res) => {
	console.log('req body ', req.body);
  const newDocument = new Document({
    title: req.body.name,
    author: req.body.author
  });

  newDocument.save((err, result) => {
    if(err) {
      res.json({ success: false, error: err});
    } else {
      res.json({ success: true, doc: result })
    }
  });
});

app.get('/getDocuments/:userid', (req, res) => {
  Document.find({ author: req.params.userid }, (err, result) => {
    if(err) {
      res.json({ success: false, error: err});
    } else {
      res.json({ success: true, docs: result });
    }
  });
});

app.get('/editDocument/:docid', (req, res) => {
  console.log('inside of get doc and here is doc is in param ---> (server side ) ', req.params);
  Document.findById(req.params.docid, (err, result) => {
    if(err) {
      res.json({ success: false, error: err});
    } else {
      res.json({ success: true, doc: result });
    }
  });
});

app.post('/saveDoc/', (req, res) => {
  console.log('req body in save doc is ---> ', req.body);
  console.log('should have a document in req.body above ... ');
  Document.findById(req.body.docid, (err, doc) => {
    if (err) {
      res.json({ success: false, error: err, msg: 'Could not find document with that id' });
    } else {
      doc.contentState = req.body.contentState;
      doc.save((err, result) => {
        if(err) {
          res.json({ success: false, error: err, msg: 'Error saving this document '});
        } else {
          res.json({ success: true, savedDoc: result });
        }
      })
    }
  });
});

app.post('/logout', function(req, res) {
  console.log("clicked logout");
  req.logout();
  res.json({success: true});
});

io.on('connection', function(socket) {
  console.log('Web socket connection successful');
  socket.on('join', function(id){
    if(socket.room){
      socket.leave(socket.room);
    }
    socket.room = id;
    socket.join(id, function(){
      console.log('successfully joined the room!');
    });
    console.log('room: ', socket.room);

    let room = io.sockets.adapter.rooms[id];

    if(room.length === 1){
      io.sockets.adapter.rooms[id].colors = ['red', 'blue', 'green', 'orange', 'yellow'];
    }

    socket.color = io.sockets.adapter.rooms[id].colors.pop();

    console.log('room: ', room);
  })

socket.on('leave', function(){
    console.log('leaving. color: ', socket.color);
    io.sockets.adapter.rooms[socket.room].colors.push(socket.color);
    console.log('room colors: ', io.sockets.adapter.rooms[socket.room].colors);
    socket.color = '';
    socket.leave(socket.room);
  })

  socket.on('typing', function(contentStr){
    if(!contentStr){
      console.log('nothing passed to typing.');
      return socket.emit('errorMessage', 'No content!');
    }  else if(!socket.room){
      console.log('not in a room.');
      return socket.emit('errorMessage', 'No room!');
    }  else{
      console.log('sending it back.');
      socket.to(socket.room).emit('changestate', contentStr);
    }
  })

  socket.on('selection', function(obj){
    obj["color"] = socket.color;
    socket.to(socket.room).emit('aftercolor', obj);
  })
});


server.listen(app.get('port'), function () {
  console.log('Backend server for Note Hub running on port 3000! 🌟');
});
