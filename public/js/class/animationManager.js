var animationManager = {
    imagenes: [],
    personajes: []
};
animationManager.LoadContent = function(callback){
    let ruta = [];
    // Carga leon
    console.log("Cargando...");
    this.imagenes["lion"] = [];
    ruta["lion"] = [];
    for(let n = 0;n <= 17;n++){
        ruta["lion"].push("img/lion_"+ n + ".png");
    }
    this.imagenes["block"] = [];
    ruta["block"] = [];
    for(let n = 0;n <= 0;n++){
        ruta["block"].push("img/block_"+ n + ".png");
    }
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
        var remaining = srcs[element].length;
        images[element] = new Array();
        for (var i = 0; i < srcs[element][0].length; i++) {
            img = new Image();
            images[element].push(img);
            img.onload = function() {
                --remaining;
                if (remaining == 0 && n >= srcs[element].length) {
                    fn(screenManager.screen.GAME);
                }
            };
            img.src = srcs[element][0][i];
        }
        n++;
    });
    return(images);
}