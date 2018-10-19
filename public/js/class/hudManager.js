var hudManager = {
    lifes:0,
    kills:0,
    leaderboard:[]
};
hudManager.Update = function(){
    
};
hudManager.Draw = function(ctx){
    if(hudManager.lifes >= 0){
        for(let i = hudManager.lifes; i > 0; i--){
            ctx.drawImage(animationManager.imagenes["heart"][0], canvas.width-i*20 - 32 ,10);
        }
    }
    let text = "Kills: "+ hudManager.kills;
    let width = ctx.measureText(text).width;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(canvas.width - (width + 45 + hudManager.lifes*20) , 10 ,width + 10 , 30);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(text , canvas.width - (width + 40 + hudManager.lifes*20) , 33);
    
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0,0,122,180);
    for(let i = 0; i< this.leaderboard.length; i++){
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText((i+1) + '. '+this.leaderboard[i].user + '['+this.leaderboard[i].kills +']'  , 20 , 50 + 25*i);
    }
};  
io.on('kill', kill => {
    hudManager.kills = kill;
});

io.on('lifes', data => {
    hudManager.lifes = data;
});
io.on('leaderboard', data => {
    hudManager.leaderboard = data;
});