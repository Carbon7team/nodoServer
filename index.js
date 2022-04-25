const express = require('express');

const { ExpressPeerServer } = require('peer');
const app = express();

app.use(express.json());






const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    methods: ["GET", "POST"]
  }
}
);

// list of users connected to the node
var users = [];

var tecnici = require('./src/tecnico');



app.use('/tecnico', tecnici);

app.get('/', function(req, res) {
  res.sendfile('testWS.html');
});

app.get('/videocall', function(req, res) {
  res.sendfile('videocall.html');
});

app.get('/tecnico', function(req, res) {
  res.sendfile('tecnico.html');
});

app.get('/virtualDisplay', function(req, res) {
  res.sendfile('virtualDisplay.html');
});

app.post('/richiestaAssistenza' , bodyParser.raw({ type: "application/json" }), function (req, res) {
  console.log(req);
  res.send('Richiesta in attesa di essere accettata');
});




// Socket initialization for user management
io.on('connection', function(socket) {
  console.log('A user connected');


  console.log(socket.id);
 
  socket.on('disconnect', function () {
    removeTecnico(socket.id);
     console.log('A user disconnected '+ socket.id);
     console.log(users);
  });

  // Receipt of messages through the socket and identification of the request
  socket.on("message", (data) => {

    if(data.identificazione == "tecnico"){
      if(data.tipo == "registrazione"){
        addTecnico(socket.id,data.idTecnico);
        console.log(users);
      }
    }

    if(data.identificazione == "virtualDisplay"){
      if(data.tipo == "chiamata"){
        addVirtualDisplay(socket.id,data.idVirtualDisplay);
        var tecnicoDisponibile = getTecnicoDisponibile();
        if(tecnicoDisponibile != null) {
          socket.broadcast.to(tecnicoDisponibile).emit('message', data );
        } 
      }
    }


   
   socket.send("ho ricevuto il tuo codice");
 });
});




const server = app.listen(9000);

//PeerJs initialization
const peerServer = ExpressPeerServer(server, {
  
  path: '/myapp'
});

app.use(peerServer);


peerServer.on('connection', function (id) {
    console.log('user with ', id.id, 'connected');
});




  http.listen(4000, function() {
    console.log('listening on *:4000');
  });




// the function adds a user to the list
function addTecnico(idSocket,idTecnico){
  users.push({'idSocket' :idSocket,
  'idTecnico':idTecnico,
  'disponibilita':true,
  });
}

function removeTecnico(idSocket){
  var i =0;
  users.forEach(tecnico => {
    if(tecnico.idSocket == idSocket) {
     users.splice(i,1);
    }
    i++;
  });
}

// the function adds a user to the list
function addVirtualDisplay(idSocket,idVirtualDisplay){
  users.push({'idSocket' :idSocket,
  'idVirtualDisplay':idVirtualDisplay,
  });
}

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
