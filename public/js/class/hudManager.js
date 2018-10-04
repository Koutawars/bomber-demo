var hudManager = {
    lifes:0
};
hudManager.Update = function(){
    
};
hudManager.Draw = function(ctx){
    if(hudManager.lifes >= 0){
        for(let i = hudManager.lifes; i > 0; i--){
            ctx.drawImage(animationManager.imagenes["heart"][0],canvas.width-i*20 - 32 ,10);
        }
    }
};

io.on('lifes', data => {
    hudManager.lifes = data;
});