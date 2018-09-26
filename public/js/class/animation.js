class animation{
    constructor(imagenes, speed){
        this.img = imagenes;
        this.stop = true;
        this.count = 0;
        this.frames = 0;
        this.speed = speed;
        this.index;
        this.countReset = 0;
        this.comienzo = -1;
        this.final = -1;
    }
    Update(comienzo, final){
        if(!this.stop)this.frames += this.speed;
        if(this.frames >= final+1 || this.frames < comienzo)
        {
            this.frames = comienzo;
            if(this.comienzo == comienzo && this.final == final){
                this.countReset += 1;
            }else{
                this.countReset = 0;
            }
        }
        this.index = Math.floor(this.frames)%this.img.length;
        this.comienzo = comienzo;
        this.final = final;
    }
    Draw(ctx, x, y){
        if(this.img[this.index])ctx.drawImage(this.img[this.index], x, y);
    }
}