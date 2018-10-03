var express = require('express'); // se llama la libreria express
var app = express(); // se crea un objeto de la libreria
var server = require('http').Server(app); // se llama la libreria http y se manda express
var io = require('socket.io').listen(server,{
    pingInterval: 3000
}); // se escucha del servidor con la libreria de sockets
var path = require('path'); // Se llama la libreria Path para path's
var fs = require('fs');
var public = '/../public'; // Paths donde esta la parte publica
var map = '/mapJSON/';

app.use('/css',express.static(path.resolve(__dirname + public + '/css'))); // direccion del css
app.use('/js',express.static(path.resolve(__dirname + public + '/js'))); // direccion del javascript
app.use('/img',express.static(path.resolve(__dirname + public + '/img'))); // direccion de las imagenes

app.get('/',function(req,res){
    res.sendFile(path.resolve(__dirname + public + '/index.html')); // si se pide / llama al index
});
server.lastPlayderID = 0; // se inicializa las id de los personajes
fs.readFile(path.resolve(__dirname + map + 'mapa.json'), 'utf8', function (err, data) {
  if (err) throw err;
  server.mapa = JSON.parse(data)["layers"][0];
  let n = 0;
  server.mapa['data'].forEach(layer =>{
      if(layer == 2){
        if(Math.random()*8 > 6){
            server.mapa['data'][n] = 0;
        }
      }
      n+=1;
  });
});

// funcion para escuchar el servidor y abrirlo
server.listen(process.env.PORT || 5000,function(){
    console.log('escuchando en '+server.address().port);
});


server.bombas = [];
server.powers = [];
io.on('connection',function(socket){
    socket.emit('mapa', server.mapa);
    socket.on('powers', function() {
        socket.emit('powers', server.powers);
    });
    socket.on('user', function(data){
        socket.emit("nuevoID", server.lastPlayderID++, data);
        socket.emit("allplayers", getAllPlayer(socket.id));
    });
    socket.on("nuevoJugador", function(data){
        socket.player = data;
        socket.broadcast.emit("nuevoJugador", data);
    });
    socket.on("mover", function(data){
        let p = socket.player;
        if(p){
            p.x = data.x;
            p.y = data.y;
            p.hitbox.x = data.x + p.posHitX;
            p.hitbox.y = data.y + p.posHitY;
            p.animaciones.stop = data.animaciones.stop;
            p.dir = data.dir;
            let pack = {
                id: p.id,
                x: p.x,
                y: p.y,
                morir: p.morir,
                dir: p.dir,
                animaciones: {stop: data.animaciones.stop}
            };
            socket.broadcast.emit("mover", pack);
        }
    });
    socket.on('newBomb',function(data){
        socket.player.numBomb -= 1;
        let pack = {id: socket.player.id, x: data.x, y:data.y}
        io.emit('newBomb', pack);
    });
    socket.on('msPing', function(data) {
        socket.emit('msPong', data);
    });
    socket.on('sumBomb',function(){
        socket.player.numBomb += 1;
    });
    socket.on('eliminatePower', function(index){
        if(server.powers[index] != -1){
            server.powers[index] = -1;
        }
    });
    socket.on('destroyBlock', function(data){
        if(server.mapa['data'][data] != 0){
            server.mapa['data'][data] = 0;
            if(getRndInteger(0,2)>= 2){
                let ran = getRndInteger(0,15);
                let typePower;
                if(ran <= 1) typePower = 0;
                else if(ran <= 6)  typePower = 1;
                else if(ran <= 11) typePower = 2;
                else if(ran <= 14) typePower = 3;
                io.emit('generatePosPower', {id:data, type: typePower});
                server.powers[data] = typePower;
            }
            else{
                io.emit('generatePosPower', {id:data, type: -1});
                server.powers[data] = -1;
            }
            socket.broadcast.emit('destroyBlock', data);
        }
    });
    socket.on('murio', function(id){
        var player = getPlayerID(id);
        if(player){
            player.morir = true;
            io.emit('murio', player.id);
        }
    });
    socket.on('delete', function(){
        delete socket.player;
    });
    socket.on('disconnect', function(reason){
        if (reason === 'io server disconnect') 
            socket.connect();
        else
            if(socket.player){
                socket.player.morir = true;
                socket.broadcast.emit('murio', socket.player.id);
                delete socket.player;
            }
    });
    socket.on('error', (error) => {
        console.log('error: '+error);
    });
    socket.on('connect_error', (error) => {
        console.log('error: '+error);
        try {
            socket.connect();
        }catch(err){
            console.log("Error de reconectar : " + err);
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

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}