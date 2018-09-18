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
const dir = {
    ARRIBA: "arriba",
    ABAJO: "abajo",
    DERECHA: "derecha",
    IZQUIERDA: "izquierda"
};

server.bombas = [];
io.on('connection',function(socket){
    socket.emit("nuevoID", server.lastPlayderID++);
    socket.on("nuevoJugador", function(data){
        socket.player = data;
        socket.emit("allplayers", getAllPlayer(socket.id));
        socket.broadcast.emit("nuevoJugador", data);
    });
    socket.on("mover", function(direccion, stop){
        let player = socket.player;
        if(direccion == dir.DERECHA){
            player = mov(player, player.vel, 0);
        }
        else if(direccion == dir.IZQUIERDA){
            player = mov(player, -player.vel, 0);
        }
        else if(direccion == dir.ARRIBA){
            player = mov(player, 0, -player.vel);
        }
        else if(direccion == dir.ABAJO){
            player = mov(player, 0, player.vel);
        }
        player.animaciones.stop = stop;
        player.dir = direccion;
        io.emit("actualizar", player);
    });
    socket.on('newBomb',function(){
        if(socket.player.numBomb > 0){
            io.emit('newBomb', socket.player);
            socket.player.numBomb-=1;
        }
    });
    socket.on('explosion', function(){
        if(socket.player.numBomb <= socket.player.numMaxBomb)
            socket.player.numBomb += 1;
    });
    socket.on('msPing', function(data) {
        socket.emit('msPong', data);
    });
    socket.on('murio', function(id){
        var player = getPlayerID(id);
        player.morir = true;
        io.emit('murio', player);
    });
    socket.on('disconnect', function(){
        socket.player.morir = true;
        socket.broadcast.emit('murio', socket.player);
        delete socket.player;
    });
});
function getAllPlayer(id){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player && socketID != id) players.push(player);
    });
    return players;
}
function getPlayerID(id){
    let player;
    var returnPlayer;
    Object.keys(io.sockets.connected).forEach(function(socketID){
        player = io.sockets.connected[socketID].player;
        if(player && player.id == id){
            returnPlayer = player;
        } 
    });
    return returnPlayer;
}
function mov(data ,velX, velY){
    data.x+= velX;
    data.y+= velY;
    data.hitbox.x = data.x + data.posHitX;
    data.hitbox.y = data.y + data.posHitY;
    return data;
}