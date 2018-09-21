var bombManager = {
    bombs:[],
    explosions:[]
};
bombManager.Draw = function(ctx){
    this.bombs.forEach(element => {
        element.Draw(buclePrincipal.ctx);
    });
    if(debug.hit){
        this.explosions.forEach(element => {
            element.Draw(buclePrincipal.ctx);
        });
    }
};

bombManager.Update = function(){
    playerManager.personajes.forEach(player => {
        bombManager.explosions.forEach(explo => {
            if(player.hitbox.chocarCon(explo)){
                io.emit("murio", player.id);
            }
        });
    });
    if(keys[32] && playerManager.personajes[playerManager.id]!= null){
        if(!this.tocarBomb(playerManager.personajes[playerManager.id].hitbox).toco && playerManager.personajes[playerManager.id].numBomb > 0)
        {
            this.colocarBomba(playerManager.personajes[playerManager.id]);
            playerManager.personajes[playerManager.id].numBomb -= 1;
            io.emit('newBomb');
        }
    }
};
bombManager.colocarBomba = function(player){
    player = playerManager.personajes[player.id];
    var bomba = new bomb(player.x ,player.y + 25, player.timeBomb, player.largeBomb);
    if(playerManager.personajes[playerManager.id] !=  null){
        if(player.id != playerManager.id) bomba.recienColocada = false;
    }
    bomba.coloca = player;
    this.bombs.push(bomba);
    bomba.tmp = setTimeout(this.temporizador, player.timeBomb, bomba, player);
}

bombManager.temporizador =  function(bomba, coloca){
    if(bombManager.bombs.indexOf(bomba) != -1){
        delete bombManager.bombs[bombManager.bombs.indexOf(bomba)];
        // explosión del centro
        var bX = bomba.x,  bY = bomba.y, bAncho = bomba.hitbox.ancho, bAlto = bomba.hitbox.alto;
        var Texplo = 500; // tiempo que dura las explosiones
        var explo = new rectangulo(bX, bY, bAncho, bAlto); // se crea una explosión
        bombManager.explosions.push(explo);

        setTimeout(bombManager.tiempoExplo, Texplo, explo);
        var tpm;
        //explosión arriba
        var n = 1;
        do{
            explo = new rectangulo(bX, bY - bAlto*n, bAncho, bAlto);
            bombManager.explosions.push(explo);            tpm = bombManager.tocarBomb(explo);
            setTimeout(bombManager.tiempoExplo, Texplo, explo);
            if(tpm.toco){
                clearTimeout(tpm.bomba.tmp);
                bombManager.temporizador(tpm.bomba, tpm.bomba.coloca);
                break;
            }
            n++;
        }while(n < coloca.largeBomb + 1);
        n = 1;
        // Explosión abajo
        do{
            explo = new rectangulo(bX, bY + bAlto*n, bAncho, bAlto);
            bombManager.explosions.push(explo);
            tpm = bombManager.tocarBomb(explo);
            setTimeout(bombManager.tiempoExplo, Texplo, explo);
            if(tpm.toco){
                clearTimeout(tpm.bomba.tmp);
                bombManager.temporizador(tpm.bomba, tpm.bomba.coloca);
                break;
            }
            n++;
        }while(n < coloca.largeBomb+ 1);
        n = 1;
        // Explosión a la derecha
        do{
            explo = new rectangulo(bX + bAlto*n, bY, bAncho, bAlto);
            bombManager.explosions.push(explo);
            tpm = bombManager.tocarBomb(explo);
            setTimeout(bombManager.tiempoExplo, Texplo, explo);
            if(tpm.toco){
                clearTimeout(tpm.bomba.tmp);
                bombManager.temporizador(tpm.bomba, tpm.bomba.coloca);
                break;
            }
            n++;
        }while(n < coloca.largeBomb + 1);
        n = 1;
        // Explsión a la izquierda
        do{
            explo = new rectangulo(bX - bAlto*n, bY, bAncho, bAlto);
            bombManager.explosions.push(explo);            
            tpm = bombManager.tocarBomb(explo);
            setTimeout(bombManager.tiempoExplo, Texplo, explo);
            if(tpm.toco){
                clearTimeout(tpm.bomba.tmp);
                bombManager.temporizador(tpm.bomba, tpm.bomba.coloca);
                break;
            }
            n++;
        }while(n < coloca.largeBomb + 1);
        if(playerManager.personajes[playerManager.id])
            if(playerManager.personajes[playerManager.id].numBomb < playerManager.personajes[playerManager.id].numMaxBomb)
                if(coloca.id == playerManager.id){
                    io.emit("sumBomb");
                    playerManager.personajes[playerManager.id].numBomb +=1;
                }
    }
};
bombManager.tocarBomb = function(hit){
    var retornar = {toco:false, bomba:null};
    bombManager.bombs.forEach(element => {
        if(element.hitbox.chocarCon(hit)){
            retornar.toco = element.hitbox.chocarCon(hit);
            retornar.bomba = element;
        };
    });
    return retornar;
};

bombManager.tiempoExplo =  function(explo){
    if(bombManager.explosions.indexOf(explo) != -1){
        delete bombManager.explosions[bombManager.explosions.indexOf(explo)];
    }
}

io.on('newBomb', function(player){
    bombManager.colocarBomba(player);
});