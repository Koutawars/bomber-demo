var screenManager = {
    screen:{
        GAME: "inGame",
        LOADING: "loading",
        MENU: "menu"
    }
};

screenManager.LoadContent = function(screen, callback){
    switch(screen){
        case screenManager.screen.GAME:
            blockManager.LoadContent();
            break;
        case screenManager.screen.LOADING:
            animationManager.LoadContent(callback);
            break;
    }
};
screenManager.Draw = function(ctx, screen){
    switch(screen){
        case screenManager.screen.MENU:
            break;
        case screenManager.screen.GAME:
            blockManager.Draw(ctx);
            playerManager.Draw(ctx);
            bombManager.Draw(ctx);
            break;
    }
};
screenManager.Update = function(screen){
    switch(screen){
        case "menu":
        case screenManager.screen.GAME:
            blockManager.Update();
            playerManager.Update();
            bombManager.Update();
    }
};