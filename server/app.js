var express = require('express'); // se llama la libreria express
var app = express(); // se crea un objeto de la libreria
var server = require('http').Server(app); // se llama la libreria http y se manda express
var io = require('socket.io').listen(server,{
    pingInterval: 3000
}); // se escucha del servidor con la libreria de sockets
var path = require('path'); // Se llama la libreria Path para path's
var fs = require('fs');
var public = '/../public'; // Paths donde esta la parte publica
var mapPath = '/mapJSON/';
var favicon = require('serve-favicon');

app.use('/css',express.static(path.resolve(__dirname + public + '/css'))); // direccion del css
app.use('/js',express.static(path.resolve(__dirname + public + '/js'))); // direccion del javascript
app.use('/img',express.static(path.resolve(__dirname + public + '/img'))); // direccion de las imagenes
app.use(favicon(path.join(__dirname + public + '/favicon.ico')));

app.get('/',function(req,res){
    res.sendFile(path.resolve(__dirname + public + '/index.html')); // si se pide / llama al index
});
server.lastPlayderID = 0; // se inicializa las id de los personajes
server.salas = [];
server.idSalas = 0;

fs.readFile(path.resolve(__dirname + mapPath + 'mapa.json'), 'utf8', function (err, data) {
  if (err) throw err;
  server.mapas = JSON.parse(data)["layers"];
  // se crea una sala
  crearSala(server.mapas[0], "Primera sala de prueba");
});

// funcion para escuchar el servidor y abrirlo
server.listen(process.env.PORT || 5000,function(){
    console.log('escuchando en '+server.address().port);
});


io.on('connection',function(socket){
    socket.salaID = 0;
    socket.myRoom = server.salas[socket.salaID].room;
    socket.join(socket.myRoom);
    socket.lifes = 3;
    socket.kills = 0;
    let miSala = server.salas[socket.salaID];
    socket.emit('lifes', socket.lifes);
    socket.emit('mapa', miSala["map"], miSala["mapWidth"]);
    socket.on('powers', function() {
        socket.emit('powers', miSala["powers"]);
    });
    socket.on('user', function(name, pj){
        socket.emit("nuevoID", server.lastPlayderID++, name, pj);
        socket.emit("allplayers", getAllPlayer(socket.id, socket.myRoom));
        server.salas[socket.salaID]["numPlayers"] += 1;
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
        if(socket.player){
            socket.player.numBomb -= 1;
            let pack = {id: socket.player.id, x: data.x, y:data.y}
            io.to(socket.myRoom).emit('newBomb', pack);
        }
    });
    socket.on('msPing', function(data) {
        socket.emit('msPong', data);
    });
    socket.on('aumentarKill', function(){
        socket.kills += 1;
        socket.emit('kill', socket.kills);
    });
    socket.on('sumBomb',function(){
        if(socket.player)
        socket.player.numBomb += 1;
    });
    socket.on('eliminatePower', function(index){
        let powers = server.salas[socket.salaID]["powers"];
        if(powers[index] != -1){
            socket.emit('actualizar', powers[index]);
            powers[index] = -1;
        }
    });
    socket.on('destroyBlock', function(data){
        let mymap = server.salas[socket.salaID]["map"];
        let powers = server.salas[socket.salaID]["powers"];
        if(mymap[data] != 0){
            mymap[data] = 0;
            if(getRndInteger(0,4)>= 4){
                let ran = getRndInteger(0,24);
                let typePower;
                if(ran < 1) typePower = 0;
                else if(ran <= 15)  typePower = 1;
                else if(ran <= 20) typePower = 2;
                else if(ran <= 24) typePower = 3;
                io.to(socket.myRoom).emit('generatePosPower', {id:data, type: typePower});
                powers[data] = typePower;
            }
            else{
                io.to(socket.myRoom).emit('generatePosPower', {id:data, type: -1});
                powers[data] = -1;
            }
            socket.broadcast.emit('destroyBlock', data);
        }
    });
    socket.on('murio', function(id){
        var player = getPlayerID(id);
        if(player){
            player.morir = true;
            if(id == socket.player.id){
                socket.lifes -= 1;
                socket.emit('lifes', socket.lifes);
            }
            io.to(socket.myRoom).emit('murio', player.id);
        }
    });
    socket.on('delete', function(){
        if(socket.player){
            if(socket.lifes < 0){
                delete socket.player;
                server.salas[socket.salaID]["numPlayers"] -= 1;
                socket.emit('inicio');
            }else{
                socket.player.morir = false;
                let c =  posicionRandom();
                cambiarPos(c.x, c.y, socket.player);
                setTimeout(
                    function(){
                        io.to(socket.myRoom).emit('nuevoJugador', socket.player)
                    }, 3000);
            }
        }
    });
    socket.on('disconnect', function(reason){
        if (reason === 'io server disconnect') 
            socket.connect();
        else{
            if(socket.player){
                socket.player.morir = true;
                socket.broadcast.emit('murio', socket.player.id);
                delete socket.player;
            }
            server.salas[socket.salaID]["numPlayers"] -= 1;
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
function getAllPlayer(id, sala){
    var players = [];
    let player;
    io.of('/').in(sala).clients((error, client)=>{
        client.forEach(socketID =>{
            player = io.sockets.connected[socketID].player;
            if(socketID != id && player) players.push(client.player);
        });
    });
    return players;
}
function getPlayerID(id){
    let player;
    var returnPlayer;
    io.of('/').in(sala).clients((error, client)=>{
        client.forEach(socketID =>{
            player = io.sockets.connected[socketID].player;
            if(player && player.id == id){
                returnPlayer = player;
            }
        });
    });
    return returnPlayer;
}
function posicionRandom(){
    var vectorX =[1,19,37,9,29,1 ,19,37,29,1 ,19,37];
    var vectorY =[1,1 ,1 ,7,7 ,15,15,15,21,27,27,27];
    var j = getRndInteger(0, vectorX.length-1);
    var c= {
        x:vectorX[j]*32,
        y:vectorY[j]*32
    }
    return c;
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function cambiarPos(x, y, player){
    player.hitbox.x = x;
    player.hitbox.y = y;
    player.x = x - player.posHitX;
    player.y = y - player.posHitY;
}
function mapRandom(mapa){
    let n = 0;
    let retornar = [];
    mapa['data'].forEach(layer =>{
        retornar[n] = mapa['data'][n];
        if(layer == 2){
            if(Math.random()*8 > 6){
                retornar[n] = 0;
            }
        }
        n+=1;
    });
    return retornar;
}

function crearSala(mapa, name){
    server.salas[server.idSalas] = {
        map: mapRandom(mapa),
        mapWidth: mapa["width"],
        name,
        room: "sala"+server.idSalas,
        numPlayers: 0,
        powers: []
    };
    server.idSalas++;
}