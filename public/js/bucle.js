// 1 segundo =  1000ms
var buclePrincipal = {
    idEjecucion: null,
    ultimoRegistro: 0,
    aps: 0,                         // contador de actulizaciones
    fps: 0,                         // contador de fps
    ctx: null,                      // el canvas del DOM 
    personajes:[],                  // vector de personajes
    bombas: [],                     // vector de bombas
    explosiones: [],                // vector de explociones
    myOwn: null,                    // objeto del jugador que controla
    dibujarFps:"APS: 0 | FPS: 0",
    iterar: function(registroTemporal){
        buclePrincipal.idEjecucion =  window.requestAnimationFrame(buclePrincipal.iterar);
        buclePrincipal.limpiar();
        buclePrincipal.actualizar(registroTemporal);
        buclePrincipal.dibujar();
        if(registroTemporal - buclePrincipal.ultimoRegistro > 999){
            buclePrincipal.ultimoRegistro = registroTemporal;
            //console.log("APS: "+ buclePrincipal.aps + " | FPS: "+ buclePrincipal.fps);
            buclePrincipal.dibujarFps = "APS: "+ buclePrincipal.aps + " | FPS: "+ buclePrincipal.fps;
            buclePrincipal.aps = 0;
            buclePrincipal.fps = 0;
        }
    }, solido: function(x,y, player){
        var esSolido = false;
        var futX, futY;
        // izquierda y arriba 
        if(x <= 0 && y <= 0) {
            futX = player.hitbox.x + x; 
            futY = player.hitbox.y + y;
        }
        // derecha y abajo
        if(x >= 0 && y >= 0){
            futX = player.hitbox.x + x + player.hitbox.ancho; 
            futY = player.hitbox.y + y + player.hitbox.alto;
        }
        buclePrincipal.bombas.forEach(bomba => {
            esSolido = bomba.hitbox.puntoCon(futX, futY);
        });
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
        var bomba = new bomb(coloca.x + 7,coloca.y + 25, coloca.timeBomb, coloca.largeBomb);
        buclePrincipal.bombas.push(bomba);
        setTimeout(buclePrincipal.temporizador, coloca.timeBomb, bomba, coloca);
        coloca.numBomb -= 1;
    },
    temporizador: function(bomba, coloca){
        if(buclePrincipal.bombas.indexOf(bomba) != -1){
            delete buclePrincipal.bombas[buclePrincipal.bombas.indexOf(bomba)];
            // explosión del centro
            var bX = bomba.x,  bY = bomba.y, bAncho = bomba.hitbox.ancho, bAlto = bomba.hitbox.alto;
            var Texplo = 500;
            var explo = new rectangulo(bX, bY, bAncho, bAlto);
            buclePrincipal.explosiones.push(explo);
            setTimeout(buclePrincipal.tiempoExplo, Texplo, explo);
            //explosión arriba
            var n = 1;
            do{
                explo = new rectangulo(bX, bY - bAlto*n, bAncho, bAlto);
                buclePrincipal.explosiones.push(explo);
                setTimeout(buclePrincipal.tiempoExplo, Texplo, explo);
                n++;
            }while(n < coloca.largeBomb + 1);
            n = 1;
            // Explosión abajo
            do{
                explo = new rectangulo(bX, bY + bAlto*n, bAncho, bAlto);
                buclePrincipal.explosiones.push(explo);
                setTimeout(buclePrincipal.tiempoExplo, Texplo, explo);
                n++;
            }while(n < coloca.largeBomb+ 1);
            n = 1;
            // Explosión a la derecha
            do{
                explo = new rectangulo(bX + bAlto*n, bY, bAncho, bAlto);
                buclePrincipal.explosiones.push(explo);
                setTimeout(buclePrincipal.tiempoExplo, Texplo, explo);
                n++;
            }while(n < coloca.largeBomb+ 1);
            n = 1;
            // Explsión a la izquierda
            do{
                explo = new rectangulo(bX - bAlto*n, bY, bAncho, bAlto);
                buclePrincipal.explosiones.push(explo);
                setTimeout(buclePrincipal.tiempoExplo, 500, explo);
                n++;
            }while(n < coloca.largeBomb + 1);
            coloca.numBomb += 1;
        }
        else
            console.log("ERROR NO EXISTE LA BOMBA");
    },
    copiar: function(data){
        return new player(data.id, data.x, data.y, data.ruta, data.posHitX, data.posHitY, data.anchoHit, data.altoHit, data.numBomb, data.timeBomb, data.largeBomb);
    },
    tiempoExplo: function(explo){
        if(buclePrincipal.explosiones.indexOf(explo) != -1){
            delete buclePrincipal.explosiones[buclePrincipal.explosiones.indexOf(explo)];
        }
    },
    actualizar: function(){
        if(buclePrincipal.myOwn != null){
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
            buclePrincipal.ctx.fillStyle = "black";
             if(buclePrincipal.myOwn != null) buclePrincipal.ctx.fillText( buclePrincipal.dibujarFps + " | X: "+ buclePrincipal.myOwn.hitbox.x + " | Y: "+ buclePrincipal.myOwn.hitbox.y, 0, 20); 
             else buclePrincipal.ctx.fillText( buclePrincipal.dibujarFps , 0, 20); 
        }
        buclePrincipal.fps++;
    },
    limpiar: function(){
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
};