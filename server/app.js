var express = require('express'); // se llama la libreria express
var app = express(); // se crea un objeto de la libreria
var server = require('http').Server(app); // se llama la libreria http y se manda express
var io = require('socket.io').listen(server); // se escucha del servidor con la libreria de sockets
var path = require('path'); // Se llama la libreria Path para path's


var public = '/../public'; // Paths donde esta la parte publica

app.use('/css',express.static(path.resolve(__dirname + public + '/css'))); // direccion del css
app.use('/js',express.static(path.resolve(__dirname + public + '/js'))); // direccion del javascript
app.use('/img',express.static(path.resolve(__dirname + public + '/img'))); // direccion de las imagenes

app.get('/',function(req,res){
    res.sendFile(path.resolve(__dirname + public + '/index.html')); // si se pide / llama al index
});

server.lastPlayderID = 0; // se inicializa las id de los personajes

// funcion para escuchar el servidor y abrirlo
server.listen(process.env.PORT || 5000,function(){
    console.log('escuchando en '+server.address().port);
});

// Funcion que se llama si se conecta el socket
io.on('connection',function(socket){
    console.log("Ha entrado un nuevo jugador/socket");
    // funcion que recibe del cliente para crear nuevo jugador
    socket.on('nuevoJugador',function(data){
        // nuevo jugador
        socket.player = data;
        // se emite al socket la posiciones de todos los jugadores menos el propio
        socket.emit('allplayers',getAllPlayers(socket.id));
        // colocarle una ID
        socket.player.id = server.lastPlayderID++;
        socket.emit('cambiarID', socket.player);
        // se emite a los demas jugadores que hay un jugador (no incluyendose)
        socket.broadcast.emit('nuevoJugador',socket.player);

        // funcion para actualizar obtiendo la informacion del servidor
        socket.on('actualizar',function(data){
            socket.player = data; // toma los datos del jugador que va actualizar
            socket.broadcast.emit('mover', socket.player); // se emite al cliente "mover" y se manda al jugador
        });
        // cada vez que un jugador se desconecta se emite remove
        socket.on('disconnect',function(){
            socket.broadcast.emit('remove',socket.player);
        });
        socket.on('murio',function(){
            socket.broadcast.emit('remove',socket.player);
        });
        // recibe señal del cliente que hay nueva bomba
        socket.on('newBomba', function(data){
            // se emite todos menos a el mismo que se coloco una bomba
            socket.broadcast.emit('colocoBomba',data);
        });
    });
});

// funcion para conseguir todos los jugadores
function getAllPlayers(id){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player && socketID != id) players.push(player);
    });
    return players;
}

// numero random entero
function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
