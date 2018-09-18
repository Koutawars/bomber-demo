// 1 segundo =  1000ms
var buclePrincipal = {
    idEjecucion: null,
    ultimoRegistro: 0,
    aps: 0,                         // contador de actulizaciones
    fps: 0,
    maxFps: 0,                         // contador de fps
    ping: 0, 
    ctx: null,                      // el canvas del DOM                  // vector de personajes
    bombas: [],                     // vector de bombas
    explosiones: [],                // vector de explociones
    dibujarFps:"APS: 0 | FPS: 0 | MS: 0",
    screen: "inGame",
    iterar: function(registroTemporal){
        buclePrincipal.idEjecucion =  window.requestAnimationFrame(buclePrincipal.iterar);
        buclePrincipal.limpiar();
        buclePrincipal.Update(registroTemporal);
        buclePrincipal.Draw();
        if(registroTemporal - buclePrincipal.ultimoRegistro > 999){
            buclePrincipal.ultimoRegistro = registroTemporal;
            //console.log("APS: "+ buclePrincipal.aps + " | FPS: "+ buclePrincipal.fps);
            buclePrincipal.dibujarFps = "APS: "+ buclePrincipal.aps + " | FPS: "+ buclePrincipal.fps + " | PING: " + buclePrincipal.ping;
            io.emit("msPing", Date.now());
            buclePrincipal.aps = 0;
            buclePrincipal.maxFps = buclePrincipal.fps;
            buclePrincipal.fps = 0;
        }
    },
    Update: function(){
        screenManager.Update(this.screen);
        buclePrincipal.aps++;
    },
    Draw: function(){
        if(debug.info){
            buclePrincipal.ctx.fillStyle = '#FFFFFF';
             if(playerManager.personajes[playerManager.id] != null) buclePrincipal.ctx.fillText( buclePrincipal.dibujarFps + " | X: "+ playerManager.personajes[playerManager.id].hitbox.x + " | Y: "+ playerManager.personajes[playerManager.id].hitbox.y, 0, 20); 
             else buclePrincipal.ctx.fillText( buclePrincipal.dibujarFps , 0, 20); 
        }
        screenManager.Draw(buclePrincipal.ctx, this.screen);
        buclePrincipal.fps++;
    },
    limpiar: function(){
        buclePrincipal.ctx.fillStyle = "black";
        buclePrincipal.ctx.fillRect(0,0, canvas.width,canvas.height);
    }
};
buclePrincipal.LoadContent = function(callback){
    screenManager.LoadContent("inGame", callback);
}
