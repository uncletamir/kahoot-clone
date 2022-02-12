//Import dependencies
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const SocketIOFile = require('socket.io-file');

//Import classes
const {LiveGames} = require('./utils/liveGames');
const {Players} = require('./utils/players');

// //multer for uploads image
// const multer = require('multer');



const publicPath = path.join(__dirname, '../public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var games = new LiveGames();
var players = new Players();

//Mongodb setup
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/";

//login section
//bodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
// view engine
app.set('views', path.join(__dirname, '../public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// static files
app.use(express.static(path.join(__dirname, './static')));

// use falsh messages
const flash = require('express-flash');
app.use(flash());

// session
const session = require('express-session');
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 600000}
}))

// use bcrypt
const bcrypt = require('bcrypt');

// require mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/kahootDB');

// create new Schema for User
var UserSchema = new mongoose.Schema({
    uname: { type: String, required: [true, 'Username is required'] },
    fname: { type: String, required: [true, 'Firstname is required'] },
    // fname: { type: String, required: [true, 'Firstname is required'],  minlength: [3, "First name needs to have more then 3 characters"] },
    // lname: { type: String, required: [true, 'Firstname is required'] },
    email: { type: String, required: true, index: { unique: true } },
    // birthday: { type: String, required: true },
    password: { type: String, format: "date" },
    confirmPassword: String
}, {timestamps: true})
// create collection
mongoose.model('User', UserSchema);
var User = mongoose.model('User');


app.get('/', function(req, res){
    res.render('login');
})

app.get('/signup', function(req, res){
    res.render('signup');
})

app.get('/public', function(req, res){
    if(req.session.userId){
        var sessionId = req.session.userId;
        User.findOne({  _id : sessionId}, function(err, specUser){
            console.log(specUser);
            if(err){
                for(var key in err){
                    res.redirect('/public');
                }
            }
            else{
                // console.log("user found:", user);
                // res.redirect(publicPath, {user: specUser});
                res.render('main', {user : specUser});
            }
        })
    }
})

// routing for register
app.post('/register', function(req, res){
  console.log(req.body.passwd);


    if(req.body.passwd == req.body.c_pw){
        bcrypt.hash(req.body.passwd, 10, function(err, hashedPassw){ //10 = hash the password with 10 values
            if(err){
                for(var key in err.errors){
                    req.flash('addNewUser', err.errors[key].message);
                    // console.log("im inside the error", err);
                }
            }
            else{ //check if email address already exist in db
                User.findOne({ email : req.body.email }, function(err, oneUser){
                    if(err){
                        for(var key in err.errors){
                            req.flash('addNewUser', err.errors[key].message);
                            // console.log("im inside the error", err);
                        }
                    res.redirect('/');
                    }
                    else{
                        if(oneUser){
                            console.log("Email already exists");
                            // alert("Email already exist");
                            res.redirect('/');
                            // alert("Email Already Exist");
                        }
                        else{ //create a new user
                            // console.log("I creat a new user now");
                            User.create({
                                uname: req.body.uname,
                                fname: req.body.fname,
                                // fname: req.body.fname,
                                // lname: req.body.lname,
                                email: req.body.email,
                                password: hashedPassw,
                                confirmPassword: req.body.c_pw,
                                // birthday: req.body.birthDate
                              },
                                 function(err, user){
                                    if(err){ //if there is an error send error message
                                        for(var key in err.errors){
                                            req.flash('addNewUser', err.errors[key].message);
                                            // console.log("im inside the error", err);
                                        }
                                    res.redirect('/');
                                    }
                                    else{ //if there is no error set the user id to session id
                                        req.session.userId = user._id;
                                        req.session.fname = user.fname;
                                        // console.log("Password is hashed: ", user.password);
                                        res.render('login');
                                    }
                            })
                        }
                    }

            })
        }
    })}
    else{
        res.redirect('/');
    }
})

// routing for login
app.post('/login', function(req, res){
    var password = '';
        // check if email exists in db
        User.findOne({ uname : req.body.uname })
        .then( user => {
            if(!user){
                // console.log("I'm not even checking if you exist :P");
                req.flash('logInUser', 'User does not exists');
                res.redirect('/');
            }
            else{
                if(user){
                    // console.log("Email exist in DB and now check the bcrypt password");
                    // console.log("Testing my sessions!!!!!!!!!!", req.session);
                    // check if saved hashed password matches insertes password in the form
                    bcrypt.compare(req.body.passwd, user.password)
                    .then( result => {
                        console.log('User Login:' + user.fname + ' ' +'id:' + user._id);
                        if(result){
                          var data ={
                            id : user._id,
                            nama : user.fname
                          };
                            req.session.userId = user._id;
                            req.session.fname = user.fname;
                            // console.log("That's the sessionID and also userID---------", user._id);
                            res.render('main',{user:data});
                        }
                        else{
                            req.flash('logInUser', 'You can not login, because your password is wrong');
                            res.redirect('/');
                        }
                    })
                }
            }
        })
})
//Logout
app.get('/logout', function(req, res, next){
  const uname = req.session.uname;
  console.log(uname + 'logout');
  req.session.uname = null;
  res.redirect('/');
})

app.get('/main', function(req, res){
    // console.log(user);
    res.render('main',);
})

//Login section

app.use(express.static(publicPath));

//Starting server on port 3000
server.listen(3000, () => {
    console.log("Server started on port 3000");
});

//When a connection to server is made from client
io.on('connection', (socket) => {

    socket.on('ping', function(){
      socket.emit('pong');
    });
    //When host connects for the first time
    socket.on('host-join', (data) =>{

        //Check to see if id passed in url corresponds to id of kahoot game in database
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("kahootDB");
            var query = { id:  parseInt(data.id)};
            dbo.collection('kahootGames').find(query).toArray(function(err, result){
                if(err) throw err;

                //Game was found with the id passed in url
                if(result[0] !== undefined){
                    var gamePin = Math.floor(Math.random()*90000) + 10000; //new pin for game

                    games.addGame(gamePin, socket.id, false, {playersAnswered: 0, questionLive: false, gameid: data.id, question: 1}); //Creates a game with pin and host id

                    var game = games.getGame(socket.id); //Gets the game data

                    socket.join(game.pin);//The host is joining a room based on the pin

                    console.log('Game Created with pin:', game.pin);
                    console.log(query);

                    //Sending game pin to host so they can display it for players to join
                    socket.emit('showGamePin', {
                        pin: game.pin
                    });
                }else{
                    socket.emit('noGameFound');
                }
                db.close();
            });
        });

    });

    //When the host connects from the game view
    socket.on('host-join-game', (data) => {
        var oldHostId = data.id;
        var game = games.getGame(oldHostId);//Gets game with old host id
        if(game){
            game.hostId = socket.id;//Changes the game host id to new host id
            socket.join(game.pin);
            var playerData = players.getPlayers(oldHostId);//Gets player in game
            for(var i = 0; i < Object.keys(players.players).length; i++){
                if(players.players[i].hostId == oldHostId){
                    players.players[i].hostId = socket.id;
                }
            }
            var gameid = game.gameData['gameid'];
            console.log(game.id);
            MongoClient.connect(url, function(err, db){
                if (err) throw err;

                var dbo = db.db('kahootDB');
                var query = { id:  parseInt(gameid)};
                dbo.collection("kahootGames").find(query).toArray(function(err, res) {
                    if (err) throw err;

                    var question = res[0].questions[0].question;
                    var pertanyaan = res[0].questions[0].pertanyaan;
                    var correctAnswer = res[0].questions[0].correct;
                    var pembahasan = res[0].questions[0].pembahasan;

                    socket.emit('gameQuestions', {
                        q1: question,
                        p1: pertanyaan,
                        correct: correctAnswer,
                        pembahasan: pembahasan,
                        playersInGame: playerData.length
                    });
                    db.close();
                });
            });


            io.to(game.pin).emit('gameStartedPlayer');
            game.gameData.questionLive = true;
        }else{
            socket.emit('noGameFound');//No game was found, redirect user
        }
    });

    //When player connects for the first time
    socket.on('player-join', (params) => {

        var gameFound = false; //If a game is found with pin provided by player

        //For each game in the Games class
        for(var i = 0; i < games.games.length; i++){
            //If the pin is equal to one of the game's pin
            if(params.pin == games.games[i].pin){

                console.log('Player connected to game');

                var hostId = games.games[i].hostId; //Get the id of host of game


                players.addPlayer(hostId, socket.id, params.name, {score: 0, answer: 0}); //add player to game

                socket.join(params.pin); //Player is joining room based on pin

                var playersInGame = players.getPlayers(hostId); //Getting all players in game

                io.to(params.pin).emit('updatePlayerLobby', playersInGame);//Sending host player data to display
                gameFound = true; //Game has been found
            }
        }

        //If the game has not been found
        if(gameFound == false){
            socket.emit('noGameFound'); //Player is sent back to 'join' page because game was not found with pin
        }


    });

    //When the player connects from game view
    socket.on('player-join-game', (data) => {
        var player = players.getPlayer(data.id);
        if(player){
            var game = games.getGame(player.hostId);
            socket.join(game.pin);
            player.playerId = socket.id;//Update player id with socket id

            var playerData = players.getPlayers(game.hostId);
            socket.emit('playerGameData', playerData);
        }else{
            socket.emit('noGameFound');//No player found
        }

    });

    //When a host or player leaves the site
    socket.on('disconnect', () => {
        var game = games.getGame(socket.id); //Finding game with socket.id
        //If a game hosted by that id is found, the socket disconnected is a host
        if(game){
            //Checking to see if host was disconnected or was sent to game view
            if(game.gameLive == false){
                games.removeGame(socket.id);//Remove the game from games class
                console.log('Game ended with pin:', game.pin);

                var playersToRemove = players.getPlayers(game.hostId); //Getting all players in the game

                //For each player in the game
                for(var i = 0; i < playersToRemove.length; i++){
                    players.removePlayer(playersToRemove[i].playerId); //Removing each player from player class
                }

                io.to(game.pin).emit('hostDisconnect'); //Send player back to 'join' screen
                socket.leave(game.pin); //Socket is leaving room
            }
        }else{
            //No game has been found, so it is a player socket that has disconnected
            var player = players.getPlayer(socket.id); //Getting player with socket.id
            //If a player has been found with that id
            if(player){
                var hostId = player.hostId;//Gets id of host of the game
                var game = games.getGame(hostId);//Gets game data with hostId
                var pin = game.pin;//Gets the pin of the game

                if(game.gameLive == false){
                    players.removePlayer(socket.id);//Removes player from players class
                    var playersInGame = players.getPlayers(hostId);//Gets remaining players in game

                    io.to(pin).emit('updatePlayerLobby', playersInGame);//Sends data to host to update screen
                    socket.leave(pin); //Player is leaving the room

                }
            }
        }

    });

    //Sets data in player class to answer from player
    socket.on('playerAnswer', function(num){
        var player = players.getPlayer(socket.id);
        var hostId = player.hostId;
        var playerNum = players.getPlayers(hostId);
        var game = games.getGame(hostId);
        if(game.gameData.questionLive == true){//if the question is still live
            player.gameData.answer = num;
            game.gameData.playersAnswered += 1;

            var gameQuestion = game.gameData.question;
            var gameid = game.gameData.gameid;

            MongoClient.connect(url, function(err, db){
                if (err) throw err;

                var dbo = db.db('kahootDB');
                var query = { id:  parseInt(gameid)};
                dbo.collection("kahootGames").find(query).toArray(function(err, res) {
                    if (err) throw err;
                    var correctAnswer = res[0].questions[gameQuestion - 1].correct;
                    //Checks player answer with correct answer
                    num = num.toUpperCase();
                    correctAnswer = correctAnswer.toUpperCase();
                    if(num == correctAnswer){
                        player.gameData.score += 100;
                        io.to(game.pin).emit('getTime', socket.id);
                        socket.emit('answerResult', true);
                    }

                    //Checks if all players answered
                    if(game.gameData.playersAnswered == playerNum.length){
                        game.gameData.questionLive = false; //Question has been ended bc players all answered under time
                        var playerData = players.getPlayers(game.hostId);
                        io.to(game.pin).emit('questionOver', playerData, correctAnswer);//Tell everyone that question is over
                    }else{
                        //update host screen of num players answered
                        io.to(game.pin).emit('updatePlayersAnswered', {
                            playersInGame: playerNum.length,
                            playersAnswered: game.gameData.playersAnswered
                        });
                    }

                    db.close();
                });
            });



        }
    });

    socket.on('getScore', function(){
        var player = players.getPlayer(socket.id);
        socket.emit('newScore', player.gameData.score);
    });

    socket.on('time', function(data){
        var time = data.time / 20;
        time = time * 100;
        var playerid = data.player;
        var player = players.getPlayer(playerid);
        player.gameData.score += time;
    });



    socket.on('timeUp', function(){
        var game = games.getGame(socket.id);
        game.gameData.questionLive = false;
        var playerData = players.getPlayers(game.hostId);

        var gameQuestion = game.gameData.question;
        var gameid = game.gameData.gameid;

            MongoClient.connect(url, function(err, db){
                if (err) throw err;

                var dbo = db.db('kahootDB');
                var query = { id:  parseInt(gameid)};
                dbo.collection("kahootGames").find(query).toArray(function(err, res) {
                    if (err) throw err;
                    var correctAnswer = res[0].questions[gameQuestion - 1].correct;
                    io.to(game.pin).emit('questionOver', playerData, correctAnswer);

                    db.close();
                });
            });
    });

    socket.on('nextQuestion', function(){
        var playerData = players.getPlayers(socket.id);
        //Reset players current answer to 0
        for(var i = 0; i < Object.keys(players.players).length; i++){
            if(players.players[i].hostId == socket.id){
                players.players[i].gameData.answer = 0;
            }
        }

        var game = games.getGame(socket.id);
        game.gameData.playersAnswered = 0;
        game.gameData.questionLive = true;
        game.gameData.question += 1;
        var gameid = game.gameData.gameid;



        MongoClient.connect(url, function(err, db){
                if (err) throw err;

                var dbo = db.db('kahootDB');
                var query = { id:  parseInt(gameid)};
                dbo.collection("kahootGames").find(query).toArray(function(err, res) {
                    if (err) throw err;

                    if(res[0].questions.length >= game.gameData.question){
                        var questionNum = game.gameData.question;
                        questionNum = questionNum - 1;
                        var question = res[0].questions[questionNum].question;
                        var pertanyaan = res[0].questions[questionNum].pertanyaan;
                        var correctAnswer = res[0].questions[questionNum].correct;
                        var pembahasan = res[0].questions[questionNum].pembahasan;

                        socket.emit('gameQuestions', {
                            q1: question,
                            p1: pertanyaan,
                            correct: correctAnswer,
                            pembahasan: pembahasan,
                            playersInGame: playerData.length

                        });
                        db.close();
                    }else{
                        var playersInGame = players.getPlayers(game.hostId);
                        var idhost = playersInGame[0].hostId;
                        var first = {name: "", score: 0};
                        var second = {name: "", score: 0};
                        var third = {name: "", score: 0};
                        var fourth = {name: "", score: 0};
                        var fifth = {name: "", score: 0};
                        console.log(playersInGame);
                        console.log(playersInGame[0].hostId);

                        //save history player acak kata
                        MongoClient.connect(url, function(err, db){
                          if (err) throw err;

                          var dbo = db.db('kahootDB');
                          var data = {idhost: idhost, history: playersInGame, timestamps: Date()};
                          dbo.collection("history_kata").insertOne(data, function(err, res){
                            if (err) throw err;
                            console.log("History acak kata berhasil ditambahkan");
                            db.close();
                          });
                        });
                        //end save history player acak kata

                        for(var i = 0; i < playersInGame.length; i++){
                            if(playersInGame[i].gameData.score > fifth.score){
                                if(playersInGame[i].gameData.score > fourth.score){
                                    if(playersInGame[i].gameData.score > third.score){
                                        if(playersInGame[i].gameData.score > second.score){
                                            if(playersInGame[i].gameData.score > first.score){
                                                //First Place
                                                fifth.name = fourth.name;
                                                fifth.score = fourth.score;

                                                fourth.name = third.name;
                                                fourth.score = third.score;

                                                third.name = second.name;
                                                third.score = second.score;

                                                second.name = first.name;
                                                second.score = first.score;

                                                first.name = playersInGame[i].name;
                                                first.score = playersInGame[i].gameData.score;

                                            }else{
                                                //Second Place
                                                fifth.name = fourth.name;
                                                fifth.score = fourth.score;

                                                fourth.name = third.name;
                                                fourth.score = third.score;

                                                third.name = second.name;
                                                third.score = second.score;

                                                second.name = playersInGame[i].name;
                                                console.log(second.name);
                                                second.score = playersInGame[i].gameData.score;
                                                console.log(second.score);
                                            }
                                        }else{
                                            //Third Place
                                            fifth.name = fourth.name;
                                            fifth.score = fourth.score;

                                            fourth.name = third.name;
                                            fourth.score = third.score;

                                            third.name = playersInGame[i].name;
                                            third.score = playersInGame[i].gameData.score;

                                        }
                                    }else{
                                        //Fourth Place
                                        fifth.name = fourth.name;
                                        fifth.score = fourth.score;

                                        fourth.name = playersInGame[i].name;
                                        fourth.score = playersInGame[i].gameData.score;

                                    }
                                }else{
                                    //Fifth Place
                                    fifth.name = playersInGame[i].name;
                                    fifth.score = playersInGame[i].gameData.score;

                                    }
                            }
                        }

                        io.to(game.pin).emit('GameOver', {

                            num1: first.name,
                            scr1: first.score,
                            num2: second.name,
                            num3: third.name,
                            num4: fourth.name,
                            num5: fifth.name


                        });

                    }

                });
            });

        io.to(game.pin).emit('nextQuestionPlayer');
    });


    //When the host starts the game
    socket.on('startGame', () => {
        var game = games.getGame(socket.id);//Get the game based on socket.id
        game.gameLive = true;
        socket.emit('gameStarted', game.hostId);//Tell player and host that game has started
    });

    //Give user game names data
    socket.on('requestDbNames', function(){

        MongoClient.connect(url, function(err, db){
            if (err) throw err;

            var dbo = db.db('kahootDB');
            dbo.collection("kahootGames").find().toArray(function(err, res) {
                if (err) throw err;
                socket.emit('gameNamesData', res);
                db.close();
            });
        });
    });

    //Give user edit pageheader
    socket.on('cariData', function(){

      MongoClient.connect(url, function(err, db){
        if (err) throw err;

        var dbo = db.db('kahootDB');
        var query = { id:  parseInt(gameid)};
        console.log(query);
        dbo.collection("kahootGames").find(query).toArray(function(err, res) {
            if (err) throw err;

            var question = res[0].questions[0].question;
            var pertanyaan = res[0].questions[0].pertanyaan;
            var correctAnswer = res[0].questions[0].correct;
            var pembahasan = res[0].questions[0].pembahasan;

            socket.emit('dataPertanyaan', res);
            console.log(query);
            db.close();
        });
      });
    });



    socket.on('newQuiz', function(data){
        MongoClient.connect(url, function(err, db){
            if (err) throw err;
            var dbo = db.db('kahootDB');
            dbo.collection('kahootGames').find({}).toArray(function(err, result){
                if(err) throw err;
                var num = Object.keys(result).length;
                if(num == 0){
                	data.id = 1
                	num = 1
                }else{
                	data.id = result[num -1 ].id + 1;
                }
                var game = data;
                dbo.collection("kahootGames").insertOne(game, function(err, res) {
                    if (err) throw err;
                    db.close();
                });
                db.close();
                socket.emit('startGameFromCreator', num);
            });
        });
    });

    // view edit modul
    socket.on('requestlistmodul', (data) =>{
      MongoClient.connect(url, function(err,db){
        if (err) throw err;
        var dbo = db.db("kahootDB");
        var query = {id: parseInt(data.id)};
        // var id = query;
        dbo.collection('kahootGames').find(query).toArray(function(err, res){
          if (err) throw err;


            socket.emit('responlistmodul', res);
            console.log(query);
            console.log(data.id);
            db.close();
        });
      });
    });
    // end view edit modul

    // view edit one question
    socket.on('requestlistsatu', (data) =>{

      MongoClient.connect(url, function(err,db){
        if (err) throw err;
        var id = data.id;
        var query = {id: parseInt(data.id)};
        var index = data.index;
        // var query = {id: parseInt(data.id)};
        var dbo = db.db("kahootDB");
        dbo.collection('kahootGames').find(query).toArray(function(err, res){
          if (err) throw err;

            var question = res[0].questions[index].question;
            var correct = res[0].questions[index].correct;
            var pertanyaan = res[0].questions[index].pertanyaan;
            var pembahasan = res[0].questions[index].pembahasan;
            var indexn = index;

            socket.emit('responlistsatu', {
              no: indexn,
              ka: question,
              kb: correct,
              per: pertanyaan,
              pemb: pembahasan
            });
            console.log(query);
            console.log(id);
            console.log(index);
            db.close();
        });
      });
    });
    // end view edit one question

    // function delete modul
    socket.on('deletemodul', function(data){
      console.log(data);


      MongoClient.connect(url, function(err,db){
        if (err) throw err;
        var dbo = db.db("kahootDB");
        var query = {id: parseInt(data)};
        dbo.collection('kahootGames').deleteOne(query, function(err,obj){
          if (err) throw err;
          console.log(obj.result.n + "Modul delete");
          db.close();
        })
      });
    });
    // end function delete modul

    // function delete one question
    socket.on('deletesatusoal', function(data){
      var res = data.split("/");
      var query = {id: parseInt(res[0])};
      var index = parseInt(res[1]);
      MongoClient.connect(url, function(err,db){
        if (err) throw err;
        var dbo = db.db("kahootDB");
        var res = data.split("/");
        var query = {id: parseInt(res[0])};
        var index = parseInt(res[1])+1;
        dbo.collection('kahootGames').update(query, {$pull: {questions: {"id":index}}}).then();
          db.close();
      });
    });
    // end function delete one question

    // function update one question
    socket.on('updateSatuSoal',function(data){
      MongoClient.connect(url, function(err,db){
        if (err) throw err;
        var dbo = db.db("kahootDB");
        var query = {id: parseInt(data.id), "questions.id": parseInt(data.index)+1};
        console.log(query);
        var newvalue = {$set:{
          "questions.$.question": data.question,
          "questions.$.correct": data.correct,
          "questions.$.pertanyaan": data.pertanyaan,
          "questions.$.pembahasan": data.pembahasan,
      }};
        console.log(query, newvalue);
        dbo.collection('kahootGames').updateOne(query, newvalue);
        console.log(data);
        db.close();
      });
    });
    // end function update one question

    // function update one question
    socket.on('tambahSatuSoal',function(data){
      console.log(data);
      MongoClient.connect(url, function(err,db){
        if (err) throw err;
        var dbo = db.db("kahootDB");
        var query = {id: parseInt(data.id)};
        var pushdata = {$push:{"questions":{
          "id": parseInt(data.index)+1,
          "question": data.question,
          "correct": data.correct,
          "pertanyaan": data.pertanyaan,
          "pembahasan": data.pembahasan,
        }}};
        dbo.collection('kahootGames').update(query,pushdata);
        db.close();
      });
    });
    // end function update one question

    //upload image function
    socket.on('uploadimage',function(data){
      console.log(data);
      MongoClient.connect(url, function(err, db){
          if (err) throw err;
          var dbo = db.db('kahootDB');
          dbo.collection('gamegambar').find({}).toArray(function(err, result){
              if(err) throw err;
              var num = Object.keys(result).length;
              if(num == 0){
                data.id = 1
                num = 1
              }else{
                data.id = result[num -1 ].id + 1;
              }
              var saveid = data.id;
              var game = data;
              dbo.collection("gamegambar").insertOne(game, function(err, res) {
                  if (err) throw err;
                  db.close();
              });
              db.close();
              console.log(saveid);
              socket.emit('resuploadgambar', saveid);
          });
      });
    });
    //end upload image function

    //Data modul soal gambar
    socket.on('requestmodulgambar', function(){

        MongoClient.connect(url, function(err, db){
            if (err) throw err;

            var dbo = db.db('kahootDB');
            dbo.collection("gamegambar").find().toArray(function(err, res) {
                if (err) throw err;
                socket.emit('responmodulgambar', res);
                db.close();
            });
        });
    });
    // Data modul soal gambar

    // view edit modul
    socket.on('requestlistmodulgambar',(data) =>{
      MongoClient.connect(url, function(err,db){
        if (err) throw err;
        var dbo = db.db("kahootDB");
        var query = {id: parseInt(data.id)};
        // var id = query;
        dbo.collection('gamegambar').find(query).toArray(function(err, res){
          if (err) throw err;


            socket.emit('responlistmodulgambar', res);
            console.log(query);
            console.log(data.id);
            db.close();
        });
      });
    });
    // end view edit modul

    socket.on('tambahSatuSoalGambar',function(data){
      console.log(data);
      MongoClient.connect(url, function(err,db){
        if (err) throw err;
        var dbo = db.db("kahootDB");
        var query = {id: parseInt(data.id)};
        var pushdata = {$push:{"questions":{
          "id": parseInt(data.index)+1,
          "question": data.question,
          "correct": data.correct,
          "pertanyaan": data.pertanyaan,
          "pembahasan": data.pembahasan,
        }}};
        dbo.collection('gamegambar').update(query,pushdata);
        db.close();
      });
    });
    // end function update one question

    // view edit one question gambar
    socket.on('requestlistsatugambar', (data) =>{

      MongoClient.connect(url, function(err,db){
        if (err) throw err;
        var id = data.id;
        var query = {id: parseInt(data.id)};
        var index = data.index;
        // var query = {id: parseInt(data.id)};
        var dbo = db.db("kahootDB");
        dbo.collection('gamegambar').find(query).toArray(function(err, res){
          if (err) throw err;

            var question = res[0].questions[index].question;
            var correct = res[0].questions[index].correct;
            var pertanyaan = res[0].questions[index].pertanyaan;
            var pembahasan = res[0].questions[index].pembahasan;
            var indexn = index;

            socket.emit('responlistsatugambar', {
              no: indexn,
              ka: question,
              kb: correct,
              per: pertanyaan,
              pemb: pembahasan
            });
            console.log(query);
            console.log(id);
            console.log(index);
            db.close();
        });
      });
    });
    // end view edit one question gambar

    // function update one question gambar
    socket.on('updateSatuSoalGambar',function(data){
      console.log(data);
      MongoClient.connect(url, function(err,db){
        if (err) throw err;
        var dbo = db.db("kahootDB");
        var query = {id: parseInt(data.id), "questions.id": parseInt(data.index)+1};
        console.log(query);
        var newvalue = {$set:{
          "questions.$.question": data.question,
          "questions.$.correct": data.correct,
          "questions.$.pertanyaan": data.pertanyaan,
          "questions.$.pembahasan": data.pembahasan,
      }};
        console.log(query, newvalue);
        dbo.collection('gamegambar').updateOne(query, newvalue);
        console.log(data);
        db.close();
      });
    });
    // end function update one question gambar

    //When host connects for the first time
    socket.on('host-join-gambar', (data) =>{

        //Check to see if id passed in url corresponds to id of kahoot game in database
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("kahootDB");
            var query = { id:  parseInt(data.id)};
            dbo.collection('gamegambar').find(query).toArray(function(err, result){
                if(err) throw err;

                //Game was found with the id passed in url
                if(result[0] !== undefined){
                    var gamePin = Math.floor(Math.random()*90000) + 10000; //new pin for game

                    games.addGame(gamePin, socket.id, false, {playersAnswered: 0, questionLive: false, gameid: data.id, question: 1}); //Creates a game with pin and host id

                    var game = games.getGame(socket.id); //Gets the game data

                    socket.join(game.pin);//The host is joining a room based on the pin

                    console.log('Game Created with pin:', game.pin);
                    console.log(query);

                    //Sending game pin to host so they can display it for players to join
                    socket.emit('showGameGambarPin', {
                        pin: game.pin
                    });
                }else{
                    socket.emit('noGameGambarFound');
                }
                db.close();
            });
        });

    });

    //Gamegambar Section
    //When the host connects from the game view
    socket.on('host-join-game-gambar', (data) => {
        var oldHostId = data.id;
        var game = games.getGame(oldHostId);//Gets game with old host id
        if(game){
            game.hostId = socket.id;//Changes the game host id to new host id
            socket.join(game.pin);
            var playerData = players.getPlayers(oldHostId);//Gets player in game
            for(var i = 0; i < Object.keys(players.players).length; i++){
                if(players.players[i].hostId == oldHostId){
                    players.players[i].hostId = socket.id;
                }
            }
            var gameid = game.gameData['gameid'];
            console.log(game.id);
            MongoClient.connect(url, function(err, db){
                if (err) throw err;

                var dbo = db.db('kahootDB');
                var query = { id:  parseInt(gameid)};
                dbo.collection("gamegambar").find(query).toArray(function(err, res) {
                    if (err) throw err;

                    var question = res[0].questions[0].question;
                    var pertanyaan = res[0].questions[0].pertanyaan;
                    var correctAnswer = res[0].questions[0].correct;
                    var pembahasan = res[0].questions[0].pembahasan;

                    socket.emit('gameQuestionsGambar', {
                        q1: question,
                        p1: pertanyaan,
                        correct: correctAnswer,
                        pembahasan: pembahasan,
                        playersInGame: playerData.length
                    });
                    db.close();
                });
            });


            io.to(game.pin).emit('gameGambarStartedPlayer');
            game.gameData.questionLive = true;
        }else{
            socket.emit('noGameGambarFound');//No game was found, redirect user
        }
    });

    //When player connects for the first time
    socket.on('player-join-gambar', (params) => {

        var gameFound = false; //If a game is found with pin provided by player

        //For each game in the Games class
        for(var i = 0; i < games.games.length; i++){
            //If the pin is equal to one of the game's pin
            if(params.pin == games.games[i].pin){

                console.log('Player connected to game');

                var hostId = games.games[i].hostId; //Get the id of host of game


                players.addPlayer(hostId, socket.id, params.name, {score: 0, answer: 0}); //add player to game

                socket.join(params.pin); //Player is joining room based on pin

                var playersInGame = players.getPlayers(hostId); //Getting all players in game

                io.to(params.pin).emit('updatePlayerLobbyGambar', playersInGame);//Sending host player data to display
                gameFound = true; //Game has been found
            }
        }

        //If the game has not been found
        if(gameFound == false){
            socket.emit('noGameGambarFound'); //Player is sent back to 'join' page because game was not found with pin
        }


    });

    //When the player connects from game view
    socket.on('player-join-game-gambar', (data) => {
        var player = players.getPlayer(data.id);
        if(player){
            var game = games.getGame(player.hostId);
            socket.join(game.pin);
            player.playerId = socket.id;//Update player id with socket id

            var playerData = players.getPlayers(game.hostId);
            socket.emit('playerGameGambarData', playerData);
        }else{
            socket.emit('noGameGambarFound');//No player found
        }

    });

    //When a host or player leaves the site
    socket.on('disconnectgambar', () => {
        var game = games.getGame(socket.id); //Finding game with socket.id
        //If a game hosted by that id is found, the socket disconnected is a host
        if(game){
            //Checking to see if host was disconnected or was sent to game view
            if(game.gameLive == false){
                games.removeGame(socket.id);//Remove the game from games class
                console.log('Game ended with pin:', game.pin);

                var playersToRemove = players.getPlayers(game.hostId); //Getting all players in the game

                //For each player in the game
                for(var i = 0; i < playersToRemove.length; i++){
                    players.removePlayer(playersToRemove[i].playerId); //Removing each player from player class
                }

                io.to(game.pin).emit('hostGambarDisconnect'); //Send player back to 'join' screen
                socket.leave(game.pin); //Socket is leaving room
            }
        }else{
            //No game has been found, so it is a player socket that has disconnected
            var player = players.getPlayer(socket.id); //Getting player with socket.id
            //If a player has been found with that id
            if(player){
                var hostId = player.hostId;//Gets id of host of the game
                var game = games.getGame(hostId);//Gets game data with hostId
                var pin = game.pin;//Gets the pin of the game

                if(game.gameLive == false){
                    players.removePlayer(socket.id);//Removes player from players class
                    var playersInGame = players.getPlayers(hostId);//Gets remaining players in game

                    io.to(pin).emit('updatePlayerLobbyGambar', playersInGame);//Sends data to host to update screen
                    socket.leave(pin); //Player is leaving the room

                }
            }
        }

    });

    //Sets data in player class to answer from player
    socket.on('playerAnswerGambar', function(num){
        var player = players.getPlayer(socket.id);
        var hostId = player.hostId;
        var playerNum = players.getPlayers(hostId);
        var game = games.getGame(hostId);
        if(game.gameData.questionLive == true){//if the question is still live
            player.gameData.answer = num;
            game.gameData.playersAnswered += 1;

            var gameQuestion = game.gameData.question;
            var gameid = game.gameData.gameid;

            MongoClient.connect(url, function(err, db){
                if (err) throw err;

                var dbo = db.db('kahootDB');
                var query = { id:  parseInt(gameid)};
                dbo.collection("gamegambar").find(query).toArray(function(err, res) {
                    if (err) throw err;
                    var correctAnswer = res[0].questions[gameQuestion - 1].correct;
                    //Checks player answer with correct answer
                    num = num.toUpperCase();
                    correctAnswer = correctAnswer.toUpperCase();
                    if(num == correctAnswer){
                        player.gameData.score += 100;
                        io.to(game.pin).emit('getTimeGambar', socket.id);
                        socket.emit('answerResultGambar', true);
                    }

                    //Checks if all players answered
                    if(game.gameData.playersAnswered == playerNum.length){
                        game.gameData.questionLive = false; //Question has been ended bc players all answered under time
                        var playerData = players.getPlayers(game.hostId);
                        io.to(game.pin).emit('questionOverGambar', playerData, correctAnswer);//Tell everyone that question is over
                    }else{
                        //update host screen of num players answered
                        io.to(game.pin).emit('updatePlayersAnsweredGambar', {
                            playersInGame: playerNum.length,
                            playersAnswered: game.gameData.playersAnswered
                        });
                    }

                    db.close();
                });
            });



        }
    });

    socket.on('getScoreGambar', function(){
        var player = players.getPlayer(socket.id);
        socket.emit('newScoreGambar', player.gameData.score);
    });

    socket.on('timeGambar', function(data){
        var time = data.time / 20;
        time = time * 100;
        var playerid = data.player;
        var player = players.getPlayer(playerid);
        player.gameData.score += time;
    });



    socket.on('timeUpGambar', function(){
        var game = games.getGame(socket.id);
        game.gameData.questionLive = false;
        var playerData = players.getPlayers(game.hostId);

        var gameQuestion = game.gameData.question;
        var gameid = game.gameData.gameid;

            MongoClient.connect(url, function(err, db){
                if (err) throw err;

                var dbo = db.db('kahootDB');
                var query = { id:  parseInt(gameid)};
                dbo.collection("gamegambar").find(query).toArray(function(err, res) {
                    if (err) throw err;
                    var correctAnswer = res[0].questions[gameQuestion - 1].correct;
                    io.to(game.pin).emit('questionOverGambar', playerData, correctAnswer);

                    db.close();
                });
            });
    });

    socket.on('nextQuestionGambar', function(){
        var playerData = players.getPlayers(socket.id);
        //Reset players current answer to 0
        for(var i = 0; i < Object.keys(players.players).length; i++){
            if(players.players[i].hostId == socket.id){
                players.players[i].gameData.answer = 0;
            }
        }

        var game = games.getGame(socket.id);
        game.gameData.playersAnswered = 0;
        game.gameData.questionLive = true;
        game.gameData.question += 1;
        var gameid = game.gameData.gameid;



        MongoClient.connect(url, function(err, db){
                if (err) throw err;

                var dbo = db.db('kahootDB');
                var query = { id:  parseInt(gameid)};
                dbo.collection("gamegambar").find(query).toArray(function(err, res) {
                    if (err) throw err;

                    if(res[0].questions.length >= game.gameData.question){
                        var questionNum = game.gameData.question;
                        questionNum = questionNum - 1;
                        var question = res[0].questions[questionNum].question;
                        var pertanyaan = res[0].questions[questionNum].pertanyaan;
                        var correctAnswer = res[0].questions[questionNum].correct;
                        var pembahasan = res[0].questions[questionNum].pembahasan;

                        socket.emit('gameQuestionsGambar', {
                            q1: question,
                            p1: pertanyaan,
                            correct: correctAnswer,
                            pembahasan: pembahasan,
                            playersInGame: playerData.length
                        });
                        db.close();
                    }else{
                        var playersInGame = players.getPlayers(game.hostId);
                        var idhost = playersInGame[0].hostId;
                        var first = {name: "", score: 0};
                        var second = {name: "", score: 0};
                        var third = {name: "", score: 0};
                        var fourth = {name: "", score: 0};
                        var fifth = {name: "", score: 0};

                        //save history player tebak gambar
                        MongoClient.connect(url, function(err, db){
                          if (err) throw err;

                          var dbo = db.db('kahootDB');
                          var data = {idhost: idhost, history: playersInGame, timestamps: Date()};
                          dbo.collection("history_gambar").insertOne(data, function(err, res){
                            if (err) throw err;
                            console.log("History acak kata berhasil ditambahkan");
                            db.close();
                          });
                        });
                        //end save history player tebak gambar

                        for(var i = 0; i < playersInGame.length; i++){
                            console.log(playersInGame[i].gameData.score);
                            if(playersInGame[i].gameData.score > fifth.score){
                                if(playersInGame[i].gameData.score > fourth.score){
                                    if(playersInGame[i].gameData.score > third.score){
                                        if(playersInGame[i].gameData.score > second.score){
                                            if(playersInGame[i].gameData.score > first.score){
                                                //First Place
                                                fifth.name = fourth.name;
                                                fifth.score = fourth.score;

                                                fourth.name = third.name;
                                                fourth.score = third.score;

                                                third.name = second.name;
                                                third.score = second.score;

                                                second.name = first.name;
                                                second.score = first.score;

                                                first.name = playersInGame[i].name;
                                                first.score = playersInGame[i].gameData.score;
                                            }else{
                                                //Second Place
                                                fifth.name = fourth.name;
                                                fifth.score = fourth.score;

                                                fourth.name = third.name;
                                                fourth.score = third.score;

                                                third.name = second.name;
                                                third.score = second.score;

                                                second.name = playersInGame[i].name;
                                                second.score = playersInGame[i].gameData.score;
                                            }
                                        }else{
                                            //Third Place
                                            fifth.name = fourth.name;
                                            fifth.score = fourth.score;

                                            fourth.name = third.name;
                                            fourth.score = third.score;

                                            third.name = playersInGame[i].name;
                                            third.score = playersInGame[i].gameData.score;
                                        }
                                    }else{
                                        //Fourth Place
                                        fifth.name = fourth.name;
                                        fifth.score = fourth.score;

                                        fourth.name = playersInGame[i].name;
                                        fourth.score = playersInGame[i].gameData.score;
                                    }
                                }else{
                                    //Fifth Place
                                    fifth.name = playersInGame[i].name;
                                    fifth.score = playersInGame[i].gameData.score;
                                }
                            }
                        }

                        io.to(game.pin).emit('GameOverGambar', {
                            num1: first.name,
                            num2: second.name,
                            num3: third.name,
                            num4: fourth.name,
                            num5: fifth.name
                        });
                    }
                });
            });

        io.to(game.pin).emit('nextQuestionGambarPlayer');
    });

    //When the host starts the game
    socket.on('startGameGambar', () => {
        var game = games.getGame(socket.id);//Get the game based on socket.id
        game.gameLive = true;
        socket.emit('gameGambarStarted', game.hostId);//Tell player and host that game has started
    });


    //Test upload Modul
    var count = 0;
    var uploader = new SocketIOFile(socket, {

      uploadDir: '../public/data',							// simple directory
      // accepts: ['audio/mpeg', 'audio/mp3'],		// chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
      // maxFileSize: 4194304, 						// 4 MB. default is undefined(no limit)
      chunkSize: 10240,							// default is 10240(1KB)
      transmissionDelay: 0,						// delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
      overwrite: false, 							// overwrite file if exists, default is true.

    });
    uploader.on('start', (fileInfo) => {
      console.log('Start uploading');
      console.log(fileInfo);
    });

    uploader.on('complete', (fileInfo) => {

      console.log('Upload Complete.');
      console.log(fileInfo.uploadDir);
    });
    uploader.on('error', (err) => {
      console.log('Error!', err);
    });
    uploader.on('abort', (fileInfo) => {
      console.log('Aborted: ', fileInfo);
    });
    //End Test upload modul

    //request historykata
    socket.on('requesthistorykata', function(){

        MongoClient.connect(url, function(err, db){
            if (err) throw err;

            var dbo = db.db('kahootDB');
            dbo.collection("history_kata").find().toArray(function(err, res) {
                if (err) throw err;
                socket.emit('responhistorykata', res);
                console.log(res);
                db.close();
            });
        });
    });
    //end request historykata

    //show historykata
    socket.on('requestlisthistorykata',(data) =>{
      console.log(data);
      MongoClient.connect(url, function(err,db){
        if (err) throw err;
        var dbo = db.db("kahootDB");
        var query = {idhost: data};
        // var id = query;
        dbo.collection('history_kata').find(query).toArray(function(err, res){
          if (err) throw err;


            socket.emit('responlisthistorykata', res);
            console.log(query);
            console.log(res);
            db.close();
        });
      });
    });
    //end show historykata

    //request historykata
    socket.on('requesthistorygambar', function(){

        MongoClient.connect(url, function(err, db){
            if (err) throw err;

            var dbo = db.db('kahootDB');
            dbo.collection("history_gambar").find().toArray(function(err, res) {
                if (err) throw err;
                socket.emit('responhistorygambar', res);
                console.log(res);
                db.close();
            });
        });
    });
    //end request historykata

    //show historykata
    socket.on('requestlisthistorygambar',(data) =>{
      console.log(data);
      MongoClient.connect(url, function(err,db){
        if (err) throw err;
        var dbo = db.db("kahootDB");
        var query = {idhost: data};
        // var id = query;
        dbo.collection('history_gambar').find(query).toArray(function(err, res){
          if (err) throw err;


            socket.emit('responlisthistorygambar', res);
            console.log(query);
            console.log(res);
            db.close();
        });
      });
    });
    //end show historykata
});
