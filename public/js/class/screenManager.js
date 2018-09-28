var screenManager = {
    screen:{
        GAME: "inGame",
        LOADING: "loading",
        MENU: "menu"
    },
    check:{
        img: false,
        block: false,
        power: false
    }
};

screenManager.LoadContent = function(screen){
    switch(screen){
        case screenManager.screen.GAME:
            break;
        case screenManager.screen.LOADING:
            blockManager.LoadContent();
            animationManager.LoadContent(
                function(){
                    screenManager.check.img = true;
                });
            powerManager.LoadContent();
            break;
    }
};
screenManager.Draw = function(ctx, screen){
    switch(screen){
        case screenManager.screen.MENU:
            break;
        case screenManager.screen.GAME:
            ctx.save();
            ctx.transform(1,0,0,1,-camera.x,-camera.y);
            blockManager.Draw(ctx);
            powerManager.Draw(ctx);
            bombManager.Draw(ctx);
            playerManager.Draw(ctx);
            ctx.restore();
            break;
    }
};
screenManager.Update = function(screen, callback){
    switch(screen){
        case screenManager.screen.LOADING:
            if(screenManager.cheking()){
                callback(screenManager.screen.GAME);
                console.log("¡Cargado!");
            }
            break;
        case screenManager.screen.MENU:
            break;
        case this.screen.GAME:
            blockManager.Update();
            powerManager.Update();
            playerManager.Update();
            bombManager.Update();
            break;
    }
};
screenManager.cheking = function(){
    return this.check.img && this.check.block && this.check.power;
}