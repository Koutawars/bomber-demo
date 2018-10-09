var animationManager = {
    imagenes: [],
    personajes: []
};
animationManager.LoadContent = function(callback){
    let ruta = [];
    console.log("Cargando...");
    let p = ["lion", "demon", "diver", "frog", "mouse", "princess", "pumpkin"];
    p.forEach(el => {
        this.imagenes[el] = [];
        ruta[el] = [];
        for(let n = 0;n <= 17;n++){
            ruta[el].push("img/"+el+"_"+ n + ".png");
        }
        playerManager.pj.push({src: "img/"+el+"_0.png", pj: el});
    });

    // cargar bomba
    this.imagenes["bomb"] = [];
    ruta["bomb"] = [];
    for(let n = 0;n <= 3;n++){
        ruta["bomb"].push("img/bomb_"+ n + ".png");
    }
    // cargar bloques 
    this.imagenes["block"] = [];
    ruta["block"] = [];
    for(let n = 0;n <= 6;n++){
        ruta["block"].push("img/block_"+ n + ".png");
    }
    // cargar explo 
    this.imagenes["explo"] = [];
    ruta["explo"] = [];
    for(let n = 0;n <= 27;n++){
        ruta["explo"].push("img/explo_"+ n + ".png");
    }
    // cargar poder 
    this.imagenes["poder"] = [];
    ruta["poder"] = [];
    for(let n = 0;n <= 5;n++){
        ruta["poder"].push("img/poder_"+ n + ".png");
    }
    // cargar pared
    this.imagenes["pared"] = [];
    ruta["pared"] = [];
    ruta["pared"].push("img/pared.png");
    // cargar heart
    this.imagenes["heart"] = [];
    ruta["heart"] = [];
    ruta["heart"].push("img/heart.png");
    // cargar dead
    this.imagenes["dead"] = [];
    ruta["dead"] = [];
    ruta["dead"].push("img/dead.png");
    // cargar grass
    this.imagenes["grass"] = [];
    ruta["grass"] = [];
    ruta["grass"].push("img/grass.png");
    // final para cargar todas las rutas
    Object.keys(this.imagenes).forEach(element => {
        this.personajes[element] = [];
        this.personajes[element].push(ruta[element]);
    });
    this.imagenes = this.createImages(this.personajes, callback);
}
animationManager.createImages = function(srcs, fn) {
    var n = 0, images = [];
    Object.keys(srcs).forEach(element => {
        var  img;
        var remaining = srcs[element][0].length;
        images[element] = new Array();
        for (var i = 0; i < srcs[element][0].length; i++) {
            img = new Image();
            images[element].push(img);
            img.onload = function() {
                --remaining;
                if (remaining == 0 && n == Object.keys(srcs).length-1) {
                    fn();
                };
                if(remaining == 0)
                    ++n;
            };
            img.src = srcs[element][0][i];
        }
    });
    return(images);
}