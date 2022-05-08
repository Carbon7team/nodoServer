require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const logger = require('morgan');
const { ExpressPeerServer } = require('peer');
const manageSocketUser = require('./middlewares/manageSoketUser');
const manageCall = require('./middlewares/manageCall');


const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    methods: ["GET", "POST"]
  }
}
);

const port = process.env.SERVER_PORT;


// Getting data in json format

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Setting up cors

var cors = require('cors');
var corsOption = {
  origin: "*",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

// Using Helmet

app.use(helmet())

// Logger

app.use(logger('common'))

//Setting swagger Documentation

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = {
  info: {
    title: 'Nodo Server API',
    description: 'Documentation for Remote Support backend API',
  },
  host: 'localhost:4000',
  basePath: '/',
};
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js','./models/User.js'],
  
};
const swaggerSpec = swaggerJSDoc(options);
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'redoc.html'));
});

app.get('/tecnicoVideoCall', (req, res) => {
  res.sendFile(path.join(__dirname, 'videocallTecnico.html'));
});

app.get('/virtualDisplayVideoCAll', (req, res) => {
  res.sendFile(path.join(__dirname, 'videoCallVirtualDisplay.html'));
});



//Importing Routes
const login = require('./routes/loginUser');
const register = require('./routes/registerUser');
const logout=require('./routes/logout')
const deleteUser = require('./routes/deleteUser');
const updateDisponibility = require('./routes/changeDisponibility')


const server = app.listen(port);

//PeerJs initialization
const peerServer = ExpressPeerServer(server, {
  
  path: '/myapp'
});

app.use(peerServer);


//Using imported Routes
app.use(login);
app.use(register);
app.use(logout);
app.use(deleteUser);
app.use(updateDisponibility);



//==================================================================================================================================

http.listen(4000, function() {
  console.log('listening on *:4000');
});


peerServer.on('connection', function (id) {
    console.log('user with ', id.id, 'connected');
});




// Socket initialization for user management
io.on('connection', function(socket) {
  console.log('A user connected');


  console.log(socket.id);
 
  socket.on('disconnect', function () {
     console.log('A user disconnected '+ socket.id);
     manageSocketUser.removeSocketUser(socket.id);

  });

  // Receipt of messages through the socket and identification of the request
  socket.on("message", async (data) => {
 
      if(data.type == "registration"){
        manageSocketUser.saveSocketUser(data,socket.id);
      }

      if(data.type == "call"){
        var userOnline = await manageSocketUser.findSocketUser(socket.id);
        if(userOnline.User.role == "user") manageCall.sendCallToTechnician(userOnline,socket);
        
      }

      if(data.type == "refuse"){
        var userOnline = await manageSocketUser.findSocketUser(data.type.user_id);
        manageCall.resendCallToTechnician(userOnline,socket.id,socket);
      }
    

 });
});







//the function returns to the first available usersnician
function getTecnicoDisponibile(){
  var tecnicoDisponibile ;
  users.forEach(tecnico => {
    if(tecnico.disponibilita) {
      if(tecnicoDisponibile == null)  tecnicoDisponibile = tecnico.idSocket;

    }
  });
return tecnicoDisponibile;
}


