var menuManager = {pressDer: true, pressIzq: true};
menuManager.LoadContent = function(){
    this.content = document.createElement("div");
    this.content.id = "content";
    this.divo = document.createElement("div");
    this.divo.id = "contentform";
    this.divpj = document.createElement("div");
    this.divpj.id = "personajes";
    let span, img, h4;
    h4 = document.createElement("h4");
    h4.id = "selectAplayer";
    h4.append("Select a player: ");
    this.content.append(h4);
    this.clear = document.createElement("div");
    this.clear.className = "clear";
    this.content.append(this.clear);
    for(var i = 0; i < playerManager.pj.length; i++){
        span = document.createElement("span");
        img = document.createElement("img");
        img.id = "pj_"+i;
        img.alt = playerManager.pj[i]["pj"];
        img.src = playerManager.pj[i]["src"];
        img.addEventListener("click", function(e){
            let pt = e.toElement;
            let selecteds = document.getElementsByClassName("selected");
            for(let j = 0; j < selecteds.length; j++){
                selecteds[j].className = "";
            }
            window.location.hash = "#"+pt.id;
            pt.className = "selected";
        });
        span.append(img);
        this.divpj.append(span);
    }
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
    this.clear = document.createElement("div");
    this.clear.className = "clear";
    this.content.append(this.divpj);
    this.content.append(this.clear);
    this.content.append(this.span);
    this.content.append(this.spanError);
    this.content.append(this.divo);
    this.inputText.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            menuManager.button.click();
        }
    });
    this.button.addEventListener("click", function(){
        let str = menuManager.inputText.value;
        if(str == "")
            menuManager.spanError.innerHTML = "ERROR CAMPO VACIO";
        else if(/.{9}/g.test(str))
            menuManager.spanError.innerHTML = "ERROR 9 O MENOS CARACTERES";
        else if(/\s/g.test(str))
            menuManager.spanError.innerHTML = "ERROR HAY ESPACIOS";
        else{
            let persona = document.getElementsByClassName("selected");
            let pj;
            if(window.location.hash){
                let lel = window.location.hash.substring(1, window.location.hash.length);
                pj = document.getElementById(lel).alt;
            }else{
                pj = "lion";
            }
            if(persona.length != 0){
                pj = persona[0].alt;
            }
            if(animationManager.imagenes[pj]){
                io.emit('user', str, pj);
                buclePrincipal.screen = screenManager.screen.GAME;
                menuManager.Destroy();
            }else{
                console.log("error imagen invalida ");
            }
        }
    });
    $("body").append(this.content);
    
    if(window.location.hash){
        let lel = window.location.hash.substring(1, window.location.hash.length);
        if(document.getElementById(lel)){
            document.getElementById(lel).click();
        }
    }
}
menuManager.Update = function(){
    if(keys[39] && this.pressDer){
        let selecteds = document.getElementsByClassName("selected");
        if(selecteds[0]){
            let index = parseInt(selecteds[0].id.substr(3,selecteds[0].id.length));
            index+=1;
            if(document.getElementById("pj_"+index)){
                document.getElementById("pj_"+index).click();
                window.location.hash = '#pj_'+index;
            }else{
                document.getElementById("pj_0").click();
                window.location.hash = '#pj_0';
            }
        }else{
            document.getElementById("pj_0").click();
        }
        this.pressDer = false;
    }
    if(!keys[39]){
        this.pressDer = true;
    }
    if(!keys[37]){
        this.pressIzq = true;
    }
    if(keys[37] && this.pressIzq){
        let selecteds = document.getElementsByClassName("selected");
        if(selecteds[0]){
            let index = parseInt(selecteds[0].id.substr(3,selecteds[0].id.length));
            index-=1;
            if(document.getElementById("pj_"+index)){
                document.getElementById("pj_"+index).click();
                window.location.hash = '#pj_'+index;
            }else{
                index = 0;
                while(document.getElementById("pj_"+index) != undefined){
                    index+=1;
                }
                index-=1;
                document.getElementById("pj_"+index).click();
                window.location.hash = '#pj_'+index;
            }
        }else{
            document.getElementById("pj_0").click();
        }
        this.pressIzq = false;
    }
}
menuManager.UnLoadContent = function(){
    this.Destroy();
}
menuManager.Destroy = function(){
    this.content.remove();
}