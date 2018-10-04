var hudManager = {
    lifes:0,
    kills:0 
};
hudManager.Update = function(){
    
};
hudManager.Draw = function(ctx){
    if(hudManager.lifes >= 0){
        for(let i = hudManager.lifes; i > 0; i--){
            ctx.drawImage(animationManager.imagenes["heart"][0], canvas.width-i*20 - 32 ,10);
        }
    }
    ctx.fillStyle = '#FFFFFF';
    let text = "Kills: "+ hudManager.kills;
    let width = ctx.measureText(text).width;
    ctx.fillText(text , canvas.width - (width + 40 + hudManager.lifes*20) , 33);
};  
io.on('kill', kill => {
    hudManager.kills = kill;
});

io.on('lifes', data => {
    hudManager.lifes = data;
});