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
    socket.on("mover", function(data){
        let p = socket.player;
        let player = {
            id: p.id,
            morir : p.morir,
            animaciones:{stop:p.animaciones.stop},
            x : p.x,
            y : p.y,
            posHitX: p.posHitX,
            posHitY: p.posHitY,
            hitbox:{
                    x: p.hitbox.x,
                    y: p.hitbox.y 
                    },
            dir : p.dir,
            vel : p.vel,
            personaje : p.personaje,
            numBomb : p.numBomb,
            numMaxBomb : p.numMaxBomb,
            timeBomb : p.timeBomb,
            largeBomb : p.largeBomb
        };
        if(player){
            p.x = data.x;
            p.y = data.y;
            p.hitbox.x = data.hitbox.x;
            p.hitbox.y = data.hitbox.y;
            p.animaciones.stop = data.animaciones.stop;
            p.dir = data.dir;
            socket.broadcast.emit("actualizar", player);
        }else{
            player = {id: p.id};
            io.emit('murio', player);
        }
    });
    socket.on('newBomb',function(){
        socket.player.numBomb -= 1;
        io.emit('newBomb', socket.player);
    });
    socket.on('msPing', function(data) {
        socket.emit('msPong', data);
    });
    socket.on('sumBomb',function(){
        socket.player.numBomb += 1;
    });
    socket.on('murio', function(id){
        var player = getPlayerID(id);
        if(player){
            player.morir = true;
            io.emit('murio', player);
        }
    });
    socket.on('delete', function(){
        delete socket.player;
    });
    socket.on('disconnect', function(){
        if(socket.player){
            socket.player.morir = true;
            socket.broadcast.emit('murio', socket.player);
            delete socket.player;
        }
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
