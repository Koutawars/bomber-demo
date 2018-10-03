var menuManager = {};
menuManager.LoadContent = function(){
    this.content = document.createElement("div");
    this.content.id = "content";
    this.divo = document.createElement("div");
    this.divo.id = "contentform";

    this.inputText = document.createElement("input");
    this.inputText.type = "text";
    this.inputText.id = "inputText";
    this.button = document.createElement("button");
    this.button.id = "boton";
    this.button.append("cool");
    this.span = document.createElement("span");
    this.span.id = "texto";
    this.spanError = document.createElement("span");
    this.spanError.id = "spanError";
    this.span.append("Username: ");
    this.divo.append(this.inputText);
    this.divo.append(this.button);
    this.content.append(this.span);
    this.content.append(this.spanError);
    this.content.append(this.divo);
    this.button.addEventListener("click", function(){
        let str = menuManager.inputText.value;
        if(str == "")
            menuManager.spanError.innerHTML = "ERROR CAMPO VACIO";
        else if(/.{9}/g.test(str))
            menuManager.spanError.innerHTML = "ERROR 9 O MENOS CARACTERES";
        else if(/\s/g.test(str))
            menuManager.spanError.innerHTML = "ERROR HAY ESPACIOS";
        else{
            io.emit('user', str);
            buclePrincipal.screen = screenManager.screen.GAME;
            menuManager.Destroy();
        }
    });
    $("body").append(this.content);
}
menuManager.UnLoadContent = function(){
    this.Destroy();
}
menuManager.Destroy = function(){
    this.content.remove();
}