var screenManager = {
};

function screenManagerLoadContentInGame(callback){
    animationManager.LoadContent(callback);
}

screenManager.LoadContent = function(screen, callback){
    switch(screen){
        case "inGame":
            screenManagerLoadContentInGame(callback);
            break;
    }
};
screenManager.Draw = function(ctx, screen){
    switch(screen){
        case "menu":
            break;
        case "inGame":
            playerManager.Draw(ctx);
            bombManager.Draw(ctx);
            break;

    }
};
screenManager.Update = function(screen){
    switch(screen){
        case "menu":
        case "inGame":
            playerManager.Update();
            bombManager.Update();
    }
};