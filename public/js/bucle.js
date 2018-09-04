// 1 segundo =  1000ms
var buclePrincipal = {
    idEjecucion: null,
    ultimoRegistro: 0,
    aps: 0,                         // contador de actulizaciones
    fps: 0,                         // contador de fps
    ping: 0, 
    ctx: null,                      // el canvas del DOM 
    personajes:[],                  // vector de personajes
    bombas: [],                     // vector de bombas
    explosiones: [],                // vector de explociones
    myOwn: null,                    // objeto del jugador que controla
    dibujarFps:"APS: 0 | FPS: 0 | MS: 0",
    move:{
        derecha: false,
        izquierda: false,
        arriba: false,
        abajo: false
    },mover: function(){
        
        if(buclePrincipal.derecha && buclePrincipal.solido(buclePrincipal.myOwn.vel , 0, buclePrincipal.myOwn)){
            buclePrincipal.myOwn.mover(buclePrincipal.myOwn.velTmp , 0); // derecha
            io.emit('actualizar', buclePrincipal.myOwn);
        }
        else if(buclePrincipal.izquierda && buclePrincipal.solido(-buclePrincipal.myOwn.vel , 0, buclePrincipal.myOwn)){
            buclePrincipal.myOwn.mover(-buclePrincipal.myOwn.velTmp , 0); // izquierda
            io.emit('actualizar', buclePrincipal.myOwn);
        }
        else if(buclePrincipal.arriba && buclePrincipal.solido(0 , -buclePrincipal.myOwn.vel, buclePrincipal.myOwn)){
            buclePrincipal.myOwn.mover(0 , -buclePrincipal.myOwn.velTmp); // arriba
            io.emit('actualizar', buclePrincipal.myOwn);
        }
        else if(buclePrincipal.abajo && buclePrincipal.solido(0 , buclePrincipal.myOwn.vel, buclePrincipal.myOwn)){
            buclePrincipal.myOwn.mover(0 , buclePrincipal.myOwn.velTmp); // abajo
            io.emit('actualizar', buclePrincipal.myOwn);
        }
    },
    iterar: function(registroTemporal){
        buclePrincipal.idEjecucion =  window.requestAnimationFrame(buclePrincipal.iterar);
        buclePrincipal.limpiar();
        buclePrincipal.actualizar(registroTemporal);
        buclePrincipal.dibujar();
        if(registroTemporal - buclePrincipal.ultimoRegistro > 999){
            buclePrincipal.ultimoRegistro = registroTemporal;
            //console.log("APS: "+ buclePrincipal.aps + " | FPS: "+ buclePrincipal.fps);
            buclePrincipal.dibujarFps = "APS: "+ buclePrincipal.aps + " | FPS: "+ buclePrincipal.fps + " | PING: " + buclePrincipal.ping;
            io.emit("msPing", Date.now());
            buclePrincipal.aps = 0;
            buclePrincipal.fps = 0;
        }
    }, solido: function(x,y, player){
        var esSolido = false;
        var futX, futY;
        // izquieda y abajo con la esquina inferior izquierda
        if(x <= 0 && y >= 0) {
            futX = player.hitbox.x + x; 
            futY = player.hitbox.y + y + player.hitbox.alto;
        }
        // Arriba y derecha con la esquina superior derecha
        if(x >= 0 && y <= 0){
            futX = player.hitbox.x + x + player.hitbox.ancho; 
            futY = player.hitbox.y + y;
        }
        buclePrincipal.bombas.forEach(bomba => {
            esSolido = bomba.hitbox.puntoCon(futX, futY);
        });
        // izquierda y arriba con la esquina superior izquierda
        if(x <= 0 && y <= 0) {
            futX = player.hitbox.x + x; 
            futY = player.hitbox.y + y;
        }
        // derecha y abajo con la esquina inferior derecha
        if(x >= 0 && y >= 0){
            futX = player.hitbox.x + x + player.hitbox.ancho; 
            futY = player.hitbox.y + y + player.hitbox.alto;
        }
        if(!esSolido){
            buclePrincipal.bombas.forEach(bomba => {
                esSolido = bomba.hitbox.puntoCon(futX, futY);
            });
        }
        return !esSolido;
    },
    colocarBomba:function(coloca){
        console.log(" coloca una bomba");
        if(buclePrincipal.myOwn !=  null){
            if(coloca.id == buclePrincipal.myOwn.id) coloca = buclePrincipal.myOwn;
        }
        buclePrincipal.personajes.forEach(element => {
            if(element.id == coloca.id){
                coloca = buclePrincipal.personajes[buclePrincipal.personajes.indexOf(element)];
            }
        });
        var bomba = new bomb(coloca.x ,coloca.y + 25, coloca.timeBomb, coloca.largeBomb);
        bomba.coloca = coloca;
        buclePrincipal.bombas.push(bomba);
        bomba.tmp = setTimeout(buclePrincipal.temporizador, coloca.timeBomb, bomba, coloca);
        coloca.numBomb -= 1;
    },
    temporizador: function(bomba, coloca){
        if(buclePrincipal.bombas.indexOf(bomba) != -1){
            delete buclePrincipal.bombas[buclePrincipal.bombas.indexOf(bomba)];
            // explosión del centro
            var bX = bomba.x,  bY = bomba.y, bAncho = bomba.hitbox.ancho, bAlto = bomba.hitbox.alto;
            var Texplo = 500; // tiempo que dura las explosiones
            var explo = new rectangulo(bX, bY, bAncho, bAlto); // se crea una explosión
            buclePrincipal.explosiones.push(explo);
            setTimeout(buclePrincipal.tiempoExplo, Texplo, explo);
            var tpm;
            //explosión arriba
            var n = 1;
            do{
                explo = new rectangulo(bX, bY - bAlto*n, bAncho, bAlto);
                buclePrincipal.explosiones.push(explo);
                tpm = buclePrincipal.tocarBomb(explo);
                setTimeout(buclePrincipal.tiempoExplo, Texplo, explo);
                if(tpm.toco){
                    clearTimeout(tpm.bomba.tmp);
                    setTimeout(buclePrincipal.temporizador, 1, tpm.bomba, tpm.bomba.coloca);
                    break;
                }
                n++;
            }while(n < coloca.largeBomb + 1);
            n = 1;
            // Explosión abajo
            do{
                explo = new rectangulo(bX, bY + bAlto*n, bAncho, bAlto);
                buclePrincipal.explosiones.push(explo);
                tpm = buclePrincipal.tocarBomb(explo);
                setTimeout(buclePrincipal.tiempoExplo, Texplo, explo);
                if(tpm.toco){
                    clearTimeout(tpm.bomba.tmp);
                    setTimeout(buclePrincipal.temporizador, 1, tpm.bomba, tpm.bomba.coloca);
                    break;
                }
                n++;
            }while(n < coloca.largeBomb+ 1);
            n = 1;
            // Explosión a la derecha
            do{
                explo = new rectangulo(bX + bAlto*n, bY, bAncho, bAlto);
                buclePrincipal.explosiones.push(explo);
                tpm = buclePrincipal.tocarBomb(explo);
                setTimeout(buclePrincipal.tiempoExplo, Texplo, explo);
                if(tpm.toco){
                    clearTimeout(tpm.bomba.tmp);
                    setTimeout(buclePrincipal.temporizador, 1, tpm.bomba, tpm.bomba.coloca);
                    break;
                }
                n++;
            }while(n < coloca.largeBomb + 1);
            n = 1;
            // Explsión a la izquierda
            do{
                explo = new rectangulo(bX - bAlto*n, bY, bAncho, bAlto);
                buclePrincipal.explosiones.push(explo);
                tpm = buclePrincipal.tocarBomb(explo);
                setTimeout(buclePrincipal.tiempoExplo, 500, explo);
                if(tpm.toco){
                    clearTimeout(tpm.bomba.tmp);
                    setTimeout(buclePrincipal.temporizador, 1, tpm.bomba, tpm.bomba.coloca);
                    break;
                }
                n++;
            }while(n < coloca.largeBomb + 1);
            coloca.numBomb += 1;
        }
    },
    tocarBomb: function(hit){
        var retornar = {toco:false, bomba:null};
        buclePrincipal.bombas.forEach(element => {
            if(element.hitbox.chocarCon(hit)){
                retornar.toco = element.hitbox.chocarCon(hit);
                retornar.bomba = element;
            };
        });
        return retornar;
    },
    copiar: function(data){
        return new player(data.id, data.x, data.y, data.vel, data.ruta, data.posHitX, data.posHitY, data.anchoHit, data.altoHit, data.numBomb, data.timeBomb, data.largeBomb);
    },
    tiempoExplo: function(explo){
        if(buclePrincipal.explosiones.indexOf(explo) != -1){
            delete buclePrincipal.explosiones[buclePrincipal.explosiones.indexOf(explo)];
        }
    },
    actualizar: function(){
        if(buclePrincipal.myOwn != null){
            buclePrincipal.mover();
            buclePrincipal.explosiones.forEach(explo => {
                if(buclePrincipal.myOwn != null){
                    if(buclePrincipal.myOwn.hitbox.chocarCon(explo)){
                        io.emit("murio");
                        delete buclePrincipal.myOwn;
                    }
                }
            });
        }
        buclePrincipal.aps++;
    },
    dibujar: function(){
        buclePrincipal.bombas.forEach(element => {
            element.dibujar(buclePrincipal.ctx);
        });
        if(debug.hit){
            buclePrincipal.explosiones.forEach(element => {
                element.dibujar(buclePrincipal.ctx);
            });
        }
        if(buclePrincipal.myOwn != null)buclePrincipal.myOwn.dibujar(buclePrincipal.ctx);
        buclePrincipal.personajes.forEach(element => {
            buclePrincipal.personajes[buclePrincipal.personajes.indexOf(element)].dibujar(buclePrincipal.ctx);
        });
        if(debug.info){
            buclePrincipal.ctx.fillStyle = '#FFFFFF';
             if(buclePrincipal.myOwn != null) buclePrincipal.ctx.fillText( buclePrincipal.dibujarFps + " | X: "+ buclePrincipal.myOwn.hitbox.x + " | Y: "+ buclePrincipal.myOwn.hitbox.y, 0, 20); 
             else buclePrincipal.ctx.fillText( buclePrincipal.dibujarFps , 0, 20); 
        }
        buclePrincipal.fps++;
    },
    limpiar: function(){
        buclePrincipal.ctx.fillStyle = "black";
        buclePrincipal.ctx.fillRect(0,0, canvas.width,canvas.height);
    }
};